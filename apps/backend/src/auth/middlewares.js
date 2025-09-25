const UserService = require('@app/users/service');

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
    require('@models/user').findOrCreate({
    where: {
        discord_id: req.body.user.discord_id},
        defaults: {
            role_name: req.body.user.role_name || "Basic",
        },
    }).then(([user, created]) => {
        req.user = user;
        next();
    }).catch(err => {
        next(err);
    });
};

function usurpate(req, res, next) {
    let usurpation = null;
    if(req.method == "GET")
        usurpation = req.query.usurpation;
    else
        usurpation = req.body?.usurpation;
    if(!usurpation){
        next();
        return;
    }

    if(!req.user || !req.user.role_name){
        var err = new Error('no user or user.role_name in the request');
        err.status = 400
        next(err);
        return;
    }

    if(!(req.user.role_name === "Bot" || req.user.role_name === "Admin" || req.user.role_name === "Maintainer")){
        var err = new Error('user is not authorized: must be at least Admin');
        err.status = 401
        next(err);
        return;
    }

    UserService.does_user_exists(usurpation
    ).then((does_exists) => {
        if(!does_exists){
            var err = new Error(`The given user with id ${usurpation} does not exists`);
            err.status = 400
            throw err;
        }
        return UserService.get_user(usurpation);
    }).then((user) => {
        if( ((! (req.user.role_name === "Bot")) && 
            (user.role_name === "Admin" || user.role_name === "Maintainer" || user.role_name === "Bot") && req.method != "GET")){
            var err = new Error('An authorized user cannot usurpate another authorized user');
            err.status = 401
            throw err;
        }
        const aux = req.user;
        req.user = user;
        req.user.role_name = aux.role_name;
        next();
    }).catch(err => {
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

    if(req.user.role_name === "Bot" || req.user.role_name === "Basic" || req.user.role_name === "Admin" || req.user.role_name === "Maintainer")
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

    if(req.user.role_name === "Bot" || req.user.role_name === "Admin" || req.user.role_name === "Maintainer")
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

function on_backdoor(req, res, next) {
    if(req.socket.localPort == process.env.BACKDOOR_PORT && req.query.pass === process.env.POWER_USER_PASS)
        next();
    else{
        var err = new Error('You are not authorized');
        err.status = 401
        next(err);
    }
};

module.exports = {
    mocked_user,
    is_connected,
    usurpate,
    at_least_basic,
    at_least_admin,
    at_least_maintainer,
    on_backdoor,
};