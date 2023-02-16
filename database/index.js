const mongoose = require("mongoose");
function connect() {
    try {
      mongoose.connect("mongodb+srv://Sergo:Usukubo_428@cluster0.dztj6qa.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB")
    } catch (error) {
      console.log("Error occured:", error.message);
    }
}
connect();