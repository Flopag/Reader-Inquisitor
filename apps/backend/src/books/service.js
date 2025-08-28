const Book = require('@models/book');

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

async function destroy(book_id){
    return await Book.destroy({where: {book_id: book_id}});
}

module.exports = {
    does_exist_by_name,
    does_exist_by_id,
    find_or_create,
    find_all,
    destroy,
}