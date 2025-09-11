const express = require('express');
const passport = require('@app/auth/oauth2_discord');
const Respond = require('@utils/responses');

const router = express.Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/power_user', 
    require('@app/auth/middlewares').on_backdoor,
    passport.authenticate('power_user', {
        failureRedirect: '/'
    }), 
function(req, res) {
    res.redirect('/');
});

router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/');
});

if(process.env.IS_TESTING)
    router.use(require('@app/auth/middlewares').mocked_user);
router.use(require('@app/auth/middlewares').is_connected);

module.exports = router;