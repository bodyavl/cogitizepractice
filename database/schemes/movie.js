const mongoose = require("mongoose");
const { float } = require("webidl-conversions");

const Schema = mongoose.Schema;

const schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: {type: String, required: true},
  type: {
    type: String,
    enum: ["Movie", "TV show"],
    required: true,
  },
  genres: [String],
  tagline: String,
  poster: String,
  backdrop: String,
  date: Date,
  rating: Number,
  runtime: Number
});

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;
