const { pool } = require('../db/db');

class ReadingProgress {
  // Add or update reading progress
  static async updateProgress({ userId, bookId, currentPage, isFinished }) {
    const query = `
      INSERT INTO user_reading_progress (user_id, book_id, current_page, is_finished, finished_at)
      VALUES ($1, $2, $3, $4, ${isFinished ? 'CURRENT_TIMESTAMP' : 'NULL'})
      ON CONFLICT (user_id, book_id)
      DO UPDATE SET 
        current_page = $3,
        is_finished = $4,
        finished_at = ${isFinished ? 'CURRENT_TIMESTAMP' : 'NULL'},
        last_read_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId, currentPage, isFinished]);
    return result.rows[0];
  }

  // Get reading progress for a book
  static async getProgress(userId, bookId) {
    const query = `
      SELECT * FROM user_reading_progress
      WHERE user_id = $1 AND book_id = $2
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0];
  }

  // Get all reading progress for a user
  static async getUserProgress(userId) {
    const query = `
      SELECT urp.*, b.title, b.archive_url, a.name as author_name, g.name as genre_name
      FROM user_reading_progress urp
      JOIN books b ON urp.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      WHERE urp.user_id = $1
      ORDER BY urp.last_read_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get finished books for a user
  static async getFinishedBooks(userId) {
    const query = `
      SELECT urp.*, b.title, b.archive_url, a.name as author_name, g.name as genre_name
      FROM user_reading_progress urp
      JOIN books b ON urp.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      WHERE urp.user_id = $1 AND urp.is_finished = TRUE
      ORDER BY urp.finished_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get in-progress books
  static async getInProgressBooks(userId) {
    const query = `
      SELECT urp.*, b.title, b.archive_url, a.name as author_name, g.name as genre_name
      FROM user_reading_progress urp
      JOIN books b ON urp.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      WHERE urp.user_id = $1 AND urp.is_finished = FALSE
      ORDER BY urp.last_read_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Mark book as finished
  static async markAsFinished(userId, bookId) {
    return this.updateProgress({ userId, bookId, currentPage: null, isFinished: true });
  }

  // Delete reading progress
  static async deleteProgress(userId, bookId) {
    const query = `
      DELETE FROM user_reading_progress
      WHERE user_id = $1 AND book_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0];
  }
}

module.exports = ReadingProgress;
