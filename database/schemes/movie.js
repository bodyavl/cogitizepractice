

const mongoose = require("mongoose");
const { Schema } = mongoose;



const movieSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["Movie"],
    required: true,
  },
  tagline: String,
  poster: String,
  backdrop: String,
  genre: {type: Array},
  date: Date,
  rating: Number,
  runtime: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;