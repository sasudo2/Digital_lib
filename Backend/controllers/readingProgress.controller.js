const ReadingProgress = require('../model/readingProgress.model');
const Book = require('../model/book.model');

module.exports.updateProgress = async (req, res, next) => {
  try {
    const { bookId, currentPage, isFinished } = req.body;
    const userId = req.user.id;

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const progress = await ReadingProgress.updateProgress({
      userId,
      bookId,
      currentPage: currentPage || 0,
      isFinished: isFinished || false,
    });

    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

module.exports.getProgress = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const progress = await ReadingProgress.getProgress(userId, bookId);

    res.status(200).json({ 
      success: true, 
      progress: progress || { current_page: 0, is_finished: false }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await ReadingProgress.getUserProgress(userId);

    res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

module.exports.getFinishedBooks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const books = await ReadingProgress.getFinishedBooks(userId);

    res.status(200).json({ success: true, books });
  } catch (error) {
    next(error);
  }
};

module.exports.getInProgressBooks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const books = await ReadingProgress.getInProgressBooks(userId);

    res.status(200).json({ success: true, books });
  } catch (error) {
    next(error);
  }
};

module.exports.markAsFinished = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const progress = await ReadingProgress.markAsFinished(userId, bookId);

    res.status(200).json({ 
      success: true, 
      message: 'Book marked as finished',
      progress 
    });
  } catch (error) {
    next(error);
  }
};
