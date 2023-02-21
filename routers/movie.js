const express = require('express');
const router = express.Router();
const axios = require("axios").default;

const Movie = require("../database/models/movie");

  // Create a GET route for getting all movies
  router.get('/list', async (req, res, next) => {
    try {
      const movies = await Movie.find();

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

// Create a POST route for creating a new movie
router.post('/createMovie', async (req, res, next) => {
    try {
      const { title, author, description, releaseYear, genre } = req.body;
  
      const movie = await Movie.create ({
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

  module.exports = router;