function throw_if_not_connected(req, res, next) {
    if (!req.user) 
        return res.status(401).json({ error: 'Not logged in' });
    next();
};

function mocked_user(req, res, next) {
    if(!req.body || !req.body.user || !req.body.user.discord_id){
        next();
        return;
    }
    require('@models/user').findOrCreate({
    where: {
        discord_id: req.body.user.discord_id},
        defaults: {
            role_name: (!req.body.user.role_name) ? req.body.user.role_name : "Basic",
        },
    }).then(([user, created]) => {
        req.user = user;
        next();
    }).catch(err => {
        console.error('Unable to findOrCreate User: ', err);
        return res.status(500).json({ error: 'Internal error' });
    });
};


module.exports = {
    throw_if_not_connected,
    mocked_user,
};