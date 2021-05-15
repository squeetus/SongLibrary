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
    } else {
      res.json(songs);
    }
  });
});

/*
  API Endpoint /saveList
  method: POST
  returns OK 4/5 attempts, and 500 1/5 attempts
*/
app.post('/saveList', (req, res) => {
  if(Math.random() < 0.2) {
    res.status(500).send({"error":"Unable to save the song list, please try again shortly."})
  } else {
    res.sendStatus(200);
  }
});


/*
  API Endpoint /song
  method: POST
  returns 200 OK if completed, 500 if errors occur
*/
app.post('/song', (req, res) => {
  songs = db.addSong(req.body, (err, result, song) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});


/*
  API Endpoint /song
  method: PUT
  returns 200 OK if completed, 500 if errors occur
*/
app.put('/song', (req, res) => {
  songs = db.updateSong(req.body, (err, result, song) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});


/*
  API Endpoint /song
  method: DELETE
  returns 200 OK if completed, 500 if errors occur
*/
app.delete('/song', (req, res) => {
  songs = db.deleteSong(req.body.id, (err, result, song) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
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