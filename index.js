// import express from "express";
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json({ type: 'application/json' }))
const port = 3000

app.get('/', (req, res) => {
    console.log(req.query);
  res.send('Hello World!')
})
app.post('/', (req, res) => {
    console.log(req.body);
  res.send('Hello World! POST')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})