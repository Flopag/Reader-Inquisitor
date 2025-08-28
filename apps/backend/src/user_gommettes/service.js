const UserGommette = require('@models/user_gommette');
const TransactionService = require('@app/transactions/service');

async function get_user_gommettes(user_id){
    return await UserGommette.findAll({
        where: {user_id: user_id,},
        order: [['assigned_date', 'DESC']],
    });
}

async function assign_user_gommettes(user_id, assigned_date, gommette_color, gommette_book_id){
    const new_gommette = await UserGommette.create({
        user_id: user_id,
        assigned_date: assigned_date || require('sequelize').Sequelize.fn('CURRENT_DATE'),
        gommette_color: gommette_color,
        gommette_book_id: gommette_book_id
    });

    await TransactionService.make_transactions(user_id, `${gommette_color}_gommette`, 1);

    return await UserGommette.findOne({where: {gommette_id: new_gommette.gommette_id}});
}

async function remove_user_gommettes(gommette_id){
    await UserGommette.destroy({
        where: {
            gommette_id: gommette_id
        }
    });

    try{
        await TransactionService.make_transactions(user_id, `${gommette_color}_gommette`, -1);
    } catch (err) {
        
    }
}

async function does_gommette_exist(gommette_id){
    return !!(await UserGommette.findOne({where: {gommette_id: gommette_id}}));
}

module.exports = {
    get_user_gommettes,
    assign_user_gommettes,
    remove_user_gommettes,
    does_gommette_exist,
};