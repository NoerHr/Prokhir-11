require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = 3001;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

cloudinary.config({
    secure: true,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    reject(new Error('Gagal mengunggah ke Cloudinary: ' + error.message));
                } else if (result && result.secure_url) {
                    resolve(result);
                } else {
                    reject(new Error('Respons Cloudinary tidak valid.'));
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

app.get('/api/items', async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `
            SELECT
                i.id, i.name, i.description, i.category,
                TO_CHAR(i.found_date, 'YYYY-MM-DD') as "foundDate",
                i.location, i.image_url as "imageUrl", i.status,
                i.created_at as "createdAt", -- Menambahkan field ini
                json_build_object(
                    'name', f.name, 'nim', f.nim, 'contact', f.contact, 'photoUrl', f.photo_url
                ) as finder,
                (SELECT json_build_object(
                    'name', c.name, 'nim', c.nim, 
                    'claimedDate', TO_CHAR(c.claimed_date, 'YYYY-MM-DD'), 
                    'photoUrl', c.photo_url
                ) FROM claimers c WHERE c.item_id = i.id) as claimer
            FROM items i
            LEFT JOIN finders f ON i.id = f.item_id
            ORDER BY i.created_at DESC;
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data dari server' });
    } finally {
        client.release();
    }
});

app.post('/api/items', upload.fields([{ name: 'itemPhoto', maxCount: 1 }, { name: 'finderPhoto', maxCount: 1 }]), async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const itemPhotoResult = await uploadToCloudinary(req.files.itemPhoto[0].buffer);
        const finderPhotoResult = await uploadToCloudinary(req.files.finderPhoto[0].buffer);

        const itemData = req.body;
        const itemQuery = `
            INSERT INTO items (name, description, category, found_date, location, image_url)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
        `;
        const itemResult = await client.query(itemQuery, [itemData.name, itemData.description, itemData.category, itemData.foundDate, itemData.location, itemPhotoResult.secure_url]);
        const newItemId = itemResult.rows[0].id;

        const finderQuery = `
            INSERT INTO finders (item_id, name, nim, contact, photo_url)
            VALUES ($1, $2, $3, $4, $5);
        `;
        await client.query(finderQuery, [newItemId, itemData.finderName, itemData.finderNim, itemData.finderContact, finderPhotoResult.secure_url]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Barang berhasil ditambahkan', newItemId });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    } finally {
        client.release();
    }
});

app.patch('/api/items/:id/claim', upload.single('claimerPhoto'), async (req, res) => {
    const { id } = req.params;
    const { name, nim } = req.body;
    const client = await pool.connect();

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Foto penerima dibutuhkan.' });
        }

        await client.query('BEGIN');

        const claimerPhotoResult = await uploadToCloudinary(req.file.buffer);

        const updateItemQuery = `UPDATE items SET status = 'Diambil' WHERE id = $1;`;
        await client.query(updateItemQuery, [id]);

        const insertClaimerQuery = `
            INSERT INTO claimers (item_id, name, nim, claimed_date, photo_url)
            VALUES ($1, $2, $3, CURRENT_DATE, $4);
        `;
        await client.query(insertClaimerQuery, [id, name, nim, claimerPhotoResult.secure_url]);

        await client.query('COMMIT');
        res.status(200).json({ message: 'Barang berhasil diklaim.' });

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat klaim barang' });
    } finally {
        client.release();
    }
});

app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const imageUrlQuery = `
            SELECT i.image_url, f.photo_url as finder_photo_url, c.photo_url as claimer_photo_url
            FROM items i
            LEFT JOIN finders f ON i.id = f.item_id
            LEFT JOIN claimers c ON i.id = c.item_id
            WHERE i.id = $1;
        `;
        const imageUrlResult = await client.query(imageUrlQuery, [id]);
        
        if (imageUrlResult.rows.length > 0) {
            const { image_url, finder_photo_url, claimer_photo_url } = imageUrlResult.rows[0];
            const urlsToDelete = [image_url, finder_photo_url, claimer_photo_url].filter(Boolean);
            
            const publicIds = urlsToDelete.map(url => {
                const parts = url.split('/');
                const fileName = parts[parts.length - 1];
                return fileName.split('.')[0];
            });
            
            if(publicIds.length > 0) {
                await Promise.all(publicIds.map(pid => cloudinary.uploader.destroy(pid)));
            }
        }
        
        const deleteQuery = `DELETE FROM items WHERE id = $1;`;
        const deleteResult = await client.query(deleteQuery, [id]);

        await client.query('COMMIT');

        if (deleteResult.rowCount > 0) {
            res.status(200).json({ message: 'Barang berhasil dihapus.' });
        } else {
            res.status(404).json({ message: 'Barang tidak ditemukan.' });
        }

    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat menghapus barang.' });
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});