const User = require('@models/user');

async function does_user_exists(user_id){
    return !!(await User.findOne({where: {user_id: user_id}})); 
}

async function get_user(user_id){
    return (await User.findOne({where: {user_id: user_id}})); 
}

async function set_user_url(user_id, user_url){
    await User.update(
        {user_url: user_url},
        {where: {user_id: user_id}}
    ); 

    return await get_user(user_id);
}

async function activate_user(user_id){
    await User.update(
        {is_active: true},
        {where: {user_id: user_id}}
    ); 

    return await get_user(user_id);
}

async function desactivate_user(user_id){
    await User.update(
        {is_active: false},
        {where: {user_id: user_id}}
    ); 

    return await get_user(user_id);
}

async function get_users_with_url(){
    return await User.findAll({where: {
        user_url: {
            [require('sequelize').Op.ne]: null
        }
    }});
}

async function get_active_users(){
    return await User.findAll({where: {
        is_active: true
    }});
}

async function get_all_users(){
    return await User.findAll();
}

async function find_or_create_user_by_discord_id(discord_id, username){
    return await User.findOrCreate({
            where: {discord_id: discord_id},
            defaults: {
                role_name: "Basic",
                username: username || null
            },
        })
}

async function find_or_create_bot_by_discord_id(discord_id){
    return await User.findOrCreate({
            where: {discord_id: discord_id},
            defaults: {
                role_name: "Bot",
            },
        })
}

module.exports = {
    does_user_exists,
    get_user,
    set_user_url,
    activate_user,
    desactivate_user,
    get_users_with_url,
    get_active_users,
    get_all_users,
    find_or_create_user_by_discord_id,
    find_or_create_bot_by_discord_id,
};