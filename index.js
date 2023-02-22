const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const database = require("./database");
const { router, runBackgroundFetching } = require('./routers/movie');
app.use(bodyParser.json({type: 'application/json'}));

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

process.on('uncaughtException', function (error) {
  console.log(error);
}); 

app.use("/movie", router);

app.use(errorHandler);

const port = process.env.PORT || 305;
app.listen(port, () => {
  console.log("On port", port);
  runBackgroundFetching();
});