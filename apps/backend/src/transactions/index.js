const express = require('express');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');
const TransactionService = require('@app/transactions/service');
const CurrencyService = require('@app/currencies/service');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

router.get("/:currency_name",
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { currency_name } = req.params;
        
    if(!currency_name)
        ErrorFactory.bad_argument(`The name of the currency is missed`);

    if(!await CurrencyService.does_currency_exists(currency_name))
        ErrorFactory.bad_argument(`The currency with the name ${currency_name} does not exists`);

    const transactions = await TransactionService.get_transactions(req.user.user_id, currency_name);

    Respond.success(res, `The transactions for the currency ${currency_name} are in data field`, transactions);
});

router.get("/sum/:currency_name",
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { currency_name } = req.params;
        
    if(!currency_name)
        ErrorFactory.bad_argument(`The name of the currency is missed`);

    if(!await CurrencyService.does_currency_exists(currency_name))
        ErrorFactory.bad_argument(`The currency with the name ${currency_name} does not exists`);

    const sum = await TransactionService.get_transactions_sum(req.user.user_id, currency_name);

    Respond.success(res, `The transactions sum for the currency ${currency_name} is in data field`, sum);
});

router.post("/:currency_name",
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    if(!req.body?.amount)
            ErrorFactory.bad_argument(`An amount and a currency are needed to create a book`);
    
    const { currency_name } = req.params;
        
    if(!currency_name)
        ErrorFactory.bad_argument(`The name of the currency is missed`);

    if(!await CurrencyService.does_currency_exists(currency_name))
        ErrorFactory.bad_argument(`The currency with the name ${currency_name} does not exists`);

    if(!(await TransactionService.have_capacity(req.user.user_id, currency_name, req.body.amount)))
        ErrorFactory.bad_argument(`The transaction amount exeed the user capacity`);
    
    await TransactionService.make_transactions(req.user.user_id, currency_name, req.body.amount);

    Respond.success(res, `The transactions has been made`, {});
});

module.exports = router;