const mongoose = require("mongoose");

const { Schema } = mongoose;

const statsSchema = new Schema({
  userId: { type: String, requred: true, unique: true },
  movies: Number,
  tv: Number,
  suggestions: Number,
  man_suggestions: Number,
});

const Stats = mongoose.model("Stats", statsSchema);

module.exports = Stats;
