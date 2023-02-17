//mongodb+srv://Skyba:<password>@cogitizepractice.9lnnjje.mongodb.net/?retryWrites=true&w=majority
const mongoose = require("mongoose");
function connect() {
    try {
        mongoose.connect ("mongodb+srv://Skyba:VwKLumJZB6mlPZ3g@cogitizepractice.9lnnjje.mongodb.net/?retryWrites=true&w=majority",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connecting to MongoDB");
    } catch (error) {
        console.log("Error occured:", error.message);
    }
}
connect();