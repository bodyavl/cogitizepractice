const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { movieRouter, runBackgroundFetching } = require("./routers/movieR");

const errorHandler = (err, req, res, next) => {
    const msg = err.message;
    console.log("Error: ", msg);
    res.header("Content-Type", "application/json");
    res.status(500).send(msg);
}

const app = express();
app.use(cors( {credentials: true, origin:true} ));
app.use("/movie", movieRouter);
app.use(errorHandler);

app.listen(
    process.env.PORT, 
    async (err) => {
        console.log(process.env.NODE_ENV, "started!");
        if(err) console.log(err);
        else console.log(`Server started on port ${process.env.PORT}!`);
    }
);