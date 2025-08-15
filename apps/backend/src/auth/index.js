const express = require('express');
const passport = require('@app/auth/oauth2_discord');

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
    res.send(`Hello, your are the user number ${req.user.user_id} connected with the discord account ${req.user.discord_id} having the role ${req.user.role_name}.`);
    res.status(200).json({
        "success": true,
        "message": `Your are the user number ${req.user.user_id} connected with the discord account ${req.user.discord_id} having the role ${req.user.role_name}`,
        "data": {},
        "error_code": null,
    });
});

router.get('/can_i_basic',
    require('@app/auth/middlewares').at_least_basic,
(req, res) => {
    res.status(200).json({
        "success": true,
        "message": `The user ${req.user.user_id} can have Basic authorizations`,
        "data": {},
        "error_code": null,
    });
});

router.get('/can_i_admin',
    require('@app/auth/middlewares').at_least_admin,
(req, res) => {
    res.status(200).json({
        "success": true,
        "message": `The user ${req.user.user_id} can have Admin authorizations`,
        "data": {},
        "error_code": null,
    });
});

router.get('/can_i_maintainer',
    require('@app/auth/middlewares').at_least_maintainer,
(req, res) => {
    res.status(200).json({
        "success": true,
        "message": `The user ${req.user.user_id} can have Maintainer authorizations`,
        "data": {},
        "error_code": null,
    });
});

module.exports = router;