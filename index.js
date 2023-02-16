const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database = require("./database");
const Movie = require("./database/schemes/movie");
app.use(bodyParser.json({type: 'application/json'}));
const port = 700

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.post("/CreateMovie", async (req, res, next) => {
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

app.get("/allMovies", async (req, res, next) => {
  try {
    const allmovies = await Movie.find();
    if(allmovies == null){
      res.json(allmovies);
    }
    else{
      throw new Error("There are no movies");
    }
  } catch (error) {
    next(error);
  }
});

app.get("/movie/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const movieid = await Movie.findById(id);
    if(movieid == null){
      res.json(movieid);
    }
    else{
      throw new Error("There is no movie with this id");
    }
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});