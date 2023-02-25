const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const router = express.Router();
const axios= require("axios").default;
const Movie = require("../database/schemes/movie");
const { shuffle } = require("../utils");

router.post('/createMovie', async (req, res, next) => {
  try{
   console.log("Create movie request",req.body);
    const {id,title, description, rating, genres,poster,logo,run_time} = req.body;
    const movie =  await Movie.create ({
      id,
      title,
      description,
      rating, 
      genres,
      run_time,
      poster,
      logo,
    });
    console.log("Movie created :", movie);
    res.json(movie);
  } catch (error) {
    next(error);
  }
  });
  const types = {
    Movie: "Movie",
    TV: "TV show"
  }
const genresList = {
  Any: null,
  Action: "Action",
  Horror: "Horror",
  Drama: "Drama",
  Comedy: "Comedy"
}
router.get("/list", async (req, res, next) => {
  try {
    const { genre, type } = req.query;

    const options = {};

    if (genre && genresList[genre])
      options.genres = { $elemMatch: { name: genresList[genre] } };

    if (type && types[type]) options.type = types[type];

    const movies = await Movie.find(options).select("_id type title poster rating genres");
    const shuffledMovies = shuffle(movies);
    if (!shuffledMovies) throw new Error("No movies found");
    res.status(200).json(shuffledMovies.slice(0, 8));
  } catch (error) {
    next(error);
  }
});
  router.get("/:id", async (req, res, next) => {
    try {
        const movieId = req.params["id"];
        res.json(movie);
    } catch (error) {
        next(error);
    }
});


 