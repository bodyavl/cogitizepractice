const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ type: "application/json" }));

const port = 3000;

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}
app.get("/", (req, res) => {
  console.log(req.query);
  console.log("TEXT")
  res.send("Hello");
});

app.post("/", (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items) throw new Error("Items is not provided!");
    res.send("Hello World! POST");
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
