const express = require('express');
const { body } = require('express-validator');
const bookmarkController = require('../controllers/bookmark.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Add bookmark
router.post(
  '/add',
  authMiddleware.authUser,
  [body('bookId').isInt().withMessage('Book ID is required')],
  bookmarkController.addBookmark
);

// Remove bookmark
router.post(
  '/remove',
  authMiddleware.authUser,
  [body('bookId').isInt().withMessage('Book ID is required')],
  bookmarkController.removeBookmark
);

// Get all bookmarks
router.get(
  '/list',
  authMiddleware.authUser,
  bookmarkController.getBookmarks
);

// Check if book is bookmarked
router.get(
  '/check/:bookId',
  authMiddleware.authUser,
  bookmarkController.isBookmarked
);

// Get bookmark count
router.get(
  '/count/all',
  authMiddleware.authUser,
  bookmarkController.getBookmarkCount
);

module.exports = router;
