const express = require('express');
const BookService = require('@app/books/service');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

router.post('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    if(!req.body?.goodreads_url)
        ErrorFactory.bad_argument(`A goodreads url is needed to create a book`);

    const book_name = await BookService.get_book_name_from_goodreads_url(req.body.goodreads_url);

    if(await BookService.does_exist_by_name(book_name))
        ErrorFactory.bad_argument(`The book ${book_name} already exist`);

    const new_book = await BookService.find_or_create(book_name, req.body.goodreads_url.href);

    Respond.success(res, `See data for the new book informations`, new_book.get());
});

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const books = await BookService.find_all();

    Respond.success(res, `See data for the books list`, books);
});

router.get('/by_goodreads',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { goodreads_url } = req.query;

    if(!goodreads_url)
        ErrorFactory.bad_argument(`The goodreads url of the book is missing`);

    const book = await BookService.find_by_goodreads_url(goodreads_url);

    if(!book)
        ErrorFactory.bad_argument(`The book does not exist`);

    Respond.success(res, `See data for the books data`, book);
});

router.get('/:book_id',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    const book = await BookService.find_by_id(book_id);

    if(!book)
        ErrorFactory.bad_argument(`The book does not exist`);

    Respond.success(res, `See data for the books data`, book);
});

router.delete('/:book_id',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id)
        ErrorFactory.bad_argument(`The id of the book is missing`);

    if(!(await BookService.does_exist_by_id(book_id)))
        ErrorFactory.bad_argument(`The book ${book_id} do not exist`);

    await BookService.destroy(book_id);

    Respond.success(res, `The book ${book_id} has been destroy`, {});
});

module.exports = router;