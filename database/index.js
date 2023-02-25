
//mongodb+srv://Skyba:<password>@cogitizepractice.9lnnjje.mongodb.net/?retryWrites=true&w=majority
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
mongoose.set('strictQuery', true);
function connect() {
    try {
        mongoose.connect (process.env.DATABASE_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecting to MongoDB");
    } catch (error) {
        console.log("Error occured:", error.message);
    }
}
connect();
