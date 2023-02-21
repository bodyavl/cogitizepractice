const { request } = require('express');
const express = require('express');
const router = express.Router();
const Movie = require("../database/schemas/movie.js");
const getRandomArbitrary = require('../util/random.js');
const shuffle = require('../util/shuffle.js');

router.get("/list", async (req, res, next) => {
    try {
        // const movies = await Movie.find().select("-description -v -title");
        const filmscounts = await Movie.count();
        console.log(filmscounts);
        const { count = 10 } = req.query;
        const skip = getRandomArbitrary(0, filmscounts - count);
        const movies = await Movie.find({}, "id", { skip: skip, limit: count }).select("_id title rating author");
        const shuffledMovies = shuffle(movies);
        console.log(req.query);
        res.json(shuffledMovies);
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const movieId = req.params["id"];
        const movie = await Movie.findById(movieId);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});

router.delete("/delete/:id", async (req, res, next) => {
    try {
        const movieId = req.params["id"];
        const movie = await Movie.findOneAndDelete(movieId);
        res.json(movie);
    } catch (error) {
        next(error);
    }
});

router.post("/create", async (req, res, next) => {
    try {
        console.log("Create movie request", req.body);
        const { title, author, description, genre, rating } = req.body;
        const movie = await Movie.create({
            title,
            author,
            description,
            genre,
            rating
        });
        console.log("Movie created:", movie);

        res.json(movie);
    } catch (error) {
        next(error);
    }
});

module.exports = router