const mongoose = require("mongoose");
const { Schema } = mongoose;

const genreSchema = new Schema(
    {
      name: String,
    },
    { _id: false }
  );

const schema = new Schema({
    id: { type: String, required: true, unique: true },
    title: String, 
    author: String,
    description: String,
    releaseYear: String,
    genre: [genreSchema],
});



const Movie = mongoose.model("Movie", schema);

module.exports = Movie;