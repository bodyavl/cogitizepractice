const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const Movie = require("./db/models/movie");
const movieRouter = require("./routers/movie.js")

const app = express();

app.use(bodyParser.json({ type: "application/json" }));
app.use('/movie', movieRouter);

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured: ", error.message);
  res.status(500).send(error.message);
}


app.use(errorHandler);

app.listen(3000, () => {
  // console.log("On port 3000");
});


function testDelay(arg){
  console.log("arg: ", arg++);
  if(arg + 1 > 5) return;
  setTimeout(testDelay, 1000, arg)
}

setTimeout(testDelay, 1000, 0);

let intervalIterations = 0;
function testDelay(){
  console.log("argSetInterval: ", intervalIterations++);
  if(intervalIterations + 1 > 5) clearInterval(setIntervalID);

}
let setIntervalID = setInterval(testDelay, 1000);