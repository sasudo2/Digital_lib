const User = require('../model/user.model');
const Book = require('../model/book.model');
const { validationResult } = require('express-validator');

module.exports.updateReadingTime = async (req, res, next) => {
  try {
    const { bookId, timeSpentMinutes } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!bookId || !timeSpentMinutes || timeSpentMinutes <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid book ID or time spent' 
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Add time spent
    const updatedUser = await User.addTimeSpent(userId, Math.ceil(timeSpentMinutes));

    // Add to user's read books
    await User.addReadBook(userId, bookId);

    res.status(200).json({ 
      success: true, 
      message: 'Reading time recorded successfully',
      user: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getReadingStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const stats = await User.getUserReadingStats(userId);
    const readBooks = await User.getReadBooks(userId);

    res.status(200).json({ 
      success: true, 
      stats,
      readBooks,
      summary: {
        booksRead: readBooks.length,
        minutesSpent: stats?.time_spent_minutes || 0,
        hoursSpent: Math.floor((stats?.time_spent_minutes || 0) / 60),
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getReadBooks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const readBooks = await User.getReadBooks(userId);

    res.status(200).json({ 
      success: true, 
      books: readBooks 
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const stats = await User.getUserReadingStats(userId);
    const readBooks = await User.getReadBooks(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      user: {
        ...user,
        readingStats: {
          booksRead: readBooks.length,
          minutesSpent: stats?.time_spent_minutes || 0,
          hoursSpent: Math.floor((stats?.time_spent_minutes || 0) / 60),
        },
        recentBooks: readBooks.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};
