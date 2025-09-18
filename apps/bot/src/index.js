require('module-alias/register');

const express = require('express');

const app = express();
const port = process.env.PORT;

app.use(express.json());

/* path */

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/health', async (req, res) => {
    require('@utils/responses').success(res, `The API is healthy`, {});
});

app.use(require('@utils/errors').middleware);

module.exports = app;