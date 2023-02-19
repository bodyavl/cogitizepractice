const express = require('express');
const router = express.Router();
const Movie = require("../database/schemes/movie");


router.get('/list', async (req, res, next) => {
    const movie = await Movie.find();
    res.json(movie);
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
     const {title, author, description, country, rating, genre} = req.body;
     const movie =  await Movie.create ({
       title,
       author,
       description,
       country,
       rating, 
       genre
     });
     console.log("Movie created :", movie);
     res.json(movie);
   } catch (error) {
     next(error);
   }
   });

   module.exports = router