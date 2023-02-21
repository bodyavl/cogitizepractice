const dotenv = require("dotenv");
dotenv.config();


const express = require("express");


const { movieRouter, runBackgroundFetching } = require("./routers/movieRouter");




const errorHandler = (err, req, res, next) => {
    const msg = err.message;
    console.log("Error: ", msg);

    res.header("Content-Type", "application/json");
    res.status(500).send(msg);
}




const app = express();



app.use("/movie", movieRouter);



app.get("/fetching", (req, res) => {
    try {
        runBackgroundFetching();
        res.sendStatus(200);
    }
    catch(err) {
        next(err);
    }
});



app.use(errorHandler);




app.listen(
    process.env.PORT, 
    (err) => {
        console.log(process.env.NODE_ENV, "started!");
        if(err) console.log(err);
        else console.log(`Server started on port ${process.env.PORT}!`);
        // runBackgroundFetching();
    }
);
