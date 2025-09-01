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

    const goodreads_url = new URL(req.body.goodreads_url);

    if(!(goodreads_url.host === "www.goodreads.com"))
        ErrorFactory.bad_argument(`The given url in not www.goodreads.com`);

    if(!(goodreads_url.pathname.split("/")[1] === "book" && 
         goodreads_url.pathname.split("/")[2] === "show"))
        ErrorFactory.bad_argument(`The given url does not have the path /book/show/`);


    /* Get book_name from goodreads */
    var book_name = "";

    const response = await fetch(goodreads_url.href);
    const data = await response.text();

    const $ = require('cheerio').load(data);
    // Selector written using chrome expect tab
    book_name = $('#__next > div.PageFrame.PageFrame--siteHeaderBanner > main > div.BookPage__gridContainer > div.BookPage__rightColumn > div.BookPage__mainContent > div.BookPageTitleSection > div.BookPageTitleSection__title > h1').text();


    if(book_name === "")
        ErrorFactory.runtime(`The mined book name is corrupted`);

    /* ----- */

    if(await BookService.does_exist_by_name(book_name))
        ErrorFactory.bad_argument(`The book ${book_name} already exist`);

    const new_book = await BookService.find_or_create(book_name, goodreads_url.href);

    Respond.success(res, `See data for the new book informations`, new_book.get());
});

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const books = await BookService.find_all();

    Respond.success(res, `See data for the books list`, books);
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