const express = require("express");
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const database = require("./database");
const Movie = require("./database/schemes/movie");



const errorHandler = (err, req, res, next) => {
    const msg = err.message;
    console.log("Error: ", msg);

    res.header("Content-Type", "application/json");
    res.status(500).send(msg);
}



const app = express();



app.use(bodyParser.json());



app.get("/getMovie/:id", async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        
        if(movie != null) {
            res.json(movie);
        }
        else {
            throw new Error("Incorrect movie id!");
        }
        
    }
    catch(err) {
        next(err);
    }

});

app.get("/getMovies", async (req, res, next) => {
    try {
        const moviesList = await Movie.find({});
        res.json(moviesList);
    }
    catch(err) {
        next(err);
    }
});



app.post("/addMovie", async (req, res, next) => {
    const data = req.body;
    try {
        const newMovie = await Movie.create(
            {
                title: data.title,
                author: data.author,
                description: data.description
            }
        );
        console.log(`Movie ${data.title} created: `, newMovie);

        res.json(newMovie);
    }
    catch(err) {
        next(err);
    }
});



app.use(errorHandler);



app.listen(
    process.env.PORT, 
    (err) => {
        console.log(process.env.NODE_ENV);
        if(err) console.log(err);
        else console.log(`Server started on port ${process.env.PORT}!`);
    }
);
