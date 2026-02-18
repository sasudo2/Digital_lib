const { pool } = require('../db/db');

class BookUsage {
  static async create({ readerId, bookId, librarianId, actionType, issueDate }) {
    const query = `
      INSERT INTO book_usage (reader_id, book_id, librarian_id, action_type, issue_date, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING usage_id, reader_id, book_id, librarian_id, action_type, issue_date, return_date, duration_minutes, status, created_at
    `;
    const values = [readerId, bookId, librarianId, actionType, issueDate];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(usageId) {
    const query = `
      SELECT bu.*, b.title as book_title, a.name as author_name, u.firstname as reader_name, u.email as reader_email
      FROM book_usage bu
      LEFT JOIN books b ON bu.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN users u ON bu.reader_id = u.id
      WHERE bu.usage_id = $1
    `;
    const result = await pool.query(query, [usageId]);
    return result.rows[0];
  }

  static async findByReaderId(readerId) {
    const query = `
      SELECT bu.*, b.title as book_title, a.name as author_name
      FROM book_usage bu
      LEFT JOIN books b ON bu.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE bu.reader_id = $1
      ORDER BY bu.issue_date DESC
    `;
    const result = await pool.query(query, [readerId]);
    return result.rows;
  }

  static async findByBookId(bookId) {
    const query = `
      SELECT bu.*, u.firstname as reader_name, u.email as reader_email
      FROM book_usage bu
      LEFT JOIN users u ON bu.reader_id = u.id
      WHERE bu.book_id = $1
      ORDER BY bu.issue_date DESC
    `;
    const result = await pool.query(query, [bookId]);
    return result.rows;
  }

  static async returnBook(usageId, returnDate, durationMinutes) {
    const query = `
      UPDATE book_usage 
      SET return_date = $1, duration_minutes = $2, status = 'returned'
      WHERE usage_id = $3
      RETURNING usage_id, reader_id, book_id, librarian_id, action_type, issue_date, return_date, duration_minutes, status, created_at
    `;
    const result = await pool.query(query, [returnDate, durationMinutes, usageId]);
    return result.rows[0];
  }

  static async getActiveIssues(readerId) {
    const query = `
      SELECT bu.*, b.title as book_title, a.name as author_name
      FROM book_usage bu
      LEFT JOIN books b ON bu.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE bu.reader_id = $1 AND bu.status = 'active'
      ORDER BY bu.issue_date ASC
    `;
    const result = await pool.query(query, [readerId]);
    return result.rows;
  }

  static async getReadingHistory(readerId) {
    const query = `
      SELECT bu.*, b.title as book_title, a.name as author_name
      FROM book_usage bu
      LEFT JOIN books b ON bu.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE bu.reader_id = $1 AND bu.status = 'returned'
      ORDER BY bu.return_date DESC
    `;
    const result = await pool.query(query, [readerId]);
    return result.rows;
  }
}

module.exports = BookUsage;
