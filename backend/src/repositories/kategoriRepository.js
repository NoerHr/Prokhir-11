const pool = require("../config/database");

class KategoriRepository {
    async findAll() {
        const query = "SELECT * FROM kategori_barang ORDER BY created_at DESC, id DESC";
        const result = await pool.query(query);
        return result.rows;
    }

    async findAllActive() {
        const query = "SELECT * FROM kategori_barang WHERE status = true ORDER BY name ASC";
        const result = await pool.query(query);
        return result.rows;
    }

    async findById(id) {
        const query = "SELECT * FROM kategori_barang WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async create(kategoriData) {
        const query = `
            INSERT INTO kategori_barang (name, description, status)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [kategoriData.name, kategoriData.description, kategoriData.status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async updateStatus(id, status) {
        const query = `
            UPDATE kategori_barang
            SET status = $1
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0] || null;
    }

    async delete(id) {
        const query = "DELETE FROM kategori_barang WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);
        return result.rowCount > 0;
    }
}

module.exports = new KategoriRepository();
