const mongoose = require("mongoose");
const { float } = require("webidl-conversions");

const Schema = mongoose.Schema;

const genreSchema = new Schema(
  {
    name: String,
  },
  { _id: false }
);

const movieSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genres: [genreSchema],
  tagline: String,
  poster: String,
  backdrop: String,
  date: Date,
  rating: Number,
  runtime: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
