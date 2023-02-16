const express = require('express')
const app = express()

const bodyparser = require('body-parser')
app.use(bodyparser.json())

const database = require("./database")

const port = 3000

const errorHandler = (error, req, res, next) => {
    res.header("Content-Type", "application/json")
    console.log("Error occured:", error.message);
    res.status(500).send(error.message)
}

app.get('/getMovie/:id', async (req, res, next) => {
    try {
        const movieId = req.params.id;
    }
    catch (error) {
        next(error)
    }
})

app.get('/movies', async (req, res, next) => {
    try {
        const moviesList = req.params.id;
    }
    catch (error) {
        next(error)
    }
})

app.post('/addMovie', async (req, res, next) => {
    try {
        const addMovie = req.params.id;
    }
    catch (error) {
        next(error)
    }
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started on ${port} port`)
})