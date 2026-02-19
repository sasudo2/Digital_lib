const Bookmark = require('../model/bookmark.model');
const Book = require('../model/book.model');

module.exports.addBookmark = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const bookmark = await Bookmark.addBookmark(userId, bookId);

    res.status(201).json({ success: true, bookmark });
  } catch (error) {
    next(error);
  }
};

module.exports.removeBookmark = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const bookmark = await Bookmark.removeBookmark(userId, bookId);

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.status(200).json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

module.exports.getBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.getUserBookmarks(userId);

    res.status(200).json({ success: true, bookmarks });
  } catch (error) {
    next(error);
  }
};

module.exports.isBookmarked = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const isBookmarked = await Bookmark.isBookmarked(userId, bookId);

    res.status(200).json({ success: true, isBookmarked });
  } catch (error) {
    next(error);
  }
};

module.exports.getBookmarkCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const count = await Bookmark.getBookmarkCount(userId);

    res.status(200).json({ success: true, count });
  } catch (error) {
    next(error);
  }
};
