const express = require("express");
// const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const database = require("./database");
const Movie = require("./database/schemes/movie");

const movieRouter = require("./routers/movieRouter");




const errorHandler = (err, req, res, next) => {
    const msg = err.message;
    console.log("Error: ", msg);

    res.header("Content-Type", "application/json");
    res.status(500).send(msg);
}




const app = express();



app.use("/movie", movieRouter);



app.use(errorHandler);



app.listen(
    process.env.PORT, 
    (err) => {
        console.log(process.env.NODE_ENV, "started!");
        if(err) console.log(err);
        else console.log(`Server started on port ${process.env.PORT}!`);
    }
);
