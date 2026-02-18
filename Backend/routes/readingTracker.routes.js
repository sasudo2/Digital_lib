const express = require('express');
const { body } = require('express-validator');
const readingTrackerController = require('../controllers/readingTracker.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Update reading time after user finishes reading
router.post(
  '/update-time',
  authMiddleware.authUser,
  [
    body('bookId').isInt().withMessage('Book ID is required and must be a number'),
    body('timeSpentMinutes').isInt({ min: 1 }).withMessage('Time spent must be a positive number'),
  ],
  readingTrackerController.updateReadingTime
);

// Get user's reading statistics
router.get(
  '/stats',
  authMiddleware.authUser,
  readingTrackerController.getReadingStats
);

// Get user's read books
router.get(
  '/read-books',
  authMiddleware.authUser,
  readingTrackerController.getReadBooks
);

// Get complete user profile with reading stats
router.get(
  '/profile',
  authMiddleware.authUser,
  readingTrackerController.getUserProfile
);

module.exports = router;
