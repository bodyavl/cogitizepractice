const express = require('express')
const bodyparser = require('body-parser')
const app = express()
app.use(bodyparser.json({ type: "application/json"}))
const port = 3000

app.get('/', (req, res) => {
    console.log(req.query);
    res.send('Hello Get')
})

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hello Post')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})