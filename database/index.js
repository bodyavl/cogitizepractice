const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
console.log("DBURL",process.env.DATABASE_URL)

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Successfully connected to MongoDB!");
    }
    catch(err) {
        console.log("Error: ", err.message);
    }
}

connect();