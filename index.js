const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    console.log(req.query);
    res.send('Hello geted World!')
})

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hello posted World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})