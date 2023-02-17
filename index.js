const express = require('express')
const app = express()

const bodyparser = require('body-parser')
app.use(bodyparser.json())

const database = require("./database")

const Movie = require("./database/schemes/movie")

const port = 3000

const errorHandler = (error, req, res, next) => {
    res.header("Content-Type", "application/json")
    console.log("Error occured:", error.message);
    res.status(500).send(error.message)
}

app.get('/movie/:id', async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId)
        console.log(movie)
        res.json(movie)
    }
    catch (error) {
        next(error)
    }
})

app.get('/movies', async (req, res, next) => {
    try {
        const moviesList = await Movie.find({});
        console.log(moviesList)
        res.json(moviesList)
    }
    catch (error) {
        next(error)
    }
})

app.post('/addMovie', async (req, res, next) => {
    try {
        const newMovie = await Movie.create(
            {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description
            }
        )
        console.log('Movie has been created: ', newMovie)

        res.json(newMovie)
    }
    catch (error) {
        next(error)
    }
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started on ${port} port`)
})