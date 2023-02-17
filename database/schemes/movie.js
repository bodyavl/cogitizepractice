const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  title:  String, 
  author: String,
  description: String,
  country: String,
  rating: Number,
  genre: String, 
  date: { type: Date, required: false },
});
const Movie = mongoose.model('Movie', blogSchema);

module.exports = Movie;