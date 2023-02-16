//
const mongoose = require("mongoose");

function connect() {
    try {
        mongoose.connect("mongodb+srv://cogitize:5918@cogitizepracticeruban.otf7oo5.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error occured", error.message);
    }
}

connect();