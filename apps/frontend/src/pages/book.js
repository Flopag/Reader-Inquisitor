import { useEffect, useState } from "react";
import axios from 'axios';

import Loader from '@widgets/loader';
import Button from '@widgets/button';

function book_page(){
    const [already_tried_1, set_already_tried_1] = useState(false);
    const [already_tried_2, set_already_tried_2] = useState(false);
    const [new_book_url, set_new_book_url] = useState(null);
    const [create_new_book, set_create_new_book] = useState(false);
    const [new_log_completion, set_new_log_completion] = useState(null);
    const [new_log_book_id, set_new_log_book_id] = useState(null);
    const [create_new_log, set_create_new_log] = useState(false);
    const [books, set_books] = useState(null);
    const [last_log, set_last_log] = useState(null);

    useEffect(() => {
        const get_books = async () => {
            const books = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/books`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if(res.data.success) 
                        return res.data.data;
                    else
                        return null;
                })
                .catch((err) => {console.log(err)});

            set_books((books) ? books : null);
            set_already_tried_1(true);
        };

        get_books();
    }, []);

    useEffect(() => {
        const get_last_log = async () => {
            const last_log = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs/last`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if(res.data.success) 
                        return res.data.data;
                    else
                        return null;
                })
                .catch((err) => {console.log(err)});

            console.log(last_log);

            set_last_log((last_log) ? last_log : null);
            set_already_tried_2(true);
        };

        get_last_log();
    }, []);

    useEffect(() => {
        const post_book = async () => {
            if(!new_book_url)
                return;

            await axios.post(`${process.env.API_PROTOCOL}://${process.env.API_URL}/books`,
                    {goodreads_url: new_book_url},
                    {withCredentials: true})
                .then((res) => {
                    window.location.reload(true);
                })
                .catch((err) => {console.log(err)});
        };

        post_book();
    }, [create_new_book]);

    useEffect(() => {
        const post_log = async () => {
            console.log("test");
            if(!new_log_book_id || !new_log_completion)
                return;

            await axios.post(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs`,
                    {book_id: new_log_book_id, completion: new_log_completion},
                    {withCredentials: true})
                .then((res) => {
                    window.location.reload(true);
                })
                .catch((err) => {console.log(err)});
        };

        post_log();
    }, [create_new_log]);

    const get_last_log_html = () => {
                        if(!already_tried_2)
                            return <Loader />;
                        else if(!last_log)
                            return <p>An error occured</p>;

                        let book_name = "Searching...";

                        if(already_tried_1 && books){
                            let found = false;
                            books.forEach(book => {
                                if(book.book_id === last_log.book_id){
                                    book_name = book.book_name;
                                    found = true;
                                }
                            });

                            if(!found)
                                book_name = "Name not found";
                        }

                        return  <>
                                    <div>Book name: {book_name}</div>
                                    <div>Completion: {last_log.completion}%</div>
                                    <div>Date: {last_log.logged_at}</div>
                                </>;
                    };

    const get_book_list_html = () => {
                        if(!already_tried_1)
                            return <Loader />;
                        else if(!books)
                            return <p>An error occured</p>;

                        const books_html = books.map((book, index) => {
                            return <div key={book.book_id}>
                                        <h2>{book.book_name}</h2>
                                        <a href={book.book_reference_url}>Goodread</a>
                                    </div>;
                        });

                        return books_html;
                    };

    const get_book_datalist_elements_html = () => {
                        if(!already_tried_1)
                            return <option value="Loading..."/>;
                        else if(!books)
                            return <option value="Error"/>;

                        const books_html = books.map((book, index) => {
                            return <option key={book.book_id} value={book.book_id}>{book.book_name}</option>;
                        });

                        return books_html;
                    };

    return  <>
                <div id="book_list">
                    <h1>Add a new book</h1>
                    <p>Goodread book url:</p>
                    <input 
                        type="text" 
                        id="book-add_book-url" 
                        onChange={(e) => set_new_book_url(e.target.value)}
                    />
                    <Button 
                        message={"Add book"} 
                        on_click={() => {set_create_new_book(!create_new_book);}} 
                        background_color={"#5662f6"}
                        color={"white"}
                    />
                    <h1>Last logged book</h1>
                    {get_last_log_html()}
                    <h2>New log for the same book</h2>
                    <p>Completion (from 0 to 100%):</p>
                    <input 
                        type="text" 
                        id="book-add_book-url" 
                        onChange={(e) => set_new_log_completion(e.target.value)}
                    />
                    <p>Book:</p>
                    <input 
                        list="book-datalist-books"
                        type="text" 
                        id="book-add_book-url" 
                        onChange={(e) => set_new_log_book_id(e.target.value)}
                    />
                    <datalist id="book-datalist-books">
                        {get_book_datalist_elements_html()}
                    </datalist>
                    <Button 
                        message={"New log"} 
                        on_click={() => {set_create_new_log(!create_new_log);}} 
                        background_color={"#5662f6"}
                        color={"white"}
                    />
                    <h1>Book list</h1>
                    {get_book_list_html()}
                </div>
            </>
}

export default book_page;