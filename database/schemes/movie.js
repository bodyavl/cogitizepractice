const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema({
  id: {type:Number, required:true, unique:true},
  title:  String, 
  type: {type: String,enum: ["Movie"],required: true,},
  description: String,
  rating: Number,
  genre: { type: Array },
  run_time: Number,
  backdrop: String,
  logo: String,
  date: { type: Date, required: false },
});
const Movie = mongoose.model('Movie', blogSchema);

module.exports = Movie;