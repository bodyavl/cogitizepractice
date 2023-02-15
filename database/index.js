//
const mongoose = require("mongoose");

function connect() {
  try {
    mongoose.connect("mongodb+srv://cogitize:F29TYBIQAy6R7mGS@cogitizepractice.pztccwl.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error occured:", error.message);
  }
}

connect();