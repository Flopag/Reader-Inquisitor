const Log = require('@models/read_log');

async function find_or_create(user_id, book_id, completion){
    if(completion < 0 || completion > 100)
        throw new Error(`The completion must be between 0 and 100, given: ${completion}`);

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
}

async function get_latest_completion(user_id, book_id){
    const response = (await Log.findOne({
            where: {user_id: user_id, book_id: book_id},
            order: [['read_log_id', 'DESC']],
            attributes: ['completion'],
        }));
    return (response) ? response.completion : null;
}

async function get_all_logs(user_id, book_id){
    return (await Log.findAll({
            where: {user_id: user_id, book_id: book_id},
            order: [['read_log_id', 'DESC']],
        }));
}

async function get_last_log(user_id){
    return (await Log.findOne({
            where: {user_id: user_id},
            order: [['read_log_id', 'DESC']],
        }));
}

async function get_last_log_from_book(user_id, book_id){
    return (await Log.findOne({
            where: {user_id: user_id, book_id: book_id},
            order: [['read_log_id', 'DESC']],
        }));
}

async function destroy_by_id(log_id){
    return await Log.destroy({where: {read_log_id: log_id}});
}

module.exports = {
    find_or_create,
    get_latest_completion,
    get_all_logs,
    get_last_log,
    get_last_log_from_book,
    destroy_by_id,
};