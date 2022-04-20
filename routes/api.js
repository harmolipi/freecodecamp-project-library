/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const book_controller = require('../controllers/bookController');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      book_controller.books_view_get(req, res);
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      book_controller.book_create_post(req, res, title);
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      book_controller.books_remove_delete(req, res);
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      book_controller.book_view_get(req, res, bookid);
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      book_controller.comment_create_post(req, res, bookid, comment);
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      book_controller.book_remove_delete(req, res, bookid);
    });
  
};
