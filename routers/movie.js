const express = require('express');
const router = express.Router();
const Movie = require("../database/schemes/movie");
const axios= require("axios").default;

router.get('/list', async (req, res, next) => {
    const movie = await Movie.find();
    res.json(movie);
    try {
      const { genre } = req.query;
      
      if (!genre) {
        const movies = await Movie.find().select("_id title poster rating genres");
        const shuffledMovies = shuffle(movies);
        if (movies) res.status(200).json(shuffledMovies.slice(0, 8));
        else throw new Error("No movies found");
      } else {
        const movies = await Movie.find({
          genres: { $elemMatch: { name: genre } },
        }).select("_id title poster rating genres")
        const shuffledMovies = shuffle(movies);
        if (shuffledMovies) res.status(200).json(shuffledMovies.slice(0, 8));
        else throw new Error("No movies found");
      }
    } catch (error) {
      next(error);
    }
 });
 router.get("/:id", async(req,res,next) => {
   try{
     const {id} = req.params;
     const movie = await Movie.findById(id);
   
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
    console.log("Create movie request",req.body);
     const {id ,title, author, description, country, rating, genre,backdrop,logo} = req.body;
     const movie =  await Movie.create ({
       id,
       title,
       author,
       description,
       country,
       rating, 
       genre,
       backdrop,
       logo,
     });
     console.log("Movie created :", movie);
     res.json(movie);
   } catch (error) {
     next(error);
   }
   });

   const FETCHINGDELAY = 5000;

   async function addMoviesToDataBase(pageIteration = 1) {
     for (let i = 1; i < 50; i++) {
       const movieRes = await axios.get(
         "https://api.themoviedb.org/3/discover/movie",
         {
           params: {
             api_key: process.env.TMDB_API_KEY,
             with_genres: "28|27|18|35",
             page: i * pageIteration,
           },
         }
       );
       let movieIds = [];
       movieRes.data.results.forEach((element) => {
         movieIds.push(element.id);
       });
       for (let movieId of movieIds) {
         try {
           const response = await axios.get(
             `https://api.themoviedb.org/3/movie/${movieId}`,
             {
               params: {
                 api_key: process.env.TMDB_API_KEY,
               },
             }
           );
           const {id,title,overview,genres,logo_path,backdrop_path,} = response.data;
           if (overview) {
             await new Promise((resolve) => setTimeout(resolve, FETCHINGDELAY));
             const newMovie = await Movie.create({
               id,
               title,
               description: overview,
               genres,
               logo: `https://image.tmdb.org/t/p/original${logo_path}`,
               backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
             });
           }
         } catch (error) {
           console.log(error.message);
         }
       }
     }
     if (pageIteration > 200) return;
     setTimeout(addMoviesToDataBase, FETCHINGDELAY, ++pageIteration);
   }
   
   setInterval(addMoviesToDataBase, FETCHINGDELAY);
   
   function runBackgroundFetching() {
     let pageIterator = 1;
     addMoviesToDataBase(pageIterator++);
     setTimeout(addMoviesToDataBase, FETCHINGDELAY, pageIterator);
   }
   setInterval(addMoviesToDataBase, FETCHINGDELAY);

   function runBackgroundFetching() {
     let pageIterator = 1;
     addMoviesToDataBase(pageIterator++);
     setTimeout(addMoviesToDataBase, FETCHINGDELAY, pageIterator);
   }

   axios.get(`https://api.themoviedb.org/3/movie/550?`, {
    params: {
      api_key:process.env.TMDB_API_KEY
    }
  }).then((response) => {
    console.log(response.data);
  })

   module.exports = router;
   module.exports = runBackgroundFetching;