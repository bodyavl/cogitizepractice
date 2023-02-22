const express = require("express");
const router = express.Router();

const axios = require("axios").default;

const Movie = require("../database/schemes/movie");

// router.get("/axios/:id", async (req, res, next) => {
//   try {
//     const movieId = Number(req.params.id);
//     const movie = await axios.get(
//       `https://api.themoviedb.org/3/movie/${movieId}`,
//       {
//         params: {
//           api_key: process.env.TMDB_API_KEY,
//         },
//       }
//     );
//     res.json(movie);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/list", async (req, res, next) => {
  try {
    const moviesList = await Movie.find({});
    //console.log(moviesList);
    res.json(moviesList);
  } catch (error) {
    next(error);
  }
});

// Delete all notes in the linked DB
router.get("/cleanDB", async (req, res, next) => {
  try {
    const moviesList = await Movie.find({});
    for (let movie of moviesList) {
      await Movie.findByIdAndDelete(movie.id);
    }
    res.sendStatus(200);
    console.log("DataBase has been cleaned. It's empty!");
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
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
  } catch (error) {
    next(error);
  }
});

// Fill the DB with movies
const FETCHINGDELAY = 5000;
const iterationCount = 50;
async function addMoviesToDB(pageIteration = 1) {
  if (pageIteration > 10000) return;
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
