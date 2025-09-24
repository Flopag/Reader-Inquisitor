const express = require('express');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

router.patch('/check_users',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {  
    const result = await require('request-promise-native')({
        method: 'PATCH',
        uri: process.env.BOT_URL + "/check_users",
        json: true
    });

    console.log(result);

    Respond.success(res, `The result is in the data field`, result)
});

module.exports = router;