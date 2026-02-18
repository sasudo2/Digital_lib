const express = require('express');
const { body } = require('express-validator');
const bookUsageController = require('../controllers/bookUsage.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Issue book (librarian only)
router.post(
  '/issue',
  authMiddleware.authCaptain,
  [
    body('bookId').isInt().withMessage('Book ID is required and must be a number'),
    body('readerId').isInt().withMessage('Reader ID is required and must be a number'),
    body('issueDate').optional().isISO8601().withMessage('Issue date must be a valid date'),
  ],
  bookUsageController.issueBook
);

// Return book (librarian only)
router.put(
  '/:usageId/return',
  authMiddleware.authCaptain,
  [
    body('returnDate').optional().isISO8601(),
    body('durationMinutes').optional().isInt({ min: 0 }),
  ],
  bookUsageController.returnBook
);

// Get active issues (reader)
router.get('/reader/active', authMiddleware.authUser, bookUsageController.getActiveIssues);

// Get reading history (reader)
router.get('/reader/history', authMiddleware.authUser, bookUsageController.getReadingHistory);

// Get usage by ID
router.get('/:usageId', bookUsageController.getUsageById);

// Get reader's usage
router.get('/reader/:readerId', bookUsageController.getReaderUsage);

// Get book usage
router.get('/book/:bookId', bookUsageController.getBookUsage);

module.exports = router;
