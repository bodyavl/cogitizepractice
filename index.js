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
app.get("/", (req, res) => {
  console.log(req.query);
  res.send('Hello World!')
})

app.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

app.post("/createMovie", async (req, res, next) => {
  try {
    const { title, author, description } = req.body;
    const movie = await Movie.create({
      title,
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
  console.log(`Example app listening on port ${port}`)
})
