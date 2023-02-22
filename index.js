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

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT} port`);
});
