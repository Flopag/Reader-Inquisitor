const express = require('express');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');
const AccountBalanceService = require('@app/account_balances/service');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);


router.get("/",
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const balances = await AccountBalanceService.get_balances(req.user.user_id);
    Respond.success(res, `The account of the user ${req.user.user_id} can be found in the data field`, balances);
});

router.patch("/update/",
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    await AccountBalanceService.update_balances(req.user.user_id);

    Respond.success(res, `All accounts have been updates`, {});
});

module.exports = router;