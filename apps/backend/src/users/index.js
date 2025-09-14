const express = require('express');
const ErrorFactory = require('@utils/errors');
const Respond = require('@utils/responses');
const UserService = require('@app/users/service');

const router = express.Router();

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);
router.use(require('@app/auth/middlewares').usurpate);

router.get('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const user = await UserService.get_user(req.user.user_id);

    Respond.success(res, `The user with user id ${req.user.user_id} is in data`, user);
});

router.patch('/',
    require('@app/auth/middlewares').at_least_basic,
async (req, res) => {
    const { user_url } = req.body;

    if(!user_url)
        ErrorFactory.bad_argument(`The user_url has not been provided`);

    const goodreads_url = new URL(user_url);

    if(!(goodreads_url.host === "www.goodreads.com"))
        ErrorFactory.bad_argument(`The given url in not www.goodreads.com`);

    if(!(goodreads_url.pathname.split("/")[1] === "user" && 
         goodreads_url.pathname.split("/")[2] === "show"))
        ErrorFactory.bad_argument(`The given url does not have the path /user/show/`);

    const user = await UserService.set_user_url(req.user.user_id, user_url);

    Respond.success(res, `The user with user id ${req.user.user_id} has its url modified`, user);
});

router.get('/active',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const users = await UserService.get_users_with_url();

    Respond.success(res, `All active users are in data`, users);
});

router.get('/all',
    require('@app/auth/middlewares').at_least_admin,
async (req, res) => {
    const users = await UserService.get_all_users();

    Respond.success(res, `All users are in data`, users);
});

router.get('/can_i_basic',
    require('@app/auth/middlewares').at_least_basic,
(req, res) => {
    Respond.success(
        res,
        `The user ${req.user.user_id} can have Basic authorizations`,
        {});
});

router.get('/can_i_admin',
    require('@app/auth/middlewares').at_least_admin,
(req, res) => {
    Respond.success(
        res,
        `The user ${req.user.user_id} can have Admin authorizations`,
        {});
});

router.get('/can_i_maintainer',
    require('@app/auth/middlewares').at_least_maintainer,
(req, res) => {
    Respond.success(
        res,
        `The user ${req.user.user_id} can have Maintainer authorizations`,
        {});
});

module.exports = router;