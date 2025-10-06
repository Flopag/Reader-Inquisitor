const Book = require('@models/book');

async function get_book_name_from_goodreads_url(url){
    const goodreads_url = new URL(url);
    
    if(!(goodreads_url.host === "www.goodreads.com"))
        ErrorFactory.bad_argument(`The given url in not www.goodreads.com`);

    if(!(goodreads_url.pathname.split("/")[1] === "book" && 
            goodreads_url.pathname.split("/")[2] === "show"))
        ErrorFactory.bad_argument(`The given url does not have the path /book/show/`);

    var book_name = "";

    // From https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth
    const puppeteer = require('puppeteer-extra')

    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
        ],
        });
    const page = await browser.newPage();
    await page.goto(goodreads_url.href, { waitUntil: 'networkidle2' });

    const data = await page.content();

    const $ = require('cheerio').load(data);
    // Selector written using chrome expect tab
    book_name = $('#__next > div.PageFrame.PageFrame--siteHeaderBanner > main > div.BookPage__gridContainer > div.BookPage__rightColumn > div.BookPage__mainContent > div.BookPageTitleSection > div.BookPageTitleSection__title > h1').text();

    if(book_name === "")
        ErrorFactory.runtime(`The mined book name is corrupted`);

    return book_name;
}

async function does_exist_by_name(book_name){
    return !!(await Book.findOne({where: {book_name: book_name}}));
}

async function does_exist_by_id(book_id){
    return !!(await Book.findOne({where: {book_id: book_id}}));
}

async function find_or_create(book_name, book_reference_url){
    return (await Book.findOrCreate({
        where: {
            book_name: book_name,
        },
        defaults: {book_reference_url: book_reference_url},
    }))[0];
}

async function find_all(){
    return await Book.findAll();
}

async function find_by_goodreads_url(goodreads_url){
    let book = await Book.findOne({where: {book_reference_url: goodreads_url}});
    if(book)
        return book;

    const book_name = await get_book_name_from_goodreads_url(goodreads_url);
    book = await Book.findOne({where: {book_name: book_name}});

    if(!book)
        return book;

    book.set({
        book_reference_url: goodreads_url
    });
    await book.save();

    return book;
}

async function find_by_id(book_id){
    return await Book.findOne({where: {book_id: book_id}});
}

async function destroy(book_id){
    return await Book.destroy({where: {book_id: book_id}});
}

module.exports = {
    get_book_name_from_goodreads_url,
    does_exist_by_name,
    does_exist_by_id,
    find_or_create,
    find_all,
    find_by_goodreads_url,
    find_by_id,
    destroy,
}