const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const axios = require("axios").default;

const Movie = require("../database/schemes/movie");
const { shuffle } = require("../adds");


// Create a POST route for creating a new movie
router.post('/createMovie', async (req, res, next) => {
  try {
    const { id, title, author, description, releaseYear, genre } = req.body;

    const movie = await Movie.create ({
      id,
      title,
      author,
      description,
      releaseYear,
      genre
    });
    console.log("Movie created:", movie);
    await movie.save();
    res.json(movie);
  } catch (error) {
    next(error);
  }
});


  // Create a GET route for getting all movies
  router.get('/list', async (req, res, next) => {
    try {
      const movies = await Movie.find().select(" id title genre");

      res.json(movies);
    } catch (error) {
      next(error);
    }
  });


  // Create a GET route for getting a specific movie by ID
router.get('/:id', async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);
  
      if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.json(movie);
      }
    } catch (error) {
      next(error);
    }
  });

  axios.get(`https://api.themoviedb.org/3/movie/550`, {
    params: {
      api_key:process.env.TMDB_API_KEY
    }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });


  //


  
const FETCHINGDELAY = 5000;

async function addMoviesToDatabase(pageIteration = 1) {
  for (let i = 1; i < 50; i++) {
    const movieRes = await axios.get(
      "https://api.themoviedb.org/3/discover/movie",
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: "28|27|18|35",
          page: i * pageIteration,
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
          overview,
          genres,
          poster_path,
          backdrop_path,
        } = response.data;
        if (overview) {
          await new Promise((resolve) => setTimeout(resolve, FETCHINGDELAY));
          const newMovie = await Movie.create({
            id,
            title,
            description: overview,
            genres,
            poster: `https://image.tmdb.org/t/p/original${poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  if (pageIteration > 200) return;
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, ++pageIteration);
}

setInterval(addMoviesToDatabase, FETCHINGDELAY);

function runBackgroundFetching() {
  let pageIterator = 1;
  addMoviesToDatabase(pageIterator++);
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIterator);
}

module.exports = router;
module.exports = runBackgroundFetching;
