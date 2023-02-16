const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json({type: 'application/json'}));
const port = 3000

function errorHandler(error, req, res, next) {
  res.header("Content-Type", "application/json");
  console.log("Error occured:", error.message);
  res.status(500).send(error.message);
}

app.get('/', (req, res) => {
    console.log(req.query);
    res.send('Hello geted World!')
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hello posted World!')
    try {
      const { items } = req.body;
      if (!items) throw new Error("Item is nor provided")
      res.send('Hello World!')
    } catch (error) {
      next(error);
    }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});