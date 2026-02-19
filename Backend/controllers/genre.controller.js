const Genre = require('../model/genre.model');
const { validationResult } = require('express-validator');

module.exports.createGenre = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const genre = await Genre.create({ name });
    res.status(201).json({ success: true, genre });
  } catch (error) {
    next(error);
  }
};

module.exports.getGenre = async (req, res, next) => {
  try {
    const { genreId } = req.params;
    const genre = await Genre.findById(genreId);

    if (!genre) {
      return res.status(404).json({ success: false, message: 'Genre not found' });
    }

    res.status(200).json({ success: true, genre });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json({ success: true, genres });
  } catch (error) {
    next(error);
  }
};

module.exports.updateGenre = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { genreId } = req.params;
    const { name } = req.body;

    const genre = await Genre.update(genreId, { name });

    if (!genre) {
      return res.status(404).json({ success: false, message: 'Genre not found' });
    }

    res.status(200).json({ success: true, genre });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteGenre = async (req, res, next) => {
  try {
    const { genreId } = req.params;
    const result = await Genre.delete(genreId);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Genre not found' });
    }

    res.status(200).json({ success: true, message: 'Genre deleted successfully' });
  } catch (error) {
    next(error);
  }
};
