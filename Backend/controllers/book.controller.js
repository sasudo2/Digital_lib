const Book = require('../model/book.model');
const Author = require('../model/author.model');
const Genre = require('../model/genre.model');
const Publisher = require('../model/publisher.model');
const { validationResult } = require('express-validator');

module.exports.createBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, isbn, publicationYear, authorId, genreId, publisherId } = req.body;
    const librarianId = req.user.id;

    const book = await Book.create({
      title,
      isbn,
      publicationYear,
      authorId,
      genreId,
      publisherId,
      librarianId,
    });

    res.status(201).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

module.exports.getBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, title, authorId, genreId, search } = req.query;
    const offset = (page - 1) * limit;

    let books;
    if (search) {
      // Search by title or author name with dynamic matching
      const query = `
        SELECT b.*, a.name as author_name, g.name as genre_name, p.name as publisher_name
        FROM books b
        LEFT JOIN authors a ON b.author_id = a.author_id
        LEFT JOIN genres g ON b.genre_id = g.genre_id
        LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        WHERE LOWER(b.title) ILIKE LOWER($1) OR LOWER(a.name) ILIKE LOWER($1)
        ORDER BY b.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const { pool } = require('../db/db');
      const result = await pool.query(query, [`%${search}%`, limit, offset]);
      books = result.rows;
    } else if (title) {
      books = await Book.findByTitle(title);
    } else if (authorId) {
      books = await Book.findByAuthor(authorId);
    } else if (genreId) {
      books = await Book.findByGenre(genreId);
    } else {
      books = await Book.findAll(limit, offset);
    }

    const total = await Book.countAll();
    res.status(200).json({ 
      success: true, 
      books, 
      pagination: { page, limit, total, pages: Math.ceil(total / limit) } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { title, isbn, publicationYear, authorId, genreId, publisherId } = req.body;

    const book = await Book.update(bookId, {
      title,
      isbn,
      publicationYear,
      authorId,
      genreId,
      publisherId,
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const result = await Book.delete(bookId);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.status(200).json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports.getPopularBooks = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.getRandomPopularBooks(limit);

    res.status(200).json({ 
      success: true, 
      books 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.searchSuggestions = async (req, res, next) => {
  try {
    const { query = '', limit = 10 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const suggestions = await Book.searchSuggestions(query.trim(), limit);

    res.status(200).json({ 
      success: true, 
      suggestions 
    });
  } catch (error) {
    next(error);
  }
};
