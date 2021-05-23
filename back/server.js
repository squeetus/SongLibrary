const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

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
      console.log('sending song JSON now');
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
    res.status(500).end("Unable to save the song list, please try again shortly.")
  } else {
    let songCount = JSON.parse(req.body.songs).length
    res.status(200).json({'message': `successfully saved your song list with ${songCount} songs.`});
  }
});


/*
  API Endpoint /song
  method: POST
  returns 200 OK if completed, 500 if errors occur
*/
app.post('/song', (req, res) => {
  songs = db.addSong(req.body, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).json({'message': `successfully added ${result.affectedRows} song with id ${result.insertId}.`});
    }
  });
});


/*
  API Endpoint /song
  method: PUT
  returns 200 OK if completed, 500 if errors occur
*/
app.put('/song', (req, res) => {
  songs = db.updateSong(req.body, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).json({'message': `successfully updated ${result.affectedRows} song with id ${req.body.id}.`});
    }
  });
});


/*
  API Endpoint /song
  method: DELETE
  returns a json object with a success message if completed, 500 if errors occur
*/
app.delete('/song/:id', (req, res) => {
  songs = db.deleteSong(req.params.id, (err, result) => {
    if(err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).json({'message': `successfully deleted ${result.affectedRows} song with id ${req.params.id}.`});
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
