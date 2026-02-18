const BookUsage = require('../model/bookUsage.model');
const Book = require('../model/book.model');
const AdminAction = require('../model/adminAction.model');
const { validationResult } = require('express-validator');

module.exports.issueBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookId, readerId, issueDate } = req.body;
    const librarianId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const usage = await BookUsage.create({
      readerId,
      bookId,
      librarianId,
      actionType: 'issue',
      issueDate: issueDate || new Date(),
    });

    // Log admin action
    await AdminAction.create({
      readerId,
      librarianId,
      actionType: 'book_issued',
      notes: `Book "${book.title}" issued to reader`,
    });

    res.status(201).json({ success: true, usage });
  } catch (error) {
    next(error);
  }
};

module.exports.returnBook = async (req, res, next) => {
  try {
    const { usageId } = req.params;
    const { returnDate, durationMinutes } = req.body;

    const usage = await BookUsage.findById(usageId);
    if (!usage) {
      return res.status(404).json({ success: false, message: 'Usage record not found' });
    }

    if (usage.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book already returned' });
    }

    const updatedUsage = await BookUsage.returnBook(
      usageId,
      returnDate || new Date(),
      durationMinutes || 0
    );

    // Log admin action
    await AdminAction.create({
      readerId: usage.reader_id,
      librarianId: req.user.id,
      actionType: 'book_returned',
      notes: `Book "${usage.book_title}" returned by reader`,
    });

    res.status(200).json({ success: true, usage: updatedUsage });
  } catch (error) {
    next(error);
  }
};

module.exports.getActiveIssues = async (req, res, next) => {
  try {
    const readerId = req.user.id;
    const activeIssues = await BookUsage.getActiveIssues(readerId);

    res.status(200).json({ success: true, activeIssues });
  } catch (error) {
    next(error);
  }
};

module.exports.getReadingHistory = async (req, res, next) => {
  try {
    const readerId = req.user.id;
    const history = await BookUsage.getReadingHistory(readerId);

    res.status(200).json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports.getUsageById = async (req, res, next) => {
  try {
    const { usageId } = req.params;
    const usage = await BookUsage.findById(usageId);

    if (!usage) {
      return res.status(404).json({ success: false, message: 'Usage record not found' });
    }

    res.status(200).json({ success: true, usage });
  } catch (error) {
    next(error);
  }
};

module.exports.getReaderUsage = async (req, res, next) => {
  try {
    const { readerId } = req.params;
    const usage = await BookUsage.findByReaderId(readerId);

    res.status(200).json({ success: true, usage });
  } catch (error) {
    next(error);
  }
};

module.exports.getBookUsage = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const usage = await BookUsage.findByBookId(bookId);

    res.status(200).json({ success: true, usage });
  } catch (error) {
    next(error);
  }
};
