const Book = require('../models/book');

exports.books_view_get = (req, res, title) => {
  res.send('NOT IMPLEMENTED YET');
};

exports.books_create_post = (req, res, title) => {
    const book = new Book({
        title: req.body.title,
    });

    book.save((err, book) => {
        if (err) {
            return res.send(err);
        }
        return res.status(200).json({ title: book.title, _id: book._id });
    });
};

exports.books_remove_delete = (req, res) => {
  res.send('NOT IMPLEMENTED YET');
};

exports.book_view_get = (req, res, bookid) => {
  res.send('NOT IMPLEMENTED YET')
};

exports.comment_create_post = (req, res, bookid, comment) => {
  res.send('NOT IMPLEMENTED YET');
};

exports.book_remove_delete = (req, res, bookid) => {
  res.send('NOT IMPLEMENTED YET');
};
