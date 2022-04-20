const Book = require('../models/book');

exports.book_create_post = (req, res, title) => {
  const book = new Book({
    title: req.body.title,
  });
  console.log(req.body);

  book.save((err, issue) => {
    console.log('saving');
    if (err) {
      console.log('error');
      res.json({err});
      return;
    }
    res.json({issue});
  })
}