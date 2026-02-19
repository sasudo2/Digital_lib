const { pool } = require('../db/db');

class Author {
  static async create({ name }) {
    const query = `
      INSERT INTO authors (name)
      VALUES ($1)
      RETURNING author_id, name, created_at
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async findById(authorId) {
    const query = 'SELECT * FROM authors WHERE author_id = $1';
    const result = await pool.query(query, [authorId]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM authors';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByName(name) {
    const query = 'SELECT * FROM authors WHERE name ILIKE $1';
    const result = await pool.query(query, [`%${name}%`]);
    return result.rows;
  }

  static async update(authorId, { name }) {
    const query = `
      UPDATE authors SET name = $1 WHERE author_id = $2
      RETURNING author_id, name, created_at
    `;
    const result = await pool.query(query, [name, authorId]);
    return result.rows[0];
  }

  static async delete(authorId) {
    const query = 'DELETE FROM authors WHERE author_id = $1 RETURNING author_id';
    const result = await pool.query(query, [authorId]);
    return result.rows[0];
  }
}

module.exports = Author;
