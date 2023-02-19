const dotenv=require("dotenv");
dotenv.config();
const express = require('express');
const bodyParser = require('body-parser');
const database = require ("./database");
const movieRouter = require("./routers/movie");

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
const port = 3000;
 
function errorTamer (res,req,error){
res.header("Content-Type", "application/json");
console.log("Error:", error.message);
res.status(500).send(error.message);
}

app.use("/movie", movieRouter);
  app.use(errorTamer);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
