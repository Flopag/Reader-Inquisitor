import { useEffect, useState } from "react";
import axios from 'axios';

import Loader from '@widgets/loader';
import Button from '@widgets/button';

function book_page(){
    const [already_tried, set_already_tried] = useState(false);
    const [new_book_url, set_new_book_url] = useState(null);
    const [create_new_book, set_create_new_book] = useState(false);
    const [books, set_books] = useState(null);

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
            set_already_tried(true);
        };

        get_books();
    }, []);

    useEffect(() => {
        const post_book = async () => {
            console.log("test");
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

    if(!already_tried)
        return  <>
                    <Loader />
                </>;
    else if(!books)
        return  <>
                    <p>An error occured</p>
                </>;

    const books_html = books.map((book, index) => {
        return <div key={book.book_id}>
                    <h2>{book.book_name}</h2>
                    <a href={book.book_reference_url}>Goodread</a>
                </div>;
    });

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
                    <h1>Book list</h1>
                    {books_html}
                </div>
            </>
}

export default book_page;