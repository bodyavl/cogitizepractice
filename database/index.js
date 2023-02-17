const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

function connect() {
  try {
    mongoose.connect('mongodb+srv://Leeva:j3n3B0a8dqDJI4Pg@sliwka.dcwozxu.mongodb.net/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB")
  } catch (error) {
    console.log("Error occured:", error.message);
  }
}

connect();
