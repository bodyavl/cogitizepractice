const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    id: { type: Number, required: true, unique: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: { type: String, required: true },
    tagline: String,
    poster: String,
    backdrop: String,
    rating: Number,
    runtime: Number,
    date: Date
  });

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;