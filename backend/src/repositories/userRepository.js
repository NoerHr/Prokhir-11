const pool = require("../config/database");

class UserRepository {
  async findByCredentials(name, password) {
    const query = "SELECT * FROM users WHERE name = $1 AND password = $2 AND role = 'admin'";
    const result = await pool.query(query, [name, password]);
    return result.rows[0] || null;
  }

  async findByName(name) {
    const query = "SELECT * FROM users WHERE name = $1 AND role = 'user'";
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  async findByNim(nim) {
    const query = "SELECT * FROM users WHERE nim = $1";
    const result = await pool.query(query, [nim]);
    return result.rows[0] || null;
  }

  async create(userData) {
    const query = `
      INSERT INTO users (name, nim, email, password, contact, role)
      VALUES ($1, $2, $3, $4, $5, 'user')
      RETURNING *
    `;
    const values = [
      userData.name,
      userData.nim,
      userData.email,
      userData.password,
      userData.contact,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async findUserByCredentials(name, password) {
    const query = "SELECT * FROM users WHERE name = $1 AND password = $2 AND role = 'user'";
    const result = await pool.query(query, [name, password]);
    return result.rows[0] || null;
  }
}

module.exports = new UserRepository();
