const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class User {
  static async create({ firstname, lastname, email, password, status = 'active', librarianId = null }) {
    const query = `
      INSERT INTO users (firstname, lastname, email, password, status, librarian_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, firstname, lastname, email, status, librarian_id, socket_id, created_at, updated_at
    `;
    const values = [firstname, lastname, email, password, status, librarianId];
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

  static async findByLibrarianId(librarianId) {
    const query = 'SELECT * FROM users WHERE librarian_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [librarianId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async addTimeSpent(id, minutes) {
    const query = `
      UPDATE users 
      SET time_spent_minutes = COALESCE(time_spent_minutes, 0) + $1, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [minutes, id]);
    return result.rows[0];
  }

  static async addReadBook(id, bookId) {
    const query = `
      INSERT INTO user_read_books (user_id, book_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [id, bookId]);
    return result.rows[0];
  }

  static async getUserReadingStats(id) {
    const query = `
      SELECT 
        u.id, u.firstname, u.lastname, u.email, 
        COALESCE(u.time_spent_minutes, 0) as time_spent_minutes,
        COUNT(DISTINCT urb.book_id) as books_read
      FROM users u
      LEFT JOIN user_read_books urb ON u.id = urb.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.firstname, u.lastname, u.email
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getReadBooks(id) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name
      FROM user_read_books urb
      JOIN books b ON urb.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      WHERE urb.user_id = $1
      ORDER BY urb.created_at DESC
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  }

  static async addFavoriteBook(userId, bookId) {
    const query = `
      INSERT INTO user_favorite_books (user_id, book_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0];
  }

  static async removeFavoriteBook(userId, bookId) {
    const query = `
      DELETE FROM user_favorite_books 
      WHERE user_id = $1 AND book_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0];
  }

  static async getFavoriteBooks(userId) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating
      FROM user_favorite_books ufb
      JOIN books b ON ufb.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      WHERE ufb.user_id = $1
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      ORDER BY ufb.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async isFavorite(userId, bookId) {
    const query = `
      SELECT * FROM user_favorite_books 
      WHERE user_id = $1 AND book_id = $2
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows.length > 0;
  }

  static async addBorrowingRecord(userId, bookId, librarianId) {
    const query = `
      INSERT INTO book_borrowing_history (user_id, book_id, librarian_id, status)
      VALUES ($1, $2, $3, 'active')
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId, librarianId]);
    return result.rows[0];
  }

  static async returnBorrowedBook(borrowId, returnDate, durationDays) {
    const query = `
      UPDATE book_borrowing_history 
      SET return_date = $1, duration_days = $2, status = 'returned'
      WHERE borrow_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [returnDate, durationDays, borrowId]);
    return result.rows[0];
  }

  static async getBorrowingHistory(userId) {
    const query = `
      SELECT bbh.*, b.title as book_title, a.name as author_name, c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM book_borrowing_history bbh
      JOIN books b ON bbh.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN captains c ON bbh.librarian_id = c.id
      WHERE bbh.user_id = $1
      ORDER BY bbh.borrow_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getActiveBorrowedBooks(userId) {
    const query = `
      SELECT bbh.*, b.title as book_title, a.name as author_name, c.firstname as librarian_firstname, c.lastname as librarian_lastname
      FROM book_borrowing_history bbh
      JOIN books b ON bbh.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN captains c ON bbh.librarian_id = c.id
      WHERE bbh.user_id = $1 AND bbh.status = 'active'
      ORDER BY bbh.borrow_date DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
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