const Log = require('@models/read_log');

async function find_or_create(user_id, book_id, completion){
    if(completion < 0 || completion > 100)
        throw new Error(`[LogService/find_or_create]: The completion must be between 0 and 100, given: ${completion}`);
        
    try {
        await Log.findOrCreate({
            where: {
                user_id: user_id,
                logged_at: require('sequelize').Sequelize.fn('CURRENT_TIMESTAMP'),
                book_id: book_id,
                completion: completion,
            },
            defaults: {},
        });
        return (await Log.findOrCreate({
            where: {
                user_id: user_id,
                logged_at: require('sequelize').Sequelize.fn('CURRENT_TIMESTAMP'),
                book_id: book_id,
                completion: completion,
            },
            defaults: {},
        }))[0];
    } catch (err) {
        throw new Error(`[LogService/find_or_create]: An error occured with the database: ${err.message}`);
    }
}

async function get_latest_completion(user_id, book_id){
    try {
        return (await Log.findOne({
            where: {user_id: user_id, book_id: book_id},
            order: [['logged_at', 'DESC']],
            attributes: ['completion'],
        })).completion;
    } catch (err) {
        throw new Error(`[LogService/get_latest_completion]: An error occured with the database: ${err.message}`);
    }
}

module.exports = {
    find_or_create,
    get_latest_completion
};