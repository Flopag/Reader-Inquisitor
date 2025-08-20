const express = require('express');
const passport = require('@app/auth/oauth2_discord');
const Respond = require('@utils/responses');

const router = express.Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/');
});

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);

router.get('/me',
(req, res) => {
    Respond.success(
        res,
        `Your are the user number ${req.user.user_id} connected with the discord account ${req.user.discord_id} having the role ${req.user.role_name}`,
        {});
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