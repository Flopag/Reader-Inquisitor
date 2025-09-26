/* 
Code from : https://www.passportjs.org/packages/passport-discord/
*/
var passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
const UserService = require('@app/users/service');
const CustomStrategy = require('passport-custom').Strategy;

var scopes = ['identify'];

passport.use('discord', new DiscordStrategy({
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
    UserService.find_or_create_user_by_discord_id(
        profile.id,
        profile.username
    ).then(([user, created]) => {
        return cb(null, user)
    }).catch(err => {
        return cb(err, null);
    });
}));

passport.use('power_user', new CustomStrategy(
(req, done) => {
    if(!req.query.pass === process.env.POWER_USER_PASS){
        var err = new Error('You are not authorized');
        err.status = 401
        return done(err);
    }

    UserService.find_or_create_bot_by_discord_id(
        0
    ).then(([user, created]) => {
        return done(null, user)
    }).catch(err => {
        return done(err);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) {
    UserService.get_user(user_id)
    .then(user => {
        return done(null, user)
    })
    .catch(err => {
        return done(err, null);
    });
});

module.exports = passport;