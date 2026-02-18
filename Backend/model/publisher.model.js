const { pool } = require('../db/db');

class Publisher {
  static async create({ name, country }) {
    const query = `
      INSERT INTO publishers (name, country)
      VALUES ($1, $2)
      RETURNING publisher_id, name, country, created_at
    `;
    const result = await pool.query(query, [name, country]);
    return result.rows[0];
  }

  static async findById(publisherId) {
    const query = 'SELECT * FROM publishers WHERE publisher_id = $1';
    const result = await pool.query(query, [publisherId]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM publishers';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findByName(name) {
    const query = 'SELECT * FROM publishers WHERE name ILIKE $1';
    const result = await pool.query(query, [`%${name}%`]);
    return result.rows;
  }

  static async update(publisherId, { name, country }) {
    const query = `
      UPDATE publishers SET name = $1, country = $2 WHERE publisher_id = $3
      RETURNING publisher_id, name, country, created_at
    `;
    const result = await pool.query(query, [name, country, publisherId]);
    return result.rows[0];
  }

  static async delete(publisherId) {
    const query = 'DELETE FROM publishers WHERE publisher_id = $1 RETURNING publisher_id';
    const result = await pool.query(query, [publisherId]);
    return result.rows[0];
  }
}

module.exports = Publisher;
