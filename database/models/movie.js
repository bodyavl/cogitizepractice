const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    title: String, 
    author: String,
    description: String,
    releaseYear: String,
    genre: String,
});

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;