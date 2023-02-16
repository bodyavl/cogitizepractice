const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const Movie = require("./db/models/movie");

const app = express();

app.use(bodyParser.json({ type: "application/json" }));

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured: ", error.message);
  res.status(500).send(error.message);
}

app.post("/movies/create", async (req, res, next) => {
    try {
        const { title, description, image, slogan, author, genres, date, runTime, rating } = req.body;
        const newMovie = new Movie({ title, description, image, slogan, author, genres, date, runTime, rating });
        await newMovie.save();
        res.status(200).send("Movie added");
    } catch (error) {
        next(error);
    }
});

app.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movie.find();
        if(movies) res.json(movies);
        else throw new Error("No movies found")
    } catch (error) {
        next(error);
    }
    
})

app.get('/movies/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id)
        if(movie) res.json(movie);
        else throw new Error("Movie was not found");
    } catch (error) {
        next(error);
    }
})
app.use(errorHandler);

app.listen(3000, () => {
  console.log("On port 3000");
});
