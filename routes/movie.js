const express = require("express");
const router = express.Router();

const axios = require("axios").default;

const Movie = require("../database/schemes/movie");

const { shuffle } = require("../shuffle");

router.get("/list", async (req, res, next) => {
  try {
    const moviesList = await Movie.find().select("-id -__v");
    const shuffledMoviesList = shuffle(moviesList);
    res.status(200).json(shuffledMoviesList.slice(0, 10));
  } catch (error) {
    next(error);
  }
});

// Delete all movie-notes in the linked DB
router.get("/cleanDB", async (req, res, next) => {
  try {
    const moviesList = await Movie.find({});
    for (let movie of moviesList) {
      await Movie.findByIdAndDelete(movie._id);
    }
    res.sendStatus(200);
    console.log("DB of movies has been cleaned. It's empty!");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId).select("-id -__v");
    //console.log(movie);
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    const newMovie = await Movie.create({
      title: req.body.title,
      description: req.body.description,
      genres: req.body.genres,
      tagline: req.body.tagline,
      poster: req.body.poster,
      backdrop: req.body.backdrop,
      date: req.body.date,
      rating: req.body.rating,
      runtime: req.body.runtime,
    });
    //console.log("Movie has been created: ", newMovie);
    res.json(newMovie);
  } catch (error) {
    next(error);
  }
});

router.get("/TMDB/fill", async (req, res, next) => {
  try {
    setTimeout(addMoviesToDB, FETCHINGDELAY, 1);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Fill the DB with movies
const FETCHINGDELAY = 5000;
const iterationCount = 50;
async function addMoviesToDB(pageIteration = 1) {
  if (pageIteration > 1000) return;
  for (let i = pageIteration; i < pageIteration + iterationCount; i++) {
    const moviesRaw = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: "18|27|28|35",
          page: i,
        },
      }
    );
    let moviesIDs = [];
    moviesRaw.data.results.forEach((element) => {
      moviesIDs.push(element.id);
    });
    for (let movieId of moviesIDs) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
            },
          }
        );
        const {
          id,
          title,
          poster_path,
          backdrop_path,
          vote_average,
          genres,
          runtime,
          tagline,
          overview,
          release_date,
        } = response.data;
        if (overview) {
          const newMovie = await Movie.create({
            id,
            title,
            tagline,
            description: overview,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
            rating: vote_average,
            runtime,
            genres,
            date: release_date,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  setTimeout(addMoviesToDB, FETCHINGDELAY, pageIteration + iterationCount);
}

module.exports = router;
