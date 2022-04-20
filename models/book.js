const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comment: [String],
});

BookSchema
    .virtual('commentcount')
    .get(function() {
        return this.comment.length;
    });

module.exports = mongoose.model('Book', BookSchema);