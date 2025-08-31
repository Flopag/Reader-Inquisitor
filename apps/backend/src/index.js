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

app.get('/', (req, res) => {
    res.redirect('/users');
});

app.get('/health', async (req, res) => {
    await sequelize.authenticate();

    require('@utils/responses').success(res, `The API is healthy`, {});
});

app.use('/auth', require('@app/auth/index'));
app.use('/books', require('@app/books/index'));
app.use('/logs', require('@app/logs/index'));
app.use('/transactions', require('@app/transactions/index'));
app.use('/balances', require('@app/account_balances/index'));
app.use('/gommettes', require('@app/user_gommettes/index'));
app.use('/users', require('@app/users/index'));

app.use(require('@utils/errors').middleware);

module.exports = app;