const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Captain {
  static async create({ firstname, lastname, email, password }) {
    const query = `
      INSERT INTO captains (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, firstname, lastname, email, status, created_at, updated_at
    `;
    const values = [firstname, lastname, email, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM captains WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM captains WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, firstname, lastname, email, status, created_at FROM captains ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async updateSocketId(id, socketId) {
    const query = 'UPDATE captains SET socket_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await pool.query(query, [socketId, id]);
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE captains SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static generateAuthToken(captainId) {
    return jwt.sign({ id: captainId }, process.env.JWT_SECRET, {
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

module.exports = Captain;