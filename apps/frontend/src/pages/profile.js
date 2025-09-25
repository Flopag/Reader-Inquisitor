import { useEffect, useState } from "react";
import axios from 'axios';

import Loader from '@widgets/loader';
import Button from '@widgets/button';

function profile_page(){
    const [already_tried, set_already_tried] = useState(false);
    const [name, set_name] = useState(null);
    const [role, set_role] = useState(null);
    const [user_url, set_user_url] = useState(null);
    const [new_user_url, set_new_user_url] = useState(null);
    const [update_user_url, set_update_user_url] = useState(false);
    const [user_attributions, set_user_attributions] = useState(null);
    const [run_bot_check_users, set_run_bot_check_users] = useState(false);

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
            set_user_url((user) ? user.user_url : null);
            set_already_tried(true);
        };

        get_user();
    }, []);

    useEffect(() => {
        const run_bot = async () => {
            if(!run_bot_check_users)
                return;
            set_run_bot_check_users(false);

            const result = await axios.patch(`${process.env.API_PROTOCOL}://${process.env.API_URL}/bot/check_users`, 
                {}, 
                {withCredentials: true,})
                .then((res) => {
                    return res.data.data;
                })
                .catch((err) => {console.log(err)});

            if(!result || !result.success)
                return;

            const put_user = async (user_attribution) => {
                const user_id = user_attribution.user_id;

                const user = await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/users`, {
                        params: { usurpation: user_id },
                        withCredentials: true,
                    })
                    .then((res) => {
                        if(res.data.success) 
                            return res.data.data;
                        else
                            return null;
                    })
                    .catch((err) => {console.log(err)});
                
                user_attribution.user = user;

                return user_attribution;
            }
            const new_user_attributions = await Promise.all(result.data.map(put_user));

            set_user_attributions(new_user_attributions);
        };
        
        run_bot();
    }, [run_bot_check_users]);

    useEffect(() => {
        const get_user = async () => {
            if(!new_user_url)
                return;
            await axios.patch(`${process.env.API_PROTOCOL}://${process.env.API_URL}/users`, 
                {user_url: new_user_url}, 
                {withCredentials: true})
                .then((res) => {
                    window.location.reload(true);
                })
                .catch((err) => {console.log(err)});
        };

        get_user();
    }, [update_user_url]);

    const get_bot_html = () => {
        if(!role || !(role == "Maintainer" || role == "Admin"))
            return <div></div>;
        if(!user_attributions)
            return  <>
                        <Button 
                            message={"Check"} 
                            on_click={() => {set_run_bot_check_users(true);}} 
                            background_color={"#f66956"}
                            color={"white"}
                        />
                    </>;
        
        const get_user_attribution_html = () => {
            if(!user_attributions)
                return <p>Error</p>;
            const html_list = [];

            user_attributions.forEach(user_attribution => {
                html_list.push(<div key={user_attribution.user_id}>
                                <p>{user_attribution.user?.username || user_attribution.user?.discord_id || "Unknown"} - {user_attribution.gommette}</p>
                            </div>);
            });

            return html_list;
        };

        return  <>
                    {get_user_attribution_html()}
                </>;
    };

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
            <p>{(user_url) ? `Your current url is ${user_url}, fill the following field to update it:` : 
                `You do not have any url, fill the following field to set it:`}</p>
            <input 
                type="text" 
                id="login-update_url-url" 
                onChange={(e) => set_new_user_url(e.target.value)}
            />
            <Button 
                message={"Update Url"} 
                on_click={() => {set_update_user_url(!update_user_url);}} 
                background_color={"#5662f6"}
                color={"white"}
            />
            <Button 
                message={"Logout"} 
                on_click={() => {axios.get(`${process.env.API_PROTOCOL}://${process.env.API_URL}/auth/logout`, {withCredentials: true,}); window.location.reload(true);}} 
                background_color={"#f66956"}
                color={"white"}
            />
            {get_bot_html()}
        </>
}

export default profile_page;