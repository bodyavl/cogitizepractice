const express = require('express')
const bodyParser = require('body-parser')
const database = require("./database/index");
const Movie = require("./database/schemas/movie");

const app = express()
app.use(bodyParser.json({ type: 'application/json' }))

const port = 3000

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occered:", error.message);
  res.status(500).send(error.message);

}

app.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.get("/movie/:id", async (req, res, next) => {
  try {
    const movieId = req.params["id"];
    const movie = await Movie.findById(movieId);
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.delete("/movie/:id", async (req, res, next) => {
  try {
    const movieId = req.params["id"];
    const movie = await Movie.findByIdAndDelete(movieId);
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.post("/createMovie", async (req, res, next) => {
  try {
    const { title, author, description, genre, rating } = req.body;
    const movie = await Movie.create({
      title,
      author,
      description,
      genre,
      rating
    });
    console.log("Movie created:", movie);

    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
