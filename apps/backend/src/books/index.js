const express = require('express');
const Book = require('@models/book');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);

router.post('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    if(!req.body.goodreads_url){
        res.status(400).json({
            "success": false,
            "message": `A goodreads url is needed to create a book`,
            "data": {},
            "error_code": null,
        });
        return;
    }

    const goodreads_url = new URL(req.body.goodreads_url);

    if(!(goodreads_url.host === "www.goodreads.com")){
        res.status(400).json({
            "success": false,
            "message": `The given url in not www.goodreads.com`,
            "data": {},
            "error_code": null,
        });
        return;
    }

    console.log(goodreads_url.pathname);
    if(!(goodreads_url.pathname.split("/")[1] === "book" && 
         goodreads_url.pathname.split("/")[2] === "show")){
        res.status(400).json({
            "success": false,
            "message": `The given url does not have the path /book/show/`,
            "data": {},
            "error_code": null,
        });
        return;
    }

    // Get book_name from goodreads
    var book_name = "";
    try {
        const response = await fetch(goodreads_url.href);
        const data = await response.text();

        const $ = require('cheerio').load(data);
        // Selector written using chrome expect tab
        book_name = $('#__next > div.PageFrame.PageFrame--siteHeaderBanner > main > div.BookPage__gridContainer > div.BookPage__rightColumn > div.BookPage__mainContent > div.BookPageTitleSection > div.BookPageTitleSection__title > h1').text();
    } catch (err) {
        console.error('[post /books/]: Unable to get book_name from url:', err);
        res.status(500).json({
            "success": false,
            "message": "Unable to get book_name from url",
            "data": {},
            "error_code": null,
        });
        return;
    }

    if(book_name === ""){
        res.status(500).json({
            "success": false,
            "message": `The mined book name is corrupted`,
            "data": {},
            "error_code": null,
        });
        return;
    }

    try {
        if(await Book.findOne({where: {book_name: book_name}})){
            res.status(400).json({
                "success": false,
                "message": `The book ${book_name} already exist`,
                "data": {},
                "error_code": null,
            });
            return;
        }
    
        const [new_book, success] = await Book.findOrCreate({
            where: {
                book_name: book_name,
            },
            defaults: {book_reference_url: goodreads_url.href},
        });

        res.status(200).json({
            "success": true,
            "message": `See data for the new book informations`,
            "data": new_book.get(),
            "error_code": null,
        });
    } catch (err) {
        console.error('[post /books/]: An error occured with the database:', err);
        res.status(500).json({
            "success": false,
            "message": `An error occured with the database`,
            "data": {},
            "error_code": null,
        });
        return;
    }
});

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    try {
        const books = await Book.findAll();

        res.status(200).json({
            "success": true,
            "message": `See data for the books list`,
            "data": books,
            "error_code": null,
        });
    } catch (err) {
        console.error('[get /books/]: An error occured with the database:', err);
        res.status(500).json({
            "success": false,
            "message": `An error occured with the database`,
            "data": {},
            "error_code": null,
        });
        return;
    }
});

router.delete('/:book_id',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const { book_id } = req.params;

    if(!book_id){
        res.status(400).json({
            "success": false,
            "message": `The id of the book is missing`,
            "data": {},
            "error_code": null,
        });
        return;
    }

    try {
        if(!(await Book.findOne({where: {book_id: book_id}}))){
            res.status(400).json({
                "success": false,
                "message": `The book ${book_id} do not exist`,
                "data": {},
                "error_code": null,
            });
            return;
        }

        await Book.destroy({where: {book_id: book_id}});

        res.status(200).json({
            "success": true,
            "message": `The book ${book_id} has been destroy`,
            "data": {},
            "error_code": null,
        });
    } catch (err) {
        console.error('[delete /books/:book_id]: An error occured with the database:', err);
        res.status(500).json({
            "success": false,
            "message": `An error occured with the database`,
            "data": {},
            "error_code": null,
        });
        return;
    }
});

module.exports = router;