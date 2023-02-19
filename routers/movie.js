const express = require('express')
const router = express.Router()

const Movie = require("../database/schemes/movie");

router.param("id", function( req, res, next, id ) {
    req.id_from_param = id;
    next();
});

router.get("/all", async (req, res, next) => {
    try {
      const allmovies = await Movie.find();
      if(!allmovies){
        throw new Error("There are no movies");
      }
      else{
        res.json(allmovies);
      }
    } catch (error) {
      next(error);
    }
});

router.post("/add", async (req, res, next) => {
    try {
      const { title, author, rating, runtime, genre} = req.body;
      const movie = await Movie.create({
        title,
        author,
        rating,
        runtime,
        genre,
      });
      console.log("Created movie:", movie);
      res.json(movie);
    } catch (error) {
      next(error);
    }
});
  
router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params
      const movieid = await Movie.findById(id);
      if(!movieid){
        throw new Error("There is no movie with this id");
      }
      else{
        res.json(movieid);
      }
    } catch (error) {
      next(error);
    }
});

module.exports = router