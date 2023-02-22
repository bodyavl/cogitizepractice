const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const express = require("express");
const app = express();

const bodyparser = require("body-parser");

const database = require("./database");

const movieRouter = require("./routes/movie");

const errorHandler = (error, req, res, next) => {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
};

app.use(cors({ credentials: true, origin: true }));
app.use(bodyparser.json());
app.use("/movie", movieRouter);
app.use(errorHandler);


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on ${port} port`);
});
