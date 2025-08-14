require('module-alias/register');

const express = require('express')
const sequelize = require('@utils/mysql_connection');
var session = require('express-session')

const app = express()
const port = process.env.PORT

/* middleware configuration */

// code from https://www.npmjs.com/package/express-session
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // To set to true if https
}));

app.use(require('@app/auth/oauth2_discord').initialize());
app.use(require('@app/auth/oauth2_discord').session());
app.use(express.json());

/* path */

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/health', async (req, res) => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('[health]: Unable to connect to the database:', error);
        res.status(500).json({
        "success": false,
        "message": "Unable to connect to the database",
        "data": {},
        "error_code": null,
    });
        return;
    }

    res.status(200).json({
        "success": true,
        "message": "The API is healthy",
        "data": {},
        "error_code": null,
    });
});

app.use('/auth', require('./auth/index'));

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        "success": false,
        "message": err.message,
        "data": {},
        "error_code": null,
    });
});

module.exports = app;