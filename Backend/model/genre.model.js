const { pool } = require('../db/db');

class Genre {
  static async create({ name }) {
    const query = `
      INSERT INTO genres (name)
      VALUES ($1)
      RETURNING genre_id, name, created_at
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async findById(genreId) {
    const query = 'SELECT * FROM genres WHERE genre_id = $1';
    const result = await pool.query(query, [genreId]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM genres';
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(genreId, { name }) {
    const query = `
      UPDATE genres SET name = $1 WHERE genre_id = $2
      RETURNING genre_id, name, created_at
    `;
    const result = await pool.query(query, [name, genreId]);
    return result.rows[0];
  }

  static async delete(genreId) {
    const query = 'DELETE FROM genres WHERE genre_id = $1 RETURNING genre_id';
    const result = await pool.query(query, [genreId]);
    return result.rows[0];
  }
}

module.exports = Genre;
