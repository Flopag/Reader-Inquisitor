import { useEffect, useState } from "react";
import axios from 'axios';

import Loader from '@widgets/loader';
import Button from '@widgets/button';

function book_page(){
    const [already_tried_1, set_already_tried_1] = useState(false);
    const [books, set_books] = useState(null);
    const [already_tried_2, set_already_tried_2] = useState(false);
    const [current_book_id, set_current_book_id] = useState(null);
    const [current_book, set_current_book] = useState(null);
    const [last_log, set_last_log] = useState(null);

    const [new_book_url, set_new_book_url] = useState(null);
    const [create_new_book, set_create_new_book] = useState(false);
    const [new_log_completion, set_new_log_completion] = useState(null);
    const [create_new_log, set_create_new_log] = useState(false);

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

            set_current_book_id((last_log) ? last_log.book_id : null)
            set_already_tried_2(true);
        };

        get_last_log();
    }, []);

    useEffect(() => {
        const update_current_book = async () => {
            if(!books){
                setTimeout(update_current_book, 1000);
                return;
            }

            let current_book = null;

            books.forEach(book => {
                if(book.book_id == current_book_id)
                    current_book = book;
            });

            set_current_book(current_book);

            if(!current_book)
                return;

            const last_log = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs/last/${current_book.book_id}`, {
                withCredentials: true,
            })
            .then((res) => {
                if(res.data.success) 
                    return res.data.data;
                else
                    return null;
            })
            .catch((err) => {console.log(err)});

            set_last_log(last_log);
        };

        update_current_book();
    }, [current_book_id]);

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
            if(!current_book?.book_id || !new_log_completion)
                return;

            if(new_log_completion == 0){
                await axios.post(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs/reset/${current_book?.book_id}`,
                    {},
                    {withCredentials: true})
                .then((res) => {
                    window.location.reload(true);
                })
                .catch((err) => {console.log(err)});
            } else {
                await axios.post(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs`,
                    {book_id: current_book.book_id, completion: new_log_completion},
                    {withCredentials: true})
                .then((res) => {
                    window.location.reload(true);
                })
                .catch((err) => {console.log(err)});
            }
        };

        post_log();
    }, [create_new_log]);

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

    const get_current_book_html = () => {
        if(!already_tried_1 || !already_tried_2)
            return <Loader />;
        else if(!books)
            return <p>Error</p>;

        if(!current_book)
            return  <>
                        <h1>Create a new book</h1>
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
                    </>;

        const get_last_log_html = () => {
            if(!last_log)
                return <div></div>;
            return  <>
                        <h2>Last log</h2>
                        <div>Completion: {last_log.completion}%</div>
                        <div>Date: {last_log.logged_at}</div>
                    </>;
        };

        return  <>
                    <h1>{current_book.book_name}</h1>
                    <a href={current_book.book_reference_url}>Goodread</a>
                    {get_last_log_html()}
                    <h2>New log</h2>
                    <p>Completion (from 0 to 100%):</p>
                    <input 
                        type="text" 
                        id="book-add_book-url" 
                        onChange={(e) => set_new_log_completion(e.target.value)}
                    />
                    <Button 
                        message={"New log"} 
                        on_click={() => {set_create_new_log(!create_new_log);}} 
                        background_color={"#5662f6"}
                        color={"white"}
                    />
                </>;
    };

    return  <>
                <datalist id="book-datalist-books">
                    {get_book_datalist_elements_html()}
                </datalist>
                <input 
                    list="book-datalist-books"
                    type="text" 
                    value={(current_book_id) ? current_book_id : " "}
                    id="book-current_book-url" 
                    onChange={(e) => set_current_book_id(e.target.value)}
                />
                {get_current_book_html()}
            </>
}

export default book_page;