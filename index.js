const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { movieRouter, runBackgroundFetching } = require("./routers/movieRou");

const errorHandler = (err, req, res, next) => {
    const msg = err.message;
    console.log("Error: ", msg);
    res.header("Content-Type", "application/json");
    res.status(500).send(msg);
}

const app = express();

app.use(cors( {credentials: true, origin:true} ));
app.use("/movie", movieRouter);
app.use(express.static(__dirname +"/build/static"));

app.get("/", (req, res) => {
    try {
        const index = fs.readFileSync("./build/index.html");
        res.status(200).send(index.toString());
    }
    catch(err) {
        next(err);
    }
});

app.use(errorHandler);

app.listen(
    process.env.PORT, 
    async (err) => {
        console.log(process.env.NODE_ENV, "started!");
        if(err) console.log(err);
        else console.log(`Server started on port ${process.env.PORT}!`);
    }
);