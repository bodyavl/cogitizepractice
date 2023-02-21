const express = require("express");
const Movie = require("../database/schemes/movie");
const axios = require("axios").default;
const router = express.Router();

router.get("/axios/:id", (req, res, next) => {
    try {
        const movieId = Number(req.params.id);
        if(movieId > 61 && movieId < 958) {
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, 
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }
            })
            .then((result) => 
            {
                res.json(result.data);
            })
        }
        else {
            throw new Error("Incorrect movie id!");
        }
    }
    catch(err) {
        next(err);
    }
});

router.get("/list", async (req, res, next) => {
    try {
        const moviesList = await Movie.find({});
        res.json(moviesList);
    }
    catch(err) {
        next(err);
    }
});

router.get("/delDB", async (req, res, next) => {
    try {
        const movies = await Movie.find({});
        for(let movie of movies) {
            await Movie.findByIdAndDelete(movie.id);
        }
        res.sendStatus(200);
    }
    catch(err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        
        if(movie != null) {
            res.json(movie);
        }
        else {
            throw new Error("Incorrect movie id!");
        }
        
    }
    catch(err) {
        next(err);
    }
});

router.post("/add", express.json(), async (req, res, next) => {
    const data = req.body;
    try {
        const newMovie = await Movie.create(
            {
                title: data.title,
                author: data.author,
                description: data.description
            }
        );
        console.log(`Movie ${data.title} created: `, newMovie);

        res.json(newMovie);
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;