const express = require('express');
const passport = require('@app/auth/oauth2_discord');

const router = express.Router();

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/me')
});

module.exports = router;