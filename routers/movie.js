const express = require('express')
const router = express.Router()

const Movie = require("../db/models/movie");


router.post("/create", async (req, res, next) => {
    try {
        console.log("Create movie request", req.body);
        const { title, description, image, slogan, author, genres, date, runTime, rating } = req.body;
        const newMovie = await Movie.create({ title, description, image, slogan, author, genres, date, runTime, rating });
        res.json(newMovie);
    } catch (error) {
        next(error);
    }
});

router.get('/list', async (req, res, next) => {
    try {
        const movies = await Movie.find().select("_id title image rating");
        if(movies) res.json(movies);
        else throw new Error("No movies found")
    } catch (error) {
        next(error);
    }
    
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id)
        if(movie) res.json(movie);
        else throw new Error("Movie was not found");
    } catch (error) {
        next(error);
    }
})

module.exports = router