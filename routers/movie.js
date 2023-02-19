const { response } = require('express');
const express = require('express');
const router = express.Router();
const axios = require('axios').default;

const Movie = require("../database/schemes/movie");
  
  router.get("/list", async (req, res, next) => {
    try {
      const movies = await Movie.find().select("_id title type");
      res.json(movies);
    } catch (error) {
      next(error);
    }
  });

  router.get("/getMovieFromTMDB/:id", (req, res, next) => {
    try {
        const movieId = req.params.id;
        if(movieId > 62 && movieId < 958) {
            axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, 
            {
                params: {
                  api_key:process.env.TMBD_API_KEY
                }
            })
            .then((response) => 
            {
                res.json(response.data);
            })
        }
        else {
            throw new Error("Movie by id not found");
        }
    }
    catch(err) {
        next(err);
    }
});
  
  router.get("/:_id",async (req,res,next)=>{
    try {
      const { _id } = req.params
      const movie = await Movie.findById(_id);
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
      const { title, type, time, genres, author, description} = req.body;
      const movie = await Movie.create({
        title,
        type,
        time,
        genres,
        author,
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
      api_key:process.env.TMBD_API_KEY,
    }
  }).then((response) => {
    console.log(response.data);
  })

  module.exports = router