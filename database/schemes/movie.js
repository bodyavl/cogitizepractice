const mongoose = require("mongoose");



const Schema = mongoose.Schema;

const schema = new Schema(
    {
        title: String,
        author: String,
        description: String
    }
);



const Movie = mongoose.model("Movie", schema);



module.exports = Movie;
