const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const { shuffle } = require("../shuffle");

const Movie = require("../database/schemes/movie");

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

  router.get("/getMovieFromTMDB/:id", async (req, res, next) => {
    try {
        const movieId = req.params.id;
        if(movieId > 62 && movieId < 958) {
            const axiosMovie = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, 
            {
                params: {
                  api_key:process.env.TMDB_API_KEY
                }
            })
            console.log(axiosMovie);
            res.json(axiosMovie.data);
        }
        else {
            throw new Error("Movie by id not found");
        }
    }
    catch(err) {
        next(err);
    }
});
  
  router.get(`/:id`, async (req,res,next)=>{
    try {
      const { id } = req.params;
      const movie = await Movie.find({"id":id});
      if(!movie){
        throw new Error("Movie not found");
      }
      else res.json(movie);
    } catch (error) {
      next(error);
    }
  });

  
  router.post("/create", async (req, res, next) => {
    try {
      console.log("Create movie request",req.body);
      const { id, poster, backdrop, tagline, data, runtime, rating, title, type, genres, description} = req.body;
      const movie = await Movie.create({
        id,
        poster,
        backdrop,
        tagline,
        data,
        runtime,
        rating,
        title,
        type,
        genres,
        description
      });
      console.log("Movie created:", movie);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  });

  axios.get(`https://api.themoviedb.org/3/movie/550`, {
    params: {
      api_key:process.env.TMDB_API_KEY,
    }
  }).then((response) => {
    console.log(response.data);
  })


  const FETCHINGDELAY = 5000;
  const iterationCount = 50;
  async function addMoviesToDatabase(pageIteration = 1) {
    if (pageIteration > 20000) return;
    for (let i = pageIteration; i < pageIteration + iterationCount ; i++) {
      const movieRes = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            with_genres: "28|27|18|35",
            page: i,
          },
        });
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
              id: `${id}`,
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
          }} catch (error) {
          console.log(error.message);
        }
      }};
    
    setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIteration + iterationCount);
  }
  
  function runBackgroundFetching() {
    setTimeout(addMoviesToDatabase, FETCHINGDELAY, 1);
  }

  module.exports ={ router, runBackgroundFetching};
  