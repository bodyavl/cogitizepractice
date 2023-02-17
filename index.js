const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const movieRouter = require("./routers/movie");

const app = express();

app.use(bodyParser.json({ type: "application/json" }));

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured: ", error.message);
  res.status(500).send(error.message);
}


app.use("/movie", movieRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("On port 3000");
});
