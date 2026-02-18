const { pool } = require('../db/db');

class Book {
  static async create({ title, isbn, publicationYear, bookUrl, authorId, genreId, publisherId, librarianId }) {
    const query = `
      INSERT INTO books (title, isbn, publication_year, book_url, author_id, genre_id, publisher_id, librarian_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING book_id, title, isbn, publication_year, book_url, author_id, genre_id, publisher_id, librarian_id, created_at, updated_at
    `;
    const values = [title, isbn, publicationYear, bookUrl, authorId, genreId, publisherId, librarianId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(bookId) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name, p.country,
             AVG(r.rating) as average_rating, COUNT(DISTINCT r.review_id) as review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      WHERE b.book_id = $1
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
    `;
    const result = await pool.query(query, [bookId]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating, COUNT(DISTINCT r.review_id) as review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      ORDER BY average_rating DESC NULLS LAST, b.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async findByTitle(title) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      WHERE b.title ILIKE $1
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      ORDER BY average_rating DESC NULLS LAST
    `;
    const result = await pool.query(query, [`%${title}%`]);
    return result.rows;
  }

  static async findByAuthor(authorId) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      WHERE b.author_id = $1
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      ORDER BY average_rating DESC NULLS LAST
    `;
    const result = await pool.query(query, [authorId]);
    return result.rows;
  }

  static async findByGenre(genreId) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      WHERE b.genre_id = $1
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      ORDER BY average_rating DESC NULLS LAST
    `;
    const result = await pool.query(query, [genreId]);
    return result.rows;
  }

  static async getTopRatedBooks(limit = 10) {
    const query = `
      SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name,
             AVG(r.rating) as average_rating, COUNT(DISTINCT r.review_id) as review_count
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.author_id
      LEFT JOIN genres g ON b.genre_id = g.genre_id
      LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
      LEFT JOIN reviews r ON b.book_id = r.book_id
      GROUP BY b.book_id, a.author_id, g.genre_id, p.publisher_id
      HAVING COUNT(DISTINCT r.review_id) > 0
      ORDER BY average_rating DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async update(bookId, { title, isbn, publicationYear, authorId, genreId, publisherId }) {
    const query = `
      UPDATE books 
      SET title = COALESCE($1, title), 
          isbn = COALESCE($2, isbn),
          publication_year = COALESCE($3, publication_year),
          author_id = COALESCE($4, author_id),
          genre_id = COALESCE($5, genre_id),
          publisher_id = COALESCE($6, publisher_id),
          updated_at = CURRENT_TIMESTAMP
      WHERE book_id = $7
      RETURNING book_id, title, isbn, publication_year, author_id, genre_id, publisher_id, librarian_id, created_at, updated_at
    `;
    const values = [title, isbn, publicationYear, authorId, genreId, publisherId, bookId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(bookId) {
    const query = 'DELETE FROM books WHERE book_id = $1 RETURNING book_id';
    const result = await pool.query(query, [bookId]);
    return result.rows[0];
  }

  static async countAll() {
    const query = 'SELECT COUNT(*) as total FROM books';
    const result = await pool.query(query);
    return parseInt(result.rows[0].total);
  }
}

module.exports = Book;
