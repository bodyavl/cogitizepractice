const express = require('express');
const bodyParser = require('body-parser');
const database = require ("./database");
const Movie = require("./database/schemes/movie");
const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
const port = 3000;
 
function errorTamer (res,req,error){
res.header("Content-Rype", "application/json");
console.log("Error:", error.message);
res.status(500).send(error.message);
}
app.get('/movie', async (req, res, next) => {
   const movie = await Movie.find();
   res.json(movie);
});
app.get("/getMovieById/:_id", async(req,res,next) => {
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
app.post('/createMovie', async (req, res, next) => {
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
  app.use(errorTamer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
