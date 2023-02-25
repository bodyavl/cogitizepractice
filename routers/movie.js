const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios").default;
const router = express.Router();

const Movie = require("../database/schemes/movie");
const { shuffle } = require("../utils");

router.post("/create", async (req, res, next) => {
  try {
    const movieRequest = {
        id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      poster: req.body.poster,
      poster: req.body.poster,
      backdrop: req.body.backdrop,
      tagline: req.body.tagline,
      genre: req.body.genre,
      date: req.body.date,
      runtime: req.body.runtime,
      rating: req.body.rating,
    };

    const newMovie = await Movie.create(movieRequest);
    res.status(200).send(newMovie);
  } catch (error) {
    next(error);
  }
});
const genresList = {
  Any: null,
  Action: "Action",
  Horror: "Horror",
  Drama: "Drama",
  Comedy: "Comedy"
}
const types = {
  Movie: "Movie",
  TV: "TV show"
}
router.get("/list", async (req, res, next) => {
  try {
    const { genre, type } = req.query;

    const options = {};

    if (genre && genresList[genre])
      options.genres = { $elemMatch: { name: genresList[genre] } };

    if (type && types[type]) options.type = types[type];

    const movies = await Movie.find(options).select(
      "_id type title poster rating genres"
    );
    const shuffledMovies = shuffle(movies);
    if (!shuffledMovies) throw new Error("No movies found");
    res.status(200).json(shuffledMovies.slice(0, 8));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id).select("-__v -_id");

    if (movie) res.status(200).json(movie);
    else throw new Error("Movie was not found");
  } catch (error) {
    next(error);
  }
});

const FETCHINGDELAY = 5000;
const iterationCount = 50;
async function addMoviesToDatabase(pageIteration = 1) {
  if (pageIteration > 20000) return;
  for (let i = 1; i < pageIteration + iterationCount ; i++) {
    const movieRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: "28|27|18|35",
          page: i,
        },
      }
    );
    let movieIds = [];
    movieRes.data.results.forEach((element) => {
      movieIds.push(element.id);
    });
    for (let movieId of movieIds) {
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
          genre,
          runtime,
          tagline,
          overview,
          release_date,
        } = response.data;
        if (overview) {
          const newMovie = await Movie.create({
            id: `${id}m`,
            title,
            type: "Movie",
            tagline,
            description: overview,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
            rating: vote_average,
            runtime,
            genre,
            date: release_date,
          });
        }
      } catch (error) {
        if (error.code !== 11000) console.log(JSON.stringify(error));
      }
    }
  }
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIteration + iterationCount);
}
    function runBackgroundFetching() {
      setTimeout(addMoviesToDatabase, FETCHINGDELAY, 1);
    }
    module.exports = { router, runBackgroundFetching };