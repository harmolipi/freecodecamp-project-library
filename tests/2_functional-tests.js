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
                        .post('/api/books')
                        .send({ title: 'Laurus' })
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.property(res.body, '_id');
                            assert.equal(res.body.title, 'Laurus', 'Has book title in response')
                            done();
                        });
                });

                test('Test POST /api/books with no title given', function(done) {
                    chai
                        .request(server)
                        .post('/api/books')
                        .send({})
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, 'missing required field title');
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
                    .get('/api/books/111111111111111111111111')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'no book exists', 'Book not found');
                        done();
                    })
            });

            test('Test GET /api/books/[id] with valid id in db', async () => {
                const testBook = await Book.findById(id1);
    
                const res = await chai
                    .request(server)
                    .get(`/api/books/${id1}`);
                
                assert.equal(res.status, 200);
                assert.equal(res.body._id, id1);
                assert.equal(res.body.title, testBook.title);
            });
        });

        suite(
            'POST /api/books/[id] => add comment/expect book object with id',
            function() {
                test('Test POST /api/books/[id] with comment', async () => {
                    const testBook = await Book.findById(id1);
                    
                    const res = await chai
                        .request(server)
                        .post(`/api/books/${id1}`)
                        .send({comment: 'This book helped me reach Theosis'});
                    
                    assert.equal(res.status, 200);
                    assert.equal(res.body._id, id1);
                    assert.equal(res.body.title, testBook.title);
                });

                test('Test POST /api/books/[id] without comment field', function(done) {
                    chai
                        .request(server)
                        .post(`/api/books/${id1}`)
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, 'missing required field comment');
                            done();
                        });
                });

                test('Test POST /api/books/[id] with comment, id not in db', function(done) {
                    chai
                        .request(server)
                        .post('/api/books/111111111111111111111111')
                        .send({comment: 'This is my comment!'})
                        .end((err, res) => {
                            assert.equal(res.status, 200);
                            assert.equal(res.text, 'no book exists');
                            done();
                        });
                });
            }
        );

        suite('DELETE /api/books/[id] => delete book object id', function() {
            test('Test DELETE /api/books/[id] with valid id in db', async () => {
                const res = await chai
                    .request(server)
                    .delete(`/api/books/${id1}`);
                assert.equal(res.status, 200);
                assert.equal(res.text, 'delete successful');
            });

            test('Test DELETE /api/books/[id] with id not in db', async () => {
                const res = await chai
                    .request(server)
                    .delete('/api/books/111111111111111111111111')
                assert.equal(res.status, 200);
                assert.equal(res.text, 'no book exists');
            });
        });
    });
});
