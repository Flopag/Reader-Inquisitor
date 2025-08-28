const Currency = require('@models/currency');

async function does_currency_exists(currency_name){
    return !!(await Currency.findOne({where: {currency_name: currency_name}}));
}

async function get_currencies(){
    return await Currency.findAll({});
}

module.exports = {
    does_currency_exists,
    get_currencies,
}