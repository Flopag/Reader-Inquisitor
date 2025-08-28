const Currency = require('@models/currency');

async function does_currency_exists(currency_name){
    return !!(await Currency.findOne({where: {currency_name: currency_name}}));
}


module.exports = {
    does_currency_exists,
}