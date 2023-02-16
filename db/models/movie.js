const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  slogan: String,
  image: String,
  author: String,
  genres: String,
  date: Date,
  rating: Number,
  runTime: Number
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
