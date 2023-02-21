const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    id: { type: Number, required: true, unique: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ id: Number, name: String }],
    tagline: String,
    poster: String,
    backdrop: String,
    rating: Number,
    runtime: Number,
    date: Date
  });

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;