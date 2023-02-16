const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    author: String,
    rating: Number,
    runtime: Number,
    genre: String, 
    date: { type: Date, required: false },
});

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;