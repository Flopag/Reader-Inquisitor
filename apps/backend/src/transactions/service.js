const Transaction = require('@models/transaction');

async function get_transactions(user_id, account_currency_name){
    return await Transaction.findAll({
        where: {user_id: user_id, account_currency_name: account_currency_name},
        order: [['logged_at', 'DESC']],
    });
}

async function get_transactions_sum(user_id, account_currency_name){
    const transactions = await get_transactions(user_id, account_currency_name);
    var sum = 0;
    transactions.forEach(transaction => {
        sum += transaction.amount;
    });
    return sum;
}

async function have_capacity(user_id, account_currency_name, amount){
    if(amount > 0)
        return true;

    if(await get_transactions_sum(user_id, account_currency_name) < -amount)
        return false;
    return true;
}

async function make_transactions(user_id, account_currency_name, amount){
    if(!(await have_capacity(user_id, account_currency_name, amount)))
        throw new Error("transaction amout greater than allowed");
    return (await Transaction.create({
        user_id: user_id,
        account_currency_name: account_currency_name,
        amount: amount,
        logged_at: require('sequelize').Sequelize.fn('CURRENT_TIMESTAMP')
    }));
}

module.exports = {
    get_transactions,
    get_transactions_sum,
    have_capacity,
    make_transactions,
}