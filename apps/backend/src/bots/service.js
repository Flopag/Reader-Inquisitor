const BotLog = require('@models/bot_log');

async function is_last_exucution_made_x_less_than_hours_ago(bot_name, hours){
    const last_log = (await BotLog.findOne({
            where: {bot_name: bot_name},
            order: [['assigned_date', 'DESC']]
        }));
    
    if(!last_log)
        return false;

    const now = new Date();
    const last_execution = new Date(last_log.assigned_date);
    const x = hours * 60 * 60 * 1000;

    if(now - last_execution < x)
        return true;
    return false;
}

async function create(bot_name){
    await BotLog.findOrCreate({
        where: {
            bot_name: bot_name,
            assigned_date: require('sequelize').Sequelize.fn('CURRENT_TIMESTAMP'),
        },
        defaults: {},
    });
}

async function get_last_log(bot_name){
    const last_log = (await BotLog.findOne({
            where: {bot_name: bot_name},
            order: [['assigned_date', 'DESC']]
        }));

    return last_log;
}

async function get_second_last_log(bot_name){
    const last_logs = (await BotLog.findAll({
            where: {bot_name: bot_name},
            order: [['assigned_date', 'DESC']],
            limit: 2,
        }));

    return last_logs.length >= 2 ? last_logs[1] : null;
}

module.exports = {
    is_last_exucution_made_x_less_than_hours_ago,
    create,
    get_last_log,
    get_second_last_log
};