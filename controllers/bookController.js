const Book = require('../models/book');

exports.books_view_get = (req, res) => {
    Book.find({}, (err, books) => {
        if (err) return res.json(err);

        return res.status(200).json(books);
    })
};

exports.books_create_post = (req, res, title) => {
    if (!title) return res.status(200).send('missing required field title');
    
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

exports.books_remove_delete = async (req, res) => {
    await Book.deleteMany({});
    return res.status(200).json({result: 'All books successfully deleted'});
};

exports.book_view_get = (req, res, bookid) => {
    Book.findById(bookid, (err, book) => {
        if (!book) {
            return res.status(200).send('no book exists');
        } else if (err) {
            return res.status(400).json({ err });
        }
        const { title, _id, comments } = book;
        return res.status(200).json({title, _id, comments});
    });
};

exports.comment_create_post = async (req, res, bookid, comment) => {
    if (!comment) return res.status(400).json({err: 'Missing required field: comment'});
    const book = await Book.findById(bookid);

    if (!book) return res.status(400).json({err: "Book doesn't exist"});

    try {
        book.comments.push(comment);
        book.commentcount += 1;
        await book.save();
        return res.status(200).json(book);       
    } catch(err) {
        return res.status(400).json(err);
    }
};

exports.book_remove_delete = async (req, res, bookid) => {
    const book = await Book.findById(bookid);

    if (!book) {
        return res.status(400).json({ err: "Book doesn't exist" });
    }

    await book.remove();
    return res.status(200).json({ _id: bookid, result: 'Book successfully deleted' });
};
