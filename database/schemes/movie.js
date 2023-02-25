const mongoose = require("mongoose");
const { Schema } = mongoose;

const genreSchema = new Schema(
  {
    name: String,
  },
  { _id: false }
);

const blogSchema = new Schema({
  id: {type:Number, required:true, unique:true},
  title:  String, 
  type: {type: String,enum: ["Movie"],required: true,},
  description: String,
  poster: String,
  rating: Number,
  genres: [genreSchema],
  run_time: Number,
  rating: Number,
  logo: String,
  date: { type: Date, required: false },
});
const Movie = mongoose.model('Movie', blogSchema);

module.exports = Movie;