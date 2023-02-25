const dotenv=require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser');
const database = require ("./database");
const { router, runBackgroundFetching } = require("./routers/movie");


const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
app.use("/movie", router);
 
function errorTamer (res,req,error){
res.header("Content-Type", "application/json");
console.log("Error:", error.message);
res.status(500).send(error.message);
}

app.use(cors( {credentials: true, origin:true} ));
  app.use(errorTamer);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  runBackgroundFetching();
});