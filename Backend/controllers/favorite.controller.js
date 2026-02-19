const User = require('../model/user.model');
const Book = require('../model/book.model');

module.exports.addFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const result = await User.addFavoriteBook(userId, bookId);
    res.status(200).json({ success: true, message: 'Added to favorites', favorite: result });
  } catch (error) {
    next(error);
  }
};

module.exports.removeFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const result = await User.removeFavoriteBook(userId, bookId);
    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

module.exports.getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const favorites = await User.getFavoriteBooks(userId);

    res.status(200).json({ success: true, favorites });
  } catch (error) {
    next(error);
  }
};

module.exports.isFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const isFav = await User.isFavorite(userId, bookId);
    res.status(200).json({ success: true, isFavorite: isFav });
  } catch (error) {
    next(error);
  }
};
