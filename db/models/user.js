const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  movies: Number,
  tv: Number,
  suggestions: Number,
  man_suggestions: Number
});

const User = mongoose.model("User", userSchema);

module.exports = User;
