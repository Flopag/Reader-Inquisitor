const express = require('express');
const BotService = require('@app/bots/service');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

let is_processing_check_users = false;

router.patch('/check_users',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {  
    while(is_processing_check_users)
        await sleep(100);
    is_processing_check_users = true;

    try {
        const now = new Date();
        if(await BotService.is_last_exucution_made_x_less_than_hours_ago("check_users", now.getHours()))
            ErrorFactory.forbidden(`The execution of the bot has already be made today. You must wait ${24 - now.getHours()} hours`);
        
        const result = await require('request-promise-native')({
            method: 'PATCH',
            uri: process.env.BOT_URL + "/check_users",
            json: true
        });

        await BotService.create("check_users");

        Respond.success(res, `The result is in the data field`, result)
    } finally  {
        is_processing_check_users = false;
    }
});

router.get('/check_users',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {  
    while(is_processing_check_users)
        await sleep(100);
    is_processing_check_users = true;

    try {
        const now = new Date();
        if(!await BotService.is_last_exucution_made_x_less_than_hours_ago("check_users", now.getHours()))
            ErrorFactory.forbidden(`The execution of the bot has not been made today`);
        
        const result = await require('request-promise-native')({
            method: 'GET',
            uri: process.env.BOT_URL + "/check_users",
            json: true
        });

        Respond.success(res, `The result is in the data field`, result)
    } finally  {
        is_processing_check_users = false;
    }
});

router.get('/check_users/log',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {    
    const bot_log = await BotService.get_last_log("check_users");

    if(!bot_log)
        ErrorFactory.bad_argument(`The bot han no log yet`);

    Respond.success(res, `The bot log is in the data field`, bot_log)
});

router.get('/check_users/log/second',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {    
    const bot_log = await BotService.get_second_last_log("check_users");

    if(!bot_log)
        ErrorFactory.bad_argument(`The bot han no log yet`);

    Respond.success(res, `The bot log is in the data field`, bot_log)
});

module.exports = router;