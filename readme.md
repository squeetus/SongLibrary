# Song Library Project Overview:
MySQL database, Node/Express API Server, Angular SPA

Data: Song objects with id, title, artist, release date, and price






## setup

### MySQL setup
	- create a new user and grant privileges

#### Steps:

	Run MySQL Command Line Client

	> CREATE USER 'songlibrarytest'@'localhost' IDENTIFIED BY 'test';

	> GRANT ALL PRIVILEGES ON burlinson_song_library.* to 'songlibrarytest'@'localhost';

	> FLUSH PRIVILEGES;



### Back end setup
	- connects to mysql with hardcoded credentials
	- creates burlinson_song_library database
	- populates the database with 5 songs

#### Steps:
	ensure node and npm are installed on your machine
	> node -v
	> v14.16.1

	> npm -v
	> 6.14.12

	install the node dependencies and run the server
	> npm install
	> node back/server.js

	>Server running on port 3000/
	>connected to database
	>database and table created
	>songs seeded

#### Endpoints:
	- GET 		/getAllSongs	returns a JSON object containing an array of songs from the database
	- POST		/song 	expects a JSON object with song attributes
	- PUT 		/song	expects a JSON object with song attributes; updates based on id (pk)
	- DELETE	/song	expects a JSON object with an id of the song to delete
	- POST		/saveList expects a JSON object of song attributes, returns an error roughly 1 in 5 attempts

### Front end setup

#### Steps:
