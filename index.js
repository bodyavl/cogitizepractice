const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const database = require("./database");
const movieRouter = require("./routers/movie");
app.use(bodyParser.json({type: 'application/json'}));
const port = 302

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.use("/movie", movieRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});