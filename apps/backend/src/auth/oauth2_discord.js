/* 
Code from : https://www.passportjs.org/packages/passport-discord/
*/
var passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;
var User = require('@models/user');

var scopes = ['identify'];

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: scopes
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
        where: {discord_id: profile.id},
        defaults: {
            role_name: "Basic",
        },
    }).then(([user, created]) => {
        return cb(null, user)
    }).catch(err => {
        return cb(err, null);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(user_id, done) {
    User.findByPk(user_id)
    .then(user => {
        return done(null, user)
    })
    .catch(err => {
        return done(err, null);
    });
});

module.exports = passport;