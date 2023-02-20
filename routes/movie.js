const express = require('express')
const router = express.Router()

const Movie = require("../database/schemes/movie")

router.get('/list', async (req, res, next) => {
    try {
        const moviesList = await Movie.find({});
        console.log(moviesList)
        res.json(moviesList)
    }
    catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
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

router.post('/add', async (req, res, next) => {
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

module.exports = router