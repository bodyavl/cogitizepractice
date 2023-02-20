const express = require('express');
const router = express.Router();
const Movie = require("../database/schemes/movie");
const axios= require("axios").default;

router.get('/list', async (req, res, next) => {
    const movie = await Movie.find();
    res.json(movie);
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
     const {title, author, description, country, rating, genre,backdrop,logo} = req.body;
     const movie =  await Movie.create ({
       title,
       author,
       description,
       country,
       rating, 
       genre,
       backdrop,
       logo,
     });
     console.log("Movie created :", movie);
     res.json(movie);
   } catch (error) {
     next(error);
   }
   });

   axios.get(`https://api.themoviedb.org/3/movie/550?`, {
    params: {
      api_key:process.env.TMBD_API_KEY
    }
  }).then((response) => {
    console.log(response.data);
  })

   module.exports = router