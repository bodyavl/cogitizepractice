const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.json());

const database = require("./database");

const movieRouter = require("./routes/movie");

const port = 3000;

const errorHandler = (error, req, res, next) => {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
};

app.use("/movie", movieRouter);

//Delete route add TODO

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});
