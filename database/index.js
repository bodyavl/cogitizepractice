const mongoose = require("mongoose");

function connect() {
  try {
    mongoose.connect("mongodb+srv://LibermanPractise:U5pBbaO28oG9LfJq@cluster0.rirnpnz.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error occured:", error.message);
  }
}

connect();
