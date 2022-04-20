/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require('../models/book');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let id1;

    this.beforeEach(async() => {
        await Book.deleteMany({});

        const book1 = new Book({
            title: 'The Ascetical Homilies of St. Isaac the Syrian',
        });

        const saved1 = await book1.save();

        id1 = saved1._id;
    });

    suite('Routing tests', function() {
        suite(
            'POST /api/books with title => create book object/expect book object',
            function() {
                test('Test POST /api/books with title', function(done) {
                    chai
                        .request(server)
                        .get('/api/books')
                        .send({ title: 'Laurus' })
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.property(res.body[0], '_id', 'Has _id in response');
                            assert.equal(res.body.title, 'Laurus', 'Has book title in response')
                            done();
                        });
                });

                test('Test POST /api/books with no title given', function(done) {
                    chai
                        .request(server)
                        .get('/api/books')
                        .send({})
                        .end((err, res) => {
                            assert.equal(res.status, 400);
                            assert.equal(res.body.error, 'No title given');
                            done();
                        });
                });
            }
        );

        suite('GET /api/books => array of books', function() {
            test('Test GET /api/books', function(done) {
                chai
                    .request(server)
                    .get('/api/books')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body, 'response is an array');
                        assert.property(res.body[0], '_id', 'Books in array should include the _id property');
                        assert.property(res.body[0], 'commentcount', 'Books in array should include the commentcount property');
                        assert.property(res.body[0], 'title', 'Books in array should include title');
                        done();
                    });
            });
        });

        suite('GET /api/books/[id] => book object with [id]', function() {
            test('Test GET /api/books/[id] with id not in db', function(done) {
                chai
                    .request(server)
                    .get('/api/books/123')
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.error, 'Invalid id', 'Invalid id given');
                        done()
                    })
            });

            test('Test GET /api/books/[id] with valid id in db', async function(done) {
                const testBook = await Book.findById(id1);
    
                chai
                    .request(server)
                    .get(`/api/books/${id1}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body._id, id1);
                        assert.equal(res.body.title, testBook._id);
                        done();
                    })
            });
        });

        suite(
            'POST /api/books/[id] => add comment/expect book object with id',
            function() {
                test('Test POST /api/books/[id] with comment', async function(done) {
                    const testBook = await Book.findById(id1);
                    
                    chai
                        .request(server)
                        .post(`/api/books/${id1}`)
                        .send({comment: 'This book helped me reach Theosis'})
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.equal(res.body._id, id1);
                            assert.equal(res.body.title, testBook.title);
                            done();
                        });
                });

                test('Test POST /api/books/[id] without comment field', function(done) {
                    chai
                        .request(server)
                        .post(`/api/books/${id1}`)
                        .end((err, res) => {
                            assert.equal(res.status, 400);
                            assert.equal(res.body.error, 'Missing required field: comment');
                            done();
                        });
                });

                test('Test POST /api/books/[id] with comment, id not in db', function(done) {
                    chai
                        .request(server)
                        .post('/api/books/123')
                        .end((err, res) => {
                            assert.equal(res.status, 400);
                            assert.equal(res.body.error, "Book doesn't exist");
                            done();
                        });
                });
            }
        );

        suite('DELETE /api/books/[id] => delete book object id', function() {
            test('Test DELETE /api/books/[id] with valid id in db', function(done) {
                chai
                    .request(server)
                    .delete(`/api/books/${id1}`)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body._id, id1);
                        assert.equal(res.body.result, 'Book successfully deleted');
                        done();
                    });
            });

            test('Test DELETE /api/books/[id] with id not in db', function(done) {
                chai
                    .request(server)
                    .delete('/api/books/123')
                    .end((err, res) => {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, "Book doesn't exist");
                        done();
                    });
            });
        });
    });
});
