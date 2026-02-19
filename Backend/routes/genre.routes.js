const express = require('express');
const { body } = require('express-validator');
const genreController = require('../controllers/genre.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Create genre (librarian only)
router.post(
  '/create',
  authMiddleware.authCaptain,
  [body('name').notEmpty().withMessage('Genre name is required')],
  genreController.createGenre
);

// Get all genres
router.get('/', genreController.getAllGenres);

// Get genre by ID
router.get('/:genreId', genreController.getGenre);

// Update genre (librarian only)
router.put(
  '/:genreId',
  authMiddleware.authCaptain,
  [body('name').notEmpty().withMessage('Genre name is required')],
  genreController.updateGenre
);

// Delete genre (librarian only)
router.delete(
  '/:genreId',
  authMiddleware.authCaptain,
  genreController.deleteGenre
);

module.exports = router;
