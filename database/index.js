const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://GlamAdmin:bWIg6sKNIW8Gixuh@berocog.mivw6xb.mongodb.net/?retryWrites=true&w=majority");
        console.log("Successfully connected to MongoDB!");
    }
    catch(err) {
        console.log("Error: ", err.message);
    }
}

connect();