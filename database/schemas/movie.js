const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    description: String,
    genre: String,
    rating: Number,
    date: { type: Date, required: false },
});

const Movie = mongoose.model('Movie', schema);

module.exports = Movie;