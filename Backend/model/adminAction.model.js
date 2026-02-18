const { pool } = require('../db/db');

class AdminAction {
  static async create({ readerId, librarianId, actionType, notes }) {
    const query = `
      INSERT INTO admin_actions (reader_id, librarian_id, action_type, action_date, notes)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
      RETURNING action_id, reader_id, librarian_id, action_type, action_date, notes
    `;
    const values = [readerId, librarianId, actionType, notes];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(actionId) {
    const query = `
      SELECT aa.*, 
             u.firstname as reader_firstname, u.lastname as reader_lastname, u.email as reader_email,
             c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM admin_actions aa
      LEFT JOIN users u ON aa.reader_id = u.id
      LEFT JOIN captains c ON aa.librarian_id = c.id
      WHERE aa.action_id = $1
    `;
    const result = await pool.query(query, [actionId]);
    return result.rows[0];
  }

  static async findByReaderId(readerId) {
    const query = `
      SELECT aa.*, 
             c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM admin_actions aa
      LEFT JOIN captains c ON aa.librarian_id = c.id
      WHERE aa.reader_id = $1
      ORDER BY aa.action_date DESC
    `;
    const result = await pool.query(query, [readerId]);
    return result.rows;
  }

  static async findByLibrarianId(librarianId) {
    const query = `
      SELECT aa.*, 
             u.firstname as reader_firstname, u.lastname as reader_lastname, u.email as reader_email
      FROM admin_actions aa
      LEFT JOIN users u ON aa.reader_id = u.id
      WHERE aa.librarian_id = $1
      ORDER BY aa.action_date DESC
    `;
    const result = await pool.query(query, [librarianId]);
    return result.rows;
  }

  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT aa.*, 
             u.firstname as reader_firstname, u.lastname as reader_lastname, u.email as reader_email,
             c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM admin_actions aa
      LEFT JOIN users u ON aa.reader_id = u.id
      LEFT JOIN captains c ON aa.librarian_id = c.id
      ORDER BY aa.action_date DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async getActionsByType(actionType) {
    const query = `
      SELECT aa.*, 
             u.firstname as reader_firstname, u.lastname as reader_lastname,
             c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM admin_actions aa
      LEFT JOIN users u ON aa.reader_id = u.id
      LEFT JOIN captains c ON aa.librarian_id = c.id
      WHERE aa.action_type = $1
      ORDER BY aa.action_date DESC
    `;
    const result = await pool.query(query, [actionType]);
    return result.rows;
  }
}

module.exports = AdminAction;
