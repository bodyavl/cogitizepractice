const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database");
const movieRouter = require("./routers/movie");
const runBackgroundFetching = require("./routers/movie");

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

const port = 3000;

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.use("/movie", movieRouter)

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
  // runBackgroundFetching();
});