const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios").default;
const router = express.Router();
const jwt = require('jsonwebtoken');
const Movie = require("../db/models/movie");
const User = require("../db/models/user");
const Stats = require("../db/models/stats")
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
      genres: req.body.genres,
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
const manualList = {
  true: true,
  false: false
}
router.get("/list", checkLogIn, async (req, res, next) => {
  try {
    const { genre, type, manual } = req.query;
    const options = {};

    if (genre && genresList[genre])
      options.genres = { $elemMatch: { name: genresList[genre] } };

    if (type && types[type]) options.type = types[type];

    const movies = await Movie.find(options).select(
      "_id type title poster rating genres"
    );
    const shuffledMovies = shuffle(movies);
    const returnMovies = shuffledMovies.slice(0, 8)
    if (!shuffledMovies) throw new Error("No movies found");
    if(req.user)
    {
      const { userId } = req.user;
      const stats = await Stats.findOne({ userId });
      if(!stats) throw new Error("Wrong userId in session");
      let { movies, tv, suggestions, man_suggestions } = stats;
      for(let movie of returnMovies)
      {
        if(movie.type === "Movie") movies += 1;
        if(movie.type === "TV show") tv += 1;
      }
      if(manualList[manual]) man_suggestions += 1;
      else suggestions += 1;
      await Stats.findOneAndUpdate({ userId }, { suggestions, movies, tv, man_suggestions }, { new: true })
    }

    res.status(200).json(returnMovies);
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

function checkLogIn(req, res, next) {
  const authHeader = req.headers['authorization'];
  if(authHeader)
  {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err)
      {
        next();
      }
      else{
        req.user = user;
        next();
      }
  })
  }
  next();
}

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
          genres,
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
            genres,
            date: release_date,
          });
        }
      } catch (error) {
        if (error.code !== 11000) console.log(JSON.stringify(error));
      }
    }
    const tvRes = await axios.get("https://api.themoviedb.org/3/discover/tv", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: "28|27|18|35",
        page: i,
      },
    });
    let tvIds = [];
    tvRes.data.results.forEach((element) => {
      tvIds.push(element.id);
    });
    for (let tvId of tvIds) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${tvId}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
            },
          }
        );
        const {
          id,
          name,
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
          const newTV = await Movie.create({
            id: `${id}tv`,
            title: name,
            type: "TV show",
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