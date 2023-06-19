const Book = require('../models/Book');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getBestBooks = (req, res, next) => {
  res.json({ message: 'getBestBooks !' });
};

exports.getOneBook = (req, res, next) => {
  res.json({ message: 'getOneBook !' });
};

exports.createBook = (req, res, next) => {
  res.json({ message: 'createBook !' });
};

exports.createRating = (req, res, next) => {
  res.json({ message: 'createRating !' });
};

exports.modifyBook = (req, res, next) => {
  res.json({ message: 'modifyBook !' });
};

exports.deleteBook = (req, res, next) => {
  res.json({ message: 'deleteBook !' });
};
