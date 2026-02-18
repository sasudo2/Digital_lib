const express = require('express');
const { body } = require('express-validator');
const readingProgressController = require('../controllers/readingProgress.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Update reading progress
router.put(
  '/update',
  authMiddleware.authUser,
  [
    body('bookId').isInt().withMessage('Book ID is required'),
    body('currentPage').optional().isInt({ min: 0 }).withMessage('Current page must be a positive number'),
    body('isFinished').optional().isBoolean().withMessage('isFinished must be boolean'),
  ],
  readingProgressController.updateProgress
);

// Get progress for a specific book
router.get(
  '/:bookId',
  authMiddleware.authUser,
  readingProgressController.getProgress
);

// Get all reading progress for user
router.get(
  '/',
  authMiddleware.authUser,
  readingProgressController.getUserProgress
);

// Get finished books
router.get(
  '/finished/all',
  authMiddleware.authUser,
  readingProgressController.getFinishedBooks
);

// Get in-progress books
router.get(
  '/in-progress/all',
  authMiddleware.authUser,
  readingProgressController.getInProgressBooks
);

// Mark book as finished
router.put(
  '/:bookId/finish',
  authMiddleware.authUser,
  readingProgressController.markAsFinished
);

module.exports = router;
