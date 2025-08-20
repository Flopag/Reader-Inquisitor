const User = require('@models/user');

function is_connected(req, res, next) {
    if (!req.user){
        var err = new Error('Not logged in');
        err.status = 401
        next(err);
        return;
    }
    next();
};

function mocked_user(req, res, next) {
    if(!req.body || !req.body.user || !req.body.user.discord_id){
        var err = new Error(`no body, body.user,  or body.user.discord_id in the request`);
        err.status = 400;
        next(err);
        return;
    }
    User.findOrCreate({
    where: {
        discord_id: req.body.user.discord_id},
        defaults: {
            role_name: req.body.user.role_name || "Basic",
        },
    }).then(([user, created]) => {
        req.user = user;
        next();
    }).catch(err => {
        var err = new Error('Cannot create or find the user: ', err);
        next(err);
    });
};

function at_least_basic(req, res, next) {
    if(!req.user || !req.user.role_name){
        var err = new Error('no user or user.role_name in the request');
        err.status = 400
        next(err);
        return;
    }

    if(req.user.role_name === "Basic" || req.user.role_name === "Admin" || req.user.role_name === "Maintainer")
        next()
    else{
        var err = new Error('user is not authorized: must be at least Basic');
        err.status = 401
        next(err);
    }
};

function at_least_admin(req, res, next) {
    if(!req.user || !req.user.role_name){
        var err = new Error('no user or user.role_name in the request');
        err.status = 400
        next(err);
        return;
    }

    if(req.user.role_name === "Admin" || req.user.role_name === "Maintainer")
        next()
    else{
        var err = new Error('user is not authorized: must be at least Admin');
        err.status = 401
        next(err);
    }
};

function at_least_maintainer(req, res, next) {
    if(!req.user || !req.user.role_name){
        var err = new Error('no user or user.role_name in the request');
        err.status = 400
        next(err);
        return;
    }

    if(req.user.role_name === "Maintainer")
        next()
    else{
        var err = new Error('user is not authorized: must be at least Maintainer');
        err.status = 401
        next(err);
    }
};

module.exports = {
    mocked_user,
    is_connected,
    at_least_basic,
    at_least_admin,
    at_least_maintainer,
};