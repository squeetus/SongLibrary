Song Library Project Overview:

MySQL relational database will store the song data
	- create a new user and grant privileges

Steps:
	Run MySQL Command Line Client

	> CREATE USER 'songlibrarytest'@'localhost' IDENTIFIED BY 'test';

	> GRANT ALL PRIVILEGES ON burlinson_song_library.* to 'songlibrarytest'@'localhost';

	> FLUSH PRIVILEGES;



Back end server implemented in Node.js
	- connects to mysql with new credentials
	- creates SongLibrary database
	- populates the database with initial 5 songs

Steps:
	ensure node and npm are installed on your machine
	> node -v
	> v14.16.1

	> npm -v
	> 6.14.12

	install the node dependencies and run the server
	> npm install
	> node server.js

	>node server.js
	>Server running on port 3000/
	>connected to database
	>database and table created
	>songs seeded

Endpoints:
	GET 	/getAllSongs	returns a JSON object containing an array of songs from the database
	POST	/addSong 	expects a JSON object with song attributes

Front end single page app implemented in Angular
