import { useEffect, useState } from "react";
import axios from 'axios';

import Loader from '@widgets/loader';
import Button from '@widgets/button';

function profile_page(){
    const [already_tried, set_already_tried] = useState(false);
    const [name, set_name] = useState(null);
    const [role, set_role] = useState(null);

    useEffect(() => {
        const get_user = async () => {
            const user = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/users`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if(res.data.success) 
                        return res.data.data;
                    else
                        return null;
                })
                .catch((err) => {console.log(err)});

            set_name((user) ? user.discord_id : null);
            set_role((user) ? user.role_name : null);
            set_already_tried(true);
        };

        get_user();
    }, []);

    if(!already_tried)
        return  <>
                    <Loader />
                </>;
    else if(!name || !role)
        return  <>
                    <p>An error occured</p>
                </>;
    else
        return <>
            <h1>{name}</h1>
            <h2>{role}</h2>
            <Button 
                message={"Logout"} 
                on_click={() => {axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/auth/logout`, {withCredentials: true,}); window.location.reload(true);}} 
                background_color={"#5662f6"}
                color={"white"}
            />
        </>
}

export default profile_page;