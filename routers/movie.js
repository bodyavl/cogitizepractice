const { response } = require('express');
const express = require('express');
const router = express.Router();
const Movie = require("../database/schemas/movie.js");
const axios = require("axios").default;

router.get("/list", async (req, res, next) => {
    try {
        // const movies = await Movie.find().select("-description -v -title");
        const movies = await Movie.find().select("_id title rating author");
        res.json(movies);
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

axios.get(`https://api.themoviedb.org/3/movie/550?`, {
    params: {
        api_key:process.env.TMBD_API_KEY
    }
}).then((response) => {
    // console.log(response.data);
    console.log(response.config);
})

module.exports = router