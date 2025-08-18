const Book = require('@models/book');

async function does_exist_by_name(book_name){
    try {
        return !!(await Book.findOne({where: {book_name: book_name}}));
    } catch (err) {
        throw new Error("[bookService/does_exist_by_name]: An error occured with the database:", err);
    }
}

async function does_exist_by_id(book_id){
    try {
        return !!(await Book.findOne({where: {book_id: book_id}}));
    } catch (err) {
        throw new Error("[bookService/does_exist_by_name]: An error occured with the database:", err);
    }
}

async function find_or_create(book_name, book_reference_url){
    try {
        return (await Book.findOrCreate({
            where: {
                book_name: book_name,
            },
            defaults: {book_reference_url: book_reference_url},
        }))[0];
    } catch (err) {
        throw new Error("[bookService/find_or_create]: An error occured with the database:", err);
    }
}

async function find_all(){
    try {
        return await Book.findAll();
    } catch (err) {
        throw new Error("[bookService/find_all]: An error occured with the database:", err);
    }

}

async function destroy(book_id){
    try {
        return await Book.destroy({where: {book_id: book_id}});
    } catch (err) {
        throw new Error("[bookService/destroy]: An error occured with the database:", err);
    }
}

module.exports = {
    does_exist_by_name,
    does_exist_by_id,
    find_or_create,
    find_all,
    destroy,
}