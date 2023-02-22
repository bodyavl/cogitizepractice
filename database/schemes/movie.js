const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  id: {type:Number, required:true, unique:true},
  title:  String, 
  description: String,
  rating: Number,
  genre: String, 
  run_time: String,
  backdrop: String,
  logo: String,
  date: { type: Date, required: false },
});
const Movie = mongoose.model('Movie', blogSchema);

module.exports = Movie;