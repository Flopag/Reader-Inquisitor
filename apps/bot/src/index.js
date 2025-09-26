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
    let resultArray = null;

    
    p.stdout.on('data', (data) => {
        try {
            resultArray = JSON.parse(data.toString());
        } catch (err) {
            console.error("Error parsing JSON:", err);
        }
    });
    
    p.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    p.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if(code==0)
            require('@utils/responses').success(res, `See data to get results`, resultArray);
        else
            require('@utils/responses').fail(res, "The bot exited with exit code 1");
    });
});

app.get('/health', async (req, res) => {
    require('@utils/responses').success(res, `The API is healthy`, {});
});

app.use(require('@utils/errors').middleware);

module.exports = app;