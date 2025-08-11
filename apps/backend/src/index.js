require('module-alias/register');

const express = require('express')
const sequelize = require('@utils/mysql_connection');
var session = require('express-session')

const app = express()
const port = process.env.PORT

/* Session configuration */

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

/* path */

app.get('/', (req, res) => {
  res.send('Hello World! (this time, this should work, again)')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    res.send(`Hello, your are the user number ${req.user.user_id} connected with the discord account ${req.user.discord_id}.`);
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).json({status: 'Unable to connect to the database'});
    return;
  }
  
  res.status(200).json({status: 'ok'});
});

app.use('/auth', require('./auth/index'));

module.exports = app;