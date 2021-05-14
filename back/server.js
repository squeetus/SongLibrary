const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

db.connect();


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/getAllSongs', (req, res) => {
  songs = db.getAllSongs((err, songs) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.json(songs);
  });

});


app.get('*', (req, res) => {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/plain');
  res.end("Burlinson Song Library Server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}/`);
});
