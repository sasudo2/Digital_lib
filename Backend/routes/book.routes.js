const express = require('express');
const { body } = require('express-validator');
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Create book (librarian only)
router.post(
  '/create',
  authMiddleware.authCaptain,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('isbn').notEmpty().withMessage('ISBN is required'),
    body('publicationYear').isInt().withMessage('Publication year must be a number'),
    body('authorId').optional().isInt().withMessage('Author ID must be a number'),
    body('genreId').optional().isInt().withMessage('Genre ID must be a number'),
    body('publisherId').optional().isInt().withMessage('Publisher ID must be a number'),
  ],
  bookController.createBook
);

// Get all books
router.get('/all', bookController.getAllBooks);

// Get popular books (top rated)
router.get('/popular', bookController.getPopularBooks);

// Get book by ID
router.get('/:bookId', bookController.getBook);

// Update book (librarian only)
router.put(
  '/:bookId',
  authMiddleware.authCaptain,
  bookController.updateBook
);

// Delete book (librarian only)
router.delete(
  '/:bookId',
  authMiddleware.authCaptain,
  bookController.deleteBook
);

module.exports = router;
