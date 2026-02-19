const { pool } = require('../db/db');

class Bookmark {
  // Add bookmark
  static async addBookmark(userId, bookId) {
    const query = `
      INSERT INTO user_bookmarks (user_id, book_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0] || { success: true, message: 'Already bookmarked' };
  }

  // Remove bookmark
  static async removeBookmark(userId, bookId) {
    const query = `
      DELETE FROM user_bookmarks
      WHERE user_id = $1 AND book_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows[0];
  }

  // Get all bookmarks for user
  static async getUserBookmarks(userId) {
    const query = `
      SELECT ub.*, b.title, b.archive_url, a.name as author_name, g.name as genre_name, 
             COUNT(*) OVER () as total_count
      FROM user_bookmarks ub
      JOIN books b ON ub.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      WHERE ub.user_id = $1
      ORDER BY ub.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Check if book is bookmarked
  static async isBookmarked(userId, bookId) {
    const query = `
      SELECT * FROM user_bookmarks
      WHERE user_id = $1 AND book_id = $2
    `;
    const result = await pool.query(query, [userId, bookId]);
    return result.rows.length > 0;
  }

  // Get bookmark count
  static async getBookmarkCount(userId) {
    const query = `
      SELECT COUNT(*) as count FROM user_bookmarks
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Bookmark;
