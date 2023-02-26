const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  type: {
    type: String,
    enum: ["Movie", "TV show"],
    required: true,
  },
  tagline: String,
  poster: String,
  backdrop: String,
  genres: [genreSchema],
  date: Date,
  rating: Number,
  runtime: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
