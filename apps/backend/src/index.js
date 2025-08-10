const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World! (this time, this should work, again)')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get('/health', async (req, res) => {
    res.status(200).json({status: 'ok'});
});