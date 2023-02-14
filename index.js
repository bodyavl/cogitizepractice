const express = require("express");
const bodyParser = require("body-parser");

const PORT = 3000;


const app = express();
app.use(bodyParser.json());



app.get("/", (req, res) => {
    console.log(req.query);
    res.sendStatus("200");
});


app.post("/", (req, res) => {
    console.log(req.body);
    res.sendStatus("200");
});



app.listen(
    PORT, 
    (err) => {
        if(err) console.log(err);
        else console.log(`Server started on port ${PORT}!`);
    }
);
