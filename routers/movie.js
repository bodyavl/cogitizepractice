const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const router = express.Router();
const axios = require("axios").default;

const Movie = require("../database/schemes/movie");
const { shuffle } = require("../adds");



router.get("/axios/:id", async (req, res, next) => {
  try {
      const movieId = Number(req.params.id);
      const axiosMovie = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, 
      {
          params: {
              api_key: process.env.TMDB_API_KEY
          }
      });
      res.json(axiosMovie.data);            
  }
  catch(err) {
      next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
      const movieId = req.params.id;
      const movie = await Movie.findOne( {id: movieId} ).select("-_id -__v");
      movie.genres = movie.genres.split("|").join(", ");
      
      if(movie) {
          res.json(movie);
      }
      else {
          throw new Error("Incorrect movie id!");
      }
      
  }
  catch(err) {
      next(err);
  }
});


// Create a POST route for creating a new movie
router.post('/createMovie', async (req, res, next) => {
  try {
    const { id, title, author, description, releaseYear, genre, runTime } = req.body;

    const movie = await Movie.create ({
      id,
      title,
      author,
      description,
      releaseYear,
      genre,
      runTime
    });
    console.log("Movie created:", movie);
    await movie.save();
    res.json(movie);
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

router.get("/list", async (req, res, next) => {
  try {
    const { genre } = req.query;

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

  // Create a GET route for getting a specific movie by ID
// router.get(`/:_id`, async (req,res,next)=>{
//     try {
//     const { _id } = req.params
//     const movie = await Movie.findById(_id);	 
//     if(movie == null){
//       throw new Error("Movie not found");	      
//     }
//       else res.json(movie);
//     } catch (error) {
//       next(error);
//     }
//   });

  
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

runBackgroundFetching();

function runBackgroundFetching() {
  let pageIterator = 1;
  addMoviesToDatabase(pageIterator++);
  setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIterator);
}

module.exports = {
  runBackgroundFetching,
  router
}