const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios").default;
dotenv.config();
const router = express.Router();

const Movie = require("../db/models/movie");

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

// router.get('/addtodb', async (req, res, next) => {
//     try {
//         await Movie.collection.drop();
//         await addMoviesToDatabase();
//         res.status(200).send('OK');
//     } catch (error) {
//         next(error);
//     }
    
// })
router.post("/create", async (req, res, next) => {
    try {
        const {
            title,
            description,
            type,
            poster,
            backdrop,
            tagline,
            genres,
            date,
            runtime,
            rating,
        } = req.body;
        const newMovie = await Movie.create({
            title,
            description,
            type,
            poster,
            backdrop,
            tagline,
            genres,
            date,
            runtime,
            rating,
        });
        res.status(200).send(newMovie);
    } catch (error) {
        next(error);
    }
});

router.get("/list", async (req, res, next) => {
    try {
        const { genre } = req.query;
        if(!genre) {
            const movies = await Movie.find().select("_id title poster rating genres");
            shuffle(movies);
            if (movies) res.status(200).json(movies.slice(0, 8));
            else throw new Error("No movies found");
        }
        else {
            const movies = await Movie.find({
                genres: { $elemMatch: { name: genre } },
                }).select("_id title poster rating genres");
            shuffle(movies);
            if (movies) res.status(200).json(movies.slice(0, 8));
            else throw new Error("No movies found");
        }
       
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id).select("-__v -_id");
        if (movie) res.status(200).json(movie);
        else throw new Error("Movie was not found");
    } catch (error) {
        next(error);
    }
});

async function addMoviesToDatabase() {
    for(let i = 1; i < 50; i++) {
        const movieRes = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                with_genres: '28|27|18|35',
                page: i
            }
        })
        let movieIds = [];
        movieRes.data.results.forEach(element => {
            movieIds.push(element.id);
        });
        for(let movieId of movieIds)
        {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    params: {
                        api_key: process.env.TMDB_API_KEY
                }
                })
                const { title, poster_path, backdrop_path, vote_average, genres, runtime, tagline, overview, release_date } = response.data;
                if(overview) {
                    const newMovie = await Movie.create({
                        title,
                        type: 'Movie',
                        tagline,
                        description: overview,
                        poster: `https://image.tmdb.org/t/p/original${poster_path}`,
                        backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
                        rating: vote_average,
                        runtime,
                        genres,
                        date: release_date
                })}
            } catch (error) {
                console.log(error.message);
                break;
            }
            
        }
        const tvRes = await axios.get('https://api.themoviedb.org/3/discover/tv', {
            params: {
                api_key: process.env.TMDB_API_KEY,
                with_genres: '28|27|18|35',
                page: i
            }
        })
        let tvIds = [];
        tvRes.data.results.forEach(element => {
            tvIds.push(element.id);
        });
        for(let tvId of tvIds)
        {
            try {
                const response = await axios.get(`https://api.themoviedb.org/3/tv/${tvId}`, {
                    params: {
                        api_key: process.env.TMDB_API_KEY
                    }
                })
                const { name, poster_path, backdrop_path, vote_average, genres, runtime, tagline, overview, release_date} = response.data;
                if(overview) {
                    const newTV = await Movie.create({
                        title: name,
                        type: 'TV show',
                        tagline,
                        description: overview,
                        poster: `https://image.tmdb.org/t/p/original${poster_path}`,
                        backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`,
                        rating: vote_average,
                        runtime,
                        genres,
                        date: release_date
                    })
                } 
            } catch (error){
                console.log(error.message);
                break;
            }
        }
    }
}
module.exports = router;
