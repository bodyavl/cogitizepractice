const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const database = require("./database");
const Movie = require("./database/schemes/movie");
app.use(bodyParser.json({type: 'application/json'}));
const port = 3000

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.post("/movies/add", async (req, res, next) => {
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

app.get("/movies/all", async (req, res, next) => {
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

app.get("/movie/:id", async (req, res, next) => {
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

app.use(errorHandler);

app.listen(port, () => {
  console.log(process.env.NODE_ENV, "started")
  console.log(`Example app listening on port ${port}`)
});