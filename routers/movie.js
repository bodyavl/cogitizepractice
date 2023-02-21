const express = require('express')
const router = express.Router()
const axios = require('axios')

const Movie = require("../database/schemes/movie");
const { shuffle } = require("../utils");

router.get("/list", async (req, res, next) => {
  try {
    const { genre } = req.query;
    if (!genre) {
      const movies = await Movie.find().select(
        "_id title poster rating genres"
      );

      const shuffledMovies = shuffle(movies);

      if (shuffledMovies) res.status(200).json(shuffledMovies.slice(0, 8));
      else throw new Error("There are no movies");
    } else {
      const movies = await Movie.find({
        genres: { $elemMatch: { name: genre } },
      }).select("_id title poster rating genres");

      const shuffledMovies = shuffle(movies);
      if (shuffledMovies) res.status(200).json(shuffledMovies.slice(0, 8));
      else throw new Error("There are no movies");
    }
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
    try {
      const { title, author, rating, runtime} = req.body;
      const movie = await Movie.create({
        title,
        author,
        rating,
        runtime
      });
      console.log("Created movie:", movie);
      res.json(movie);
    } catch (error) {
      next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params
      const movieid = await Movie.findById(id);
      if(!movieid)
        throw new Error("There is no movie with this id");
        res.json(movieid);
    } catch (error) {
      next(error);
    }
});

router.get("/TMDB/:id", async (req, res, next) => {
    try {
        const TMDBmovieID = req.params.id;
        if(TMDBmovieID == "day") {
              const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/${TMDBmovieID}`, 
              {
                  params: {
                    api_key:process.env.TMDB_API_KEY
                  }
              });
              res.json(response.data);
        }
        else if (TMDBmovieID == "week"){
              const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/${TMDBmovieID}`, 
              {
                  params: {
                    api_key:process.env.TMDB_API_KEY
                  }
              });
              res.json(response.data);
        }
        else {
            throw new Error("Write 'day' or 'week'!");
        }
    }
    catch(error) {
        next(error);
    }
});

const FETCHINGDELAY = 5000;
const iterationCount = 50;
async function addMoviesToDatabase(pageIteration = 1) {
  if (pageIteration > 20000) return;
  for (let i = pageIteration; i < pageIteration + iterationCount; i++) {
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
        const { id, title, vote_average, genres, runtime, poster_path, backdrop_path, tagline, overview, release_date,
        } = response.data;
        if (overview) {
          const newMovie = await Movie.create({
            id,
            title,
            rating: vote_average,
            genres,
            runtime,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
            tagline,
            description: overview,
            date: release_date,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIteration + iterationCount);
}

function runBackgroundFetching() {
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, 1);
}

module.exports = { router, runBackgroundFetching };