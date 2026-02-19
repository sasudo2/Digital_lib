const { pool } = require('../db/db');

class Review {
  static async create({ bookId, readerId, rating, comment }) {
    const query = `
      INSERT INTO reviews (book_id, reader_id, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING review_id, book_id, reader_id, rating, comment, created_at
    `;
    const values = [bookId, readerId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(reviewId) {
    const query = 'SELECT * FROM reviews WHERE review_id = $1';
    const result = await pool.query(query, [reviewId]);
    return result.rows[0];
  }

  static async findByBookId(bookId) {
    const query = `
      SELECT r.*, u.firstname, u.lastname, u.email
      FROM reviews r
      LEFT JOIN users u ON r.reader_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [bookId]);
    return result.rows;
  }

  static async findByReaderId(readerId) {
    const query = `
      SELECT r.*, b.title as book_title, a.name as author_name
      FROM reviews r
      LEFT JOIN books b ON r.book_id = b.book_id
      LEFT JOIN authors a ON b.author_id = a.author_id
      WHERE r.reader_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [readerId]);
    return result.rows;
  }

  static async getAverageRating(bookId) {
    const query = 'SELECT AVG(rating) as average_rating FROM reviews WHERE book_id = $1';
    const result = await pool.query(query, [bookId]);
    return result.rows[0];
  }

  static async update(reviewId, { rating, comment }) {
    const query = `
      UPDATE reviews 
      SET rating = COALESCE($1, rating), 
          comment = COALESCE($2, comment)
      WHERE review_id = $3
      RETURNING review_id, book_id, reader_id, rating, comment, created_at
    `;
    const result = await pool.query(query, [rating, comment, reviewId]);
    return result.rows[0];
  }

  static async delete(reviewId) {
    const query = 'DELETE FROM reviews WHERE review_id = $1 RETURNING review_id';
    const result = await pool.query(query, [reviewId]);
    return result.rows[0];
  }

  static async findByBookAndReader(bookId, readerId) {
    const query = 'SELECT * FROM reviews WHERE book_id = $1 AND reader_id = $2';
    const result = await pool.query(query, [bookId, readerId]);
    return result.rows[0];
  }
}

module.exports = Review;
