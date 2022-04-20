const Book = require('../models/book');

exports.book_create_post = (req, res, title) => {
    const book = new Book({
        title: req.body.title,
    });

    book.save((err) => {
        if (err) {
            return res.send(err);
        }
        return res.json({ message: 'Book created!' });
    });
};