const Review = require('../model/review.model');
const Book = require('../model/book.model');
const { validationResult } = require('express-validator');

module.exports.createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookId, rating, comment } = req.body;
    const readerId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Check if reader already reviewed this book
    const existingReview = await Review.findByBookAndReader(bookId, readerId);
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      bookId,
      readerId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

module.exports.getReviewsByBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const reviews = await Review.findByBookId(bookId);
    const avgRating = await Review.getAverageRating(bookId);

    res.status(200).json({ 
      success: true, 
      reviews, 
      averageRating: avgRating.average_rating 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getReviewsByReader = async (req, res, next) => {
  try {
    const readerId = req.user.id;
    const reviews = await Review.findByReaderId(readerId);

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure only the review author can update their review
    if (review.reader_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const updatedReview = await Review.update(reviewId, { rating, comment });

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Ensure only the review author can delete their review
    if (review.reader_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Review.delete(reviewId);

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports.getMyReviewForBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const readerId = req.user.id;

    const review = await Review.findByBookAndReader(bookId, readerId);

    res.status(200).json({ 
      success: true, 
      review: review || null
    });
  } catch (error) {
    next(error);
  }
};
