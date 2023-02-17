const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database");
const Movie = require("./database/schemes/movie");

const port = 3000;

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Hello World!");
});


  // Create a GET route for getting all movies
  app.get('/movies', async (req, res, next) => {
    try {
      const movies = await Movie.find();

      res.json(movies);
    } catch (error) {
      next(error);
    }
  });


  // Create a GET route for getting a specific movie by ID
app.get('/movies/:id', async (req, res, next) => {
    try {
      const movie = await Movie.findById(req.params.id);
  
      if (!movie) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.json(movie);
      }
    } catch (error) {
      next(error);
    }
  });


// Create a POST route for creating a new movie
app.post('/createMovie', async (req, res, next) => {
    try {
      const { title, author, description, releaseYear, genre } = req.body;
  
      const movie = await Movie.create ({
        title,
        author,
        description,
        releaseYear,
        genre
      });
      console.log("Movie created:", movie);
      
      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  });
  

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
