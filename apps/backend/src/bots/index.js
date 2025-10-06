const express = require('express');
const BotService = require('@app/bots/service');
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
    if(await BotService.is_last_exucution_made_x_less_than_hours_ago("check_users", 12))
        ErrorFactory.forbidden("The execution of the bot has been made less than 12 hours ago");
    
    const result = await require('request-promise-native')({
        method: 'PATCH',
        uri: process.env.BOT_URL + "/check_users",
        json: true
    });

    await BotService.create("check_users");

    Respond.success(res, `The result is in the data field`, result)
});

router.get('/check_users/log',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {    
    const bot_log = await BotService.get_last_log("check_users");

    if(!bot_log)
        ErrorFactory.bad_argument(`The bot han no log yet`);

    Respond.success(res, `The bot log is in the data field`, bot_log)
});

module.exports = router;