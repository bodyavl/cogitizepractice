const mongoose = require("mongoose");

function connect() {
  try {
    mongoose.connect(process.env.dataBasaURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error occured:", error.message);
  }
}

connect();
