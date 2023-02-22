const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    id: { type: Number, unique: true },
    title: String, // String is shorthand for {type: String}
    description: String,
    genre: {type: Array},
    rating: Number,
    img: String,
    date: { type: Date, required: false },
});

const Movie = mongoose.model('Movie', schema);

module.exports = Movie;