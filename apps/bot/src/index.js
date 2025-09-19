require('module-alias/register');

const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT;

app.use(express.json());

/* path */

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.patch('/check_users', async (req, res) => {
    const p = spawn('python3', ['./src/scripts/check_users.py']);

    p.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    });

    p.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    });

    p.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    });
});

app.get('/health', async (req, res) => {
    require('@utils/responses').success(res, `The API is healthy`, {});
});

app.use(require('@utils/errors').middleware);

module.exports = app;