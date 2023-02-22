const express = require('express');
const router = express.Router();
const Movie = require("../database/schemes/movie");
const axios= require("axios").default;

router.get('/list', async (req, res, next) => {
    const movie = await Movie.find();
    res.json(movie);
    try {
      const { genre } = req.query;
      
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
 router.get("/:id", async(req,res,next) => {
   try{
     const {id} = req.params;
     const movie = await Movie.findById(id);
   
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

   
  function runBackgroundFetching() {
    let pageIterator = 1;
    addMoviesToDatabase(pageIterator++)
    setTimeout(addMoviesToDatabase, FETCHINGDELAY, pageIterator);
  }
   
  module.exports = { router, runBackgroundFetching };