const mysql = require('mysql2');

let connection;
let createCommand;
let seedCommand;

// prod
if(process.env.CLEARDB_DATABASE_URL) {
  connection = mysql.createConnection({
    host     : process.env.CLEARDB_HOST,
    user     : process.env.CLEARDB_USER,
    password : process.env.CLEARDB_PASS,
    database : process.env.CLEARDB_DB,
    multipleStatements: true,
    dateStrings: true,
    timezone: '+00:00'
  });

  // command to create the song database and song table schema once
  createCommand = `
    DROP TABLE IF EXISTS song;
    CREATE TABLE song (
      id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title varchar(100) NOT NULL,
      artist varchar(100) NOT NULL,
      release_date DATE NOT NULL,
      price decimal(9,2) NOT NULL
    );
    `
  // local
  } else {
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'songlibrarytest',
      password : 'test',
      multipleStatements: true,
      dateStrings: true,
      timezone: '+00:00'
    });

    createCommand = `
      CREATE DATABASE IF NOT EXISTS burlinson_song_library;
      use burlinson_song_library;

      DROP TABLE song;
      CREATE TABLE song (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title varchar(100) NOT NULL,
        artist varchar(100) NOT NULL,
        release_date DATE NOT NULL,
        price decimal(9,2) NOT NULL
      );
      `
  }

  /*
    Connect to the database described in the connection variable
    Run commands to drop/create the database and song table and seed song data
  */
  exports.connect = () => {

    // command to insert multiple songs at once
    seedCommand = `
      INSERT INTO song (title, artist, release_date, price)
      VALUES
        ('Song1', 'Artist1', Date("2021-05-04"), 12.99),
        ('Song2', 'Artist2', Date("2021-04-03"), 35.00),
        ('Song3', 'Artist3', Date("2021-02-01"), 2.45),
        ('Song4', 'Artist4', Date("2020-12-11"), 108.88),
        ('Song5', 'Artist5', Date("2020-10-09"), 15.01)
      ;
      `

  // connect to the database and run the create and seed commands
  // throw an error and print the stack trace if the queries fail
  connection.connect((err) => {
      if(err) throw('unable to establish database connection: ' + err.stack);
      console.log('connected to database');

      connection.query(createCommand, (err, result) => {
        if(err) throw('unable to execute query: ' + err.stack);
        console.log('database and table created');
      });

      connection.query(seedCommand, (err, result) => {
        if(err) throw('unable to execute query: ' + err.stack);
        console.log('songs seeded');
      });
  });
}

/*
  Get all the songs from the database
  pass the resultant array and any errors to the callback function
*/
exports.getAllSongs = (cb) => {
  connection.query("SELECT * FROM song", (err, result) => cb(err, result));
}

/*
  Add a new song to the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.addSong = (song, cb) => {
  connection.execute(
    "INSERT INTO song (title, artist, release_date, price) VALUES (?, ?, ?, ?)",
    [song.title, song.artist, new Date(song.release_date), song.price],
    (err, result) => cb(err, result)
  );
}

/*
  Update song in the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.updateSong = (song, cb) => {
  connection.execute(
    "UPDATE song SET title=?, artist=?, release_date=?, price=? WHERE id=?",
    [song.title, song.artist, new Date(song.release_date), song.price, song.id],
    (err, result) => cb(err, result)
  );
}

/*
  Delete a song in the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.deleteSong = (id, cb) => {
  connection.execute(
    "DELETE from song WHERE id=?",
    [id],
    (err, result) => cb(err, result)
  );
}
