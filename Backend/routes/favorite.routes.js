const express = require('express');
const { body } = require('express-validator');
const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Add to favorites
router.post(
  '/add',
  authMiddleware.authUser,
  [body('bookId').isInt().withMessage('Book ID is required')],
  favoriteController.addFavorite
);

// Remove from favorites
router.post(
  '/remove',
  authMiddleware.authUser,
  [body('bookId').isInt().withMessage('Book ID is required')],
  favoriteController.removeFavorite
);

// Get all favorites
router.get(
  '/list',
  authMiddleware.authUser,
  favoriteController.getFavorites
);

// Check if book is favorite
router.get(
  '/check/:bookId',
  authMiddleware.authUser,
  favoriteController.isFavorite
);

module.exports = router;
