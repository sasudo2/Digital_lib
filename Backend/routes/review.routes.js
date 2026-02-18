const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Create review (reader only)
router.post(
  '/create',
  authMiddleware.authUser,
  [
    body('bookId').isInt().withMessage('Book ID is required and must be a number'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
  ],
  reviewController.createReview
);

// Get reader's reviews
router.get('/reader/myreviews', authMiddleware.authUser, reviewController.getReviewsByReader);

// Get reader's review for a specific book (more specific, must come before general :bookId)
router.get('/book/:bookId/my-review', authMiddleware.authUser, reviewController.getMyReviewForBook);

// Get reviews by book
router.get('/book/:bookId', reviewController.getReviewsByBook);

// Update review (reader who created it only)
router.put(
  '/:reviewId',
  authMiddleware.authUser,
  [
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('comment').optional().isString(),
  ],
  reviewController.updateReview
);

// Delete review (reader who created it only)
router.delete(
  '/:reviewId',
  authMiddleware.authUser,
  reviewController.deleteReview
);

module.exports = router;
