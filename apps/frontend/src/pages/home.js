import { useEffect, useState } from "react";
import axios from 'axios';

import Calendar from '@widgets/calendar';
import Loader from '@widgets/loader';
import Button from '@widgets/button';

function home_page(){
    const [calendar_content, set_calendar_content] = useState(null);
    const [logs, set_logs] = useState(null);
    const [already_tried, set_already_tried] = useState(false);

    useEffect(() => {
        const get_logs = async () => {
            const logs = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/logs`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if(res.data.success) 
                        return res.data.data;
                    else
                        return null;
                })
                .catch((err) => {console.log(err)});

            const modified_log = [];

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

            logs.forEach(log => {
                let book_name = "";

                books.forEach(book => {
                    if(book.book_id == log.book_id)
                        book_name = book.book_name;
                });

                modified_log.push({
                    date: new Date(log.logged_at),
                    completion: log.completion,
                    book_name: book_name
                });
            });

            set_logs(modified_log);
            set_already_tried(true);
        };

        get_logs();
    }, []);

    useEffect(() => {
        const calendar_content = []
            
        logs?.forEach(log => {
            let i = -1;
            let counter = 0;
            calendar_content.forEach(element => {
                if(element.date.getDate() == log.date.getDate() &&
                   element.date.getMonth() == log.date.getMonth() &&
                   element.date.getFullYear() == log.date.getFullYear() )
                   i = counter;
                counter++;
            });

            if(i == -1)
                calendar_content.push({
                    date: log.date,
                    number_of_logs: 1,
                    mini: <p>+</p>,
                    page:   <>
                                <h2>{log.book_name}</h2>
                                <p>{`Logged at: ${log.date} `}</p>
                                <p>{`Completion: ${log.completion}%`}</p>
                            </>,
                });
            else {
                const new_number_of_logs = calendar_content[i].number_of_logs+1;
                const previous_html = calendar_content[i].page;
                calendar_content[i] = {
                    date: log.date,
                    number_of_logs: new_number_of_logs,
                    mini: <p>{new_number_of_logs}</p>,
                    page:   <>
                                {previous_html}
                                <h2>{log.book_name}</h2>
                                <p>{`Logged at: ${log.date} `}</p>
                                <p>{`Completion: ${log.completion}%`}</p>
                            </>,
                };
            }
        });

        set_calendar_content(calendar_content);
    }, [logs]);

    return  <>
                <Calendar content={calendar_content} />
            </>
}

export default home_page;