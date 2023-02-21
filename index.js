const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const movieRouter = require("./routers/movie");
const database = require("./database");
const axios = require("axios").default;


const port = 3000;

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.get("/", (req, res) => {
  console.log(req.query);
  res.send("Hello World!");
});

  app.use("/movie", movieRouter);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });