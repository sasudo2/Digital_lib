const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class User {
  static async create({ firstname, lastname, email, password }) {
    const query = `
      INSERT INTO users (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, firstname, lastname, email, socket_id, created_at, updated_at
    `;
    const values = [firstname, lastname, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateSocketId(id, socketId) {
    const query = 'UPDATE users SET socket_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [socketId, id]);
  }

  static generateAuthToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = User;