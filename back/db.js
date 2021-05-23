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
    ('Song1', 'Artist1', Date("2021-05-04"), 12.99),
    ('Song2', 'Artist2', Date("2021-04-03"), 35.00),
    ('Song3', 'Artist3', Date("2021-02-01"), 2.45),
    ('Song4', 'Artist4', Date("2020-12-11"), 108.88),
    ('Song5', 'Artist5', Date("2020-10-09"), 15.01)
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

    pool = mysql.createPool(params);
}

/*
  Get all the songs from the database
  pass the resultant array and any errors to the callback function
*/
exports.getAllSongs = (cb) => {
  pool.query("SELECT * FROM song", (err, result) => cb(err, result));
}

/*
  Add a new song to the database using a prepared statement
  pass the result and any errors to the callback function
*/
exports.addSong = (song, cb) => {
  pool.execute(
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
  pool.execute(
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
  pool.execute(
    "DELETE from song WHERE id=?",
    [id],
    (err, result) => cb(err, result)
  );
}
