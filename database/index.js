const mongoose = require("mongoose")

function connect() {
    try {
        mongoose.connect("mongodb+srv://v1adem:9XbR3Gih8UxngXY@v1ademcluster.e9mektp.mongodb.net/?retryWrites=true&w=majority")
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error occured:", error.message)
    }
}

connect();