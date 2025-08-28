const AccountBalance = require('@models/account_balance');
const TransactionService = require('@app/transactions/service');
const CurrencyService = require('@app/currencies/service');

async function does_exist(user_id, account_currency_name){
    return !!(await AccountBalance.findOne({where: {
        user_id: user_id, 
        account_currency_name: account_currency_name
    }}));
}

async function get_balances(user_id){
    return await AccountBalance.findAll({where: {user_id: user_id}});
}

async function update_balances(user_id){
    const currencies = await CurrencyService.get_currencies();

    for(i=0; i<currencies.length; ++i){
        const currency_name = currencies[i].currency_name;
        const sum = await TransactionService.get_transactions_sum(user_id, currency_name);
        if(await does_exist(user_id, currency_name)){
            await AccountBalance.update({amount: sum},{
                where: {
                    user_id: user_id,
                    account_currency_name: currency_name
                },
            });
        } else {
            await AccountBalance.create({
                    user_id: user_id,
                    account_currency_name: currency_name,
                    amount: sum
            });
        }
    }

    return await get_balances(user_id);
}

module.exports = {
    does_exist,
    get_balances,
    update_balances,
}