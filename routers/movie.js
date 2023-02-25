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
      const movieGenres = req.query["genres"];
      const findQuery = {
          ...(movieGenres !== undefined && { "genre.id": Number(movieGenres) })
      };
      const filmscounts = await Movie.count();
      const { count = 10 } = req.query;
      const skip = getRandomArbitrary(0, filmscounts - count);
      const movies = await Movie.find(findQuery, { skip: skip, limit: count }).select("id title genre poster rating author");
      const shuffledMovies = shuffle(movies);
      res.json(shuffledMovies);
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


   const FETCHINGDELAY = 5000;
   const iterationCount = 50;
   async function addMoviesToDatabase(pageIteration = 1) {
     if (pageIteration > 10000) return;
     for (let i = pageIteration; i < pageIteration + iterationCount ; i++) {
       const movieRes = await axios.get(
         "https://api.themoviedb.org/3/discover/movie",
         {
           params: {
             api_key: process.env.TMDB_API_KEY,
             with_genres: "28|27|18|35",
             page: pageIteration,
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
           const {id,title,genres,run_time,overview,release_date,logo_path,poster_path,vote_average,} = response.data;
           if (overview) {
             const newMovie = await Movie.create({
               id,
               title,
               type: "Movie",
               description: overview,
               logo: `https://image.tmdb.org/t/p/original${logo_path}`,
              poster: `https://image.tmdb.org/t/p/original${poster_path}`,
               rating: vote_average,
               genres,
               run_time,
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
    let pageIterator = 1;
    addMoviesToDatabase(pageIterator++)
    setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIterator);
  }
   
  module.exports = { router, runBackgroundFetching };