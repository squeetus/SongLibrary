const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

const con = db.connect();


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/plain');
  res.end("Burlinson Song Library Server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}/`);
});
