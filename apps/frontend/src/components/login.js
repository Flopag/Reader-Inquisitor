import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/login.css';
import Loader from '@widgets/loader';
import Button from '@widgets/button';

async function is_online_fun() {
    return await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/health`)
    .then((res) => {return res.data.success})
    .catch((err) => {return false});
}

async function is_connected_fun() {
    return await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/users`, {
            withCredentials: true,
        }
    )
    .then((res) => {return res.data.success})
    .catch((err) => {return false});
}

function login ({ child }) {
    const [is_online, set_is_online] = useState(false);
    const [is_connected, set_is_connected] = useState(false);
    const [already_tried, set_already_tried] = useState(false);

    useEffect(() => {
        let is_running = true;
        let is_online_loc = false;

        const check_if_online = async () => {
            if(!is_running)
                return;

            const aux_is_online = await is_online_fun()

            set_is_online(aux_is_online);
            is_online_loc = aux_is_online;

            if(!aux_is_online){
                setTimeout(check_if_online, 1000);
                return;
            }
        };

        const check_if_connected = async () => {
            if(!is_running)
                return;
            
            if(!is_online_loc){
                setTimeout(check_if_connected, 1000);
                return;
            }

            const aux_is_connected = await is_connected_fun()

            set_is_connected(aux_is_connected)
            set_already_tried(true);
        };

        check_if_online();
        check_if_connected();

        return () => {
            is_running = false;
            is_online_loc = false;
        }
    }, []);

    if(!is_online || !already_tried)
        return  <div id="Login">
                    <Loader />
                </div>;
    else if(!is_connected)
        return  <div id="Login">
                    <h1>Choose how to connect</h1>
                    <Button message={"Discord"} on_click={() => {window.location.href = `${process.env.API_PROTOCOL}://${process.env.API_URL}/auth/discord`}} />
                </div>;
    else
        return  <>
                    {child}
                </>;
}

export default login;