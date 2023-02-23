
const express = require('express');
const router = express.Router();
const Movie = require("../database/schemes/movie");
const axios= require("axios").default;

router.get("/list", async (req, res, next) => {
  try {
    const { genre } = req.query;
    let a;
    if (!genre) {
      const movies = await Movie.find().select("_id title poster rating genres");
      const shuffledMovies = shuffle(movies);
      if (movies) res.status(200).json(shuffledMovies.slice(0, 8));
      else throw new Error("No movies found");
    } else {
      const movies = await Movie.find({
        genres: { $elemMatch: { name: genre } },
      }).select("_id title poster rating genres")
      const shuffledMovies = shuffle(movies);
      if (shuffledMovies) res.status(200).json(shuffledMovies.slice(0, 8));
      else throw new Error("No movies found");
    }
  } catch (error) {
    next(error);
  }
});
 router.get("/:_id", async(req,res,next) => {
   try{
     const {_id} = req.params;
     const movie = await Movie.findById(_id);
   
     if (!movie){
        throw new Error("Not Found");
     } else {
       res.json(movie);
     }
   } catch(error){
     next(error)
   }
   
 });
 router.post('/createMovie', async (req, res, next) => {
   try{
    console.log("Create movie request",req.body);
     const {id ,title, author, description, country, rating, genre,backdrop,logo} = req.body;
     const movie =  await Movie.create ({
       id,
       title,
       description,
       rating, 
       genre,
       run_time,
       backdrop,
       logo,
     });
     console.log("Movie created :", movie);
     res.json(movie);
   } catch (error) {
     next(error);
   }
   });
   const FETCHINGDELAY = 5000;
   const iterationCount = 50;
   async function addMoviesToDatabase(pageIteration = 1) {
     if (pageIteration > 1000) return;
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
           const {id,title,genres,run_time,overview,release_date,logo_path,backdrop_path,rating} = response.data;
           if (overview) {
             const newMovie = await Movie.create({
               id,
               title,
               type: "Movie",
               description: overview,
               logo: `https://image.tmdb.org/t/p/original${logo_path}`,
               backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
               rating,
               genres,
               run_time,
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
    let pageIterator = 1;
    addMoviesToDatabase(pageIterator++)
    setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIterator);
  }
   
  module.exports = { router, runBackgroundFetching };