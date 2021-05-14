const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

// instruct the database to connect, create, and seed
db.connect();

// ensure we can call this api from another port
app.use(cors());
// ensure express can parse json
app.use(express.json());

/*
  API Endpoint /getAllSongs
  method: GET
  returns a JSON array of Song Objects
*/
app.get('/getAllSongs', (req, res) => {
  songs = db.getAllSongs((err, songs) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.json(songs);
  });
});


/*
  API Endpoint /addSong
  method: POST
  returns 200 OK if completed, 500 if errors occur
*/
app.post('/addSong', (req, res) => {
  songs = db.addSong(req.body, (err, result, song) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.sendStatus(200);
  });
});


/*
  Default endpoint
  method: GET
*/
app.get('*', (req, res) => {
  res.statusCode = 200;
  res.setHeader('content-type', 'text/plain');
  res.end("Burlinson Song Library Server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}/`);
});
