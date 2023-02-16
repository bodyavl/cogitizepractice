const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    title: String,
    type: String,
    time: Number,
    genres: String, 
    author: String,
    description: String,
    date: { type: Date, required: false },
});

const Movie = mongoose.model("Movie", schema);

module.exports = Movie;