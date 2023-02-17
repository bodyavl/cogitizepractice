const mongoose = require("mongoose")
const { float } = require("webidl-conversions")

const Schema = mongoose.Schema

const schema = new Schema(
    {
        title: String,
        author: String,
        description: String,
        //genre: String,
        //time: String, //?type Date
        //rating: Number,
        //image: Image
    }
)

const Movie = mongoose.model("Movie", schema)

module.exports = Movie