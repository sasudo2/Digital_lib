const { pool } = require('../db/db');

class BlacklistToken {
  static async create(token) {
    const query = 'INSERT INTO blacklist_tokens (token) VALUES ($1) RETURNING *';
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async findByToken(token) {
    const query = 'SELECT * FROM blacklist_tokens WHERE token = $1';
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async deleteOldTokens() {
    const query = "DELETE FROM blacklist_tokens WHERE created_at < NOW() - INTERVAL '24 hours'";
    await pool.query(query);
  }
}

module.exports = BlacklistToken;