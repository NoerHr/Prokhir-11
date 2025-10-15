const pool = require("../config/database");

class ClaimRepository {
    async findAll() {
        const query = `
            SELECT 
                cr.*,
                b.name as item_name,
                u.name as user_name,
                u.nim as user_nim
            FROM claim_requests cr
            JOIN barang b ON cr.item_id = b.id
            JOIN users u ON cr.user_id = u.id
            ORDER BY cr.created_at DESC
        `;
        const result = await pool.query(query);
        return result.rows.map(row => ({
            id: row.id,
            itemId: row.item_id,
            itemName: row.item_name,
            userId: row.user_id,
            userName: row.user_name,
            userNim: row.user_nim,
            alasan: row.alasan,
            buktiUrl: row.bukti_url,
            status: row.status,
            adminNote: row.admin_note,
            createdAt: row.created_at,
            processedAt: row.processed_at,
        }));
    }

    async findById(id) {
        const query = `
            SELECT 
                cr.*,
                b.name as item_name,
                u.name as user_name,
                u.nim as user_nim
            FROM claim_requests cr
            JOIN barang b ON cr.item_id = b.id
            JOIN users u ON cr.user_id = u.id
            WHERE cr.id = $1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return {
            id: row.id,
            itemId: row.item_id,
            itemName: row.item_name,
            userId: row.user_id,
            userName: row.user_name,
            userNim: row.user_nim,
            alasan: row.alasan,
            buktiUrl: row.bukti_url,
            status: row.status,
            adminNote: row.admin_note,
            createdAt: row.created_at,
            processedAt: row.processed_at,
        };
    }

    async findByItemId(itemId) {
        const query = "SELECT * FROM claim_requests WHERE item_id = $1";
        const result = await pool.query(query, [itemId]);
        return result.rows;
    }

    async findByUserId(userId) {
        const query = `
            SELECT 
                cr.*,
                b.name as item_name
            FROM claim_requests cr
            JOIN barang b ON cr.item_id = b.id
            WHERE cr.user_id = $1
            ORDER BY cr.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows.map(row => ({
            id: row.id,
            itemId: row.item_id,
            itemName: row.item_name,
            userId: row.user_id,
            alasan: row.alasan,
            buktiUrl: row.bukti_url,
            status: row.status,
            adminNote: row.admin_note,
            createdAt: row.created_at,
            processedAt: row.processed_at,
        }));
    }

    async create(claimData) {
        const query = `
            INSERT INTO claim_requests (item_id, user_id, alasan, bukti_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [
            claimData.itemId,
            claimData.userId,
            claimData.alasan,
            claimData.buktiUrl,
        ];
        const result = await pool.query(query, values);
        return this.findById(result.rows[0].id);
    }

    async update(id, updateData) {
        const query = `
            UPDATE claim_requests
            SET 
                status = COALESCE($1, status),
                admin_note = COALESCE($2, admin_note),
                processed_at = COALESCE($3, processed_at)
            WHERE id = $4
            RETURNING *
        `;
        const values = [
            updateData.status || null,
            updateData.adminNote || null,
            updateData.processedAt || null,
            id,
        ];
        await pool.query(query, values);
        return this.findById(id);
    }

    async delete(id) {
        const query = "DELETE FROM claim_requests WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);
        return result.rowCount > 0;
    }
}

module.exports = new ClaimRepository();
