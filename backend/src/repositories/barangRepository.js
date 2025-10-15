const pool = require("../config/database");

class BarangRepository {
  async findAll() {
    const query = `
      SELECT 
        b.*,
        k.id as kategori_id,
        k.name as kategori_name
      FROM barang b
      JOIN kategori_barang k ON b.category_id = k.id
      ORDER BY b.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = `
      SELECT 
        b.*,
        k.id as kategori_id,
        k.name as kategori_name
      FROM barang b
      JOIN kategori_barang k ON b.category_id = k.id
      WHERE b.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async create(data) {
    const query = `
      INSERT INTO barang (
        name, description, category_id, found_date, location, 
        image_url, finder_name, finder_nim, finder_contact, finder_photo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      data.name,
      data.description,
      data.category_id,
      data.found_date,
      data.location,
      data.image_url,
      data.finder_name,
      data.finder_nim,
      data.finder_contact,
      data.finder_photo_url,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id, data) {
    const query = `
      UPDATE barang
      SET 
        status = COALESCE($1, status),
        claimer_name = COALESCE($2, claimer_name),
        claimer_nim = COALESCE($3, claimer_nim),
        claimer_photo_url = COALESCE($4, claimer_photo_url),
        claimed_date = COALESCE($5, claimed_date)
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      data.status || null,
      data.claimer_name || null,
      data.claimer_nim || null,
      data.claimer_photo_url || null,
      data.claimed_date || null,
      id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id) {
    const query = "DELETE FROM barang WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = new BarangRepository();
