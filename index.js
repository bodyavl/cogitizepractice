const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database");
const Movie = require("./database/schemes/movie");

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

const port = 3000;

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Hello World!");
});

app.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.get("/getMovieById",async (req,res,next)=>{
  try {
    const movies = await Movie.find(req.body);
    if(movies.length == 0){
      res.send("Movie not found");
    }
    else res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.post("/createMovie", async (req, res, next) => {
  try {
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

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});