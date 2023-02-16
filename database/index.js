const mongoose = require("mongoose");



const connect = async () => {
    try {
        await mongoose.connect("mongodb+srv://vadymMalikov:Cb8FU7zcfO2nLAfq@cogitizevadymstestclust.ed54e10.mongodb.net/?retryWrites=true&w=majority");
        console.log("Successfully connected to MongoDB!");
    }
    catch(err) {
        console.log("Error: ", err.message);
    }
}



connect();
