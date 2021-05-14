const mysql = require('mysql2');

exports.connect = () => {
  const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'songlibrarytest',
    password : 'test',
    multipleStatements: true
  });

  var createCommand = `
    CREATE DATABASE IF NOT EXISTS burlinson_song_library;
    use burlinson_song_library;

    DROP TABLE song;
    CREATE TABLE song (
      id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      title varchar(100) NOT NULL,
      artist varchar(100) NOT NULL,
      release_date DATE NOT NULL,
      price float NOT NULL
    );
    `

  var seedCommand = `
    INSERT INTO song (title, artist, release_date, price)
    VALUES
      ('Song1', 'Artist1', Date("2021-05-04"), 12.99),
      ('Song2', 'Artist2', Date("2021-04-03"), 35.00),
      ('Song3', 'Artist3', Date("2021-02-01"), 2.45),
      ('Song4', 'Artist4', Date("2020-12-11"), 108.88),
      ('Song5', 'Artist5', Date("2020-10-09"), 15.01)
    ;
    `

  /*

  */
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

  return connection;
}
