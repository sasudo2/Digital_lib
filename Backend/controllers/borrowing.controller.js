const User = require('../model/user.model');
const Book = require('../model/book.model');

module.exports.getBorrowingHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await User.getBorrowingHistory(userId);

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports.getActiveBorrowedBooks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const active = await User.getActiveBorrowedBooks(userId);

    res.status(200).json({ success: true, activeBorrowedBooks: active });
  } catch (error) {
    next(error);
  }
};

module.exports.borrowBook = async (req, res, next) => {
  try {
    const { bookId, librarianId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const borrowRecord = await User.addBorrowingRecord(userId, bookId, librarianId);

    res.status(201).json({ success: true, borrowRecord });
  } catch (error) {
    next(error);
  }
};

module.exports.returnBorrowedBook = async (req, res, next) => {
  try {
    const { borrowId, durationDays } = req.body;

    const result = await User.returnBorrowedBook(borrowId, new Date(), durationDays);

    res.status(200).json({ success: true, message: 'Book returned successfully', borrowRecord: result });
  } catch (error) {
    next(error);
  }
};
