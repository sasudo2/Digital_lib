const express = require('express');
const { body } = require('express-validator');
const borrowingController = require('../controllers/borrowing.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Get borrowing history
router.get(
  '/history',
  authMiddleware.authUser,
  borrowingController.getBorrowingHistory
);

// Get active borrowed books
router.get(
  '/active',
  authMiddleware.authUser,
  borrowingController.getActiveBorrowedBooks
);

// Borrow a book
router.post(
  '/borrow',
  authMiddleware.authUser,
  [body('bookId').isInt().withMessage('Book ID is required')],
  borrowingController.borrowBook
);

// Return a borrowed book
router.put(
  '/return/:borrowingId',
  authMiddleware.authUser,
  borrowingController.returnBorrowedBook
);

module.exports = router;
