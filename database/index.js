const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

function connect() {
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error occured:", error.message);
  }
}

connect();