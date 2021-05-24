const mysql = require('mysql2');

let pool;
let connection;

// command to create the song database and song table schema once
let createCommand = `
  DROP TABLE IF EXISTS song;
  CREATE TABLE song (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title varchar(100) NOT NULL,
    artist varchar(100) NOT NULL,
    release_date DATE NOT NULL,
    price decimal(9,2) NOT NULL
  );
  `

// command to insert multiple songs at once
let seedCommand = `
  INSERT INTO song (title, artist, release_date, price)
  VALUES
    ('The Warp Riders', 'The Sword', Date("2010-08-19"), 120.00),
    ('Made Possible', 'The Bad Plus', Date("2012-09-25"), 60.00),
    ('Where Owls Know My Name', 'Rivers of Nihil', Date("2018-03-16"), 125.01),
    ('Donut Man', 'Darryl Reeves', Date("2013-01-01"), 50.75),
    ('The Weaver System', 'IOTUNN', Date("2021-02-26"), 110.99)
  ;
  `

let params = {
  host     : process.env.CLEARDB_HOST || 'localhost',
  user     : process.env.CLEARDB_USER || 'songlibrarytest',
  password : process.env.CLEARDB_PASS || 'test',
  multipleStatements: true,
  dateStrings: true,
  timezone: '+00:00'
}

// prod
if(process.env.CLEARDB_DATABASE_URL) {
  params.database = process.env.CLEARDB_DB;

  // local
} else {
  mysql.createConnection(params).query(`CREATE DATABASE IF NOT EXISTS burlinson_song_library;`, (err, result) => {
    if(err) throw('unable to execute query: ' + err.stack);
    console.log('database created');
  });
  params.database = 'burlinson_song_library';
}

  /*
    Connect to the database described in the params
    Run commands to drop/create the song table and seed song data
  */
  exports.connect = () => {
    connection = mysql.createConnection(params);

    connection.query(createCommand, (err, result) => {
      if(err) throw('unable to execute query: ' + err.stack);
      console.log('table created');
    });

    connection.query(seedCommand, (err, result) => {
      if(err) throw('unable to execute query: ' + err.stack);
      console.log('songs seeded');
    });

    connection.on('error', (err) => {
      console.log('connection error:', err);
    });
    connection.end();

    pool = mysql.createPool(params);
    pool.on('error', (err) => {
      console.log('pool error:', err);
    });
}

/*
  Get all the songs from the database
  pass the resultant array and any errors to the callback function
*/
exports.getAllSongs = (cb) => {
  pool.getConnection(function(error, connection) {
    connection.query("SELECT * FROM song", (err, result) => cb(err, result));
    connection.release();
    if (error) throw error;
  });
}

/*
  Add a new song to the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.addSong = (song, cb) => {
  pool.getConnection(function(error, connection) {
    connection.execute(
      "INSERT INTO song (title, artist, release_date, price) VALUES (?, ?, ?, ?)",
      [song.title, song.artist, new Date(song.release_date), song.price],
      (err, result) => cb(err, result)
    );
    connection.release();
    if (error) throw error;
  });
}

/*
  Update song in the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.updateSong = (song, cb) => {
  pool.getConnection(function(error, connection) {
    connection.execute(
      "UPDATE song SET title=?, artist=?, release_date=?, price=? WHERE id=?",
      [song.title, song.artist, new Date(song.release_date), song.price, song.id],
      (err, result) => cb(err, result)
    );
    connection.release();
    if (error) throw error;
  });
}

/*
  Delete a song in the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.deleteSong = (id, cb) => {
  pool.getConnection(function(error, connection) {
    connection.execute(
      "DELETE from song WHERE id=?",
      [id],
      (err, result) => cb(err, result)
    );
    connection.release();
    if (error) throw error;
  });
}
