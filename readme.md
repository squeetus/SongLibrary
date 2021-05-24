# Song Library Project Overview:
MySQL database, Node/Express API Server, Angular SPA

Data: Song objects with id, title, artist, release date, and price


You can see a live version of this project at https://squeetus.github.io/SongLibrary/

The database and back-end API are hosted on Heroku, so you may have to wait 30 seconds for the dyno to spin up before data will populate.


You can also set up the project to run on your local machine using the following procedure:


## setup
	- clone this repository
	> git clone https://github.com/squeetus/songlibrary

### MySQL setup
	- create a new user and grant privileges

#### Steps:

	Run MySQL Command Line Client

	> CREATE USER 'songlibrarytest'@'localhost' IDENTIFIED BY 'test';

	> GRANT ALL PRIVILEGES ON burlinson_song_library.* to 'songlibrarytest'@'localhost';

	> FLUSH PRIVILEGES;



### Local back end setup
	- connects to mysql with hardcoded credentials
	- creates burlinson_song_library database
	- populates the database with 5 songs

#### Steps:
	ensure node and npm are installed on your machine
	> node -v
	> v14.16.1

	> npm -v
	> 6.14.12

	navigate to the back-end directory
	> cd back

	install the node dependencies
	> npm install

	run the server
	> node server.js

	>Server running on port 3000/
	>database created
	>table created
	>songs seeded

#### Endpoints:
	You can view the API at localhost:3000

	- GET 		/getAllSongs	returns a JSON object containing an array of songs from the database
	- POST		/song 	expects a JSON object with song attributes
	- PUT 		/song	expects a JSON object with song attributes; updates based on id (pk)
	- DELETE	/song/:id	expects an id of the song to delete
	- POST		/saveList expects a JSON object of song attributes, returns an error roughly 1 in 5 attempts

	All non-GET endpoints return a JSON object with the following format:

		{'message':'some message content'}

	or an error message with the following format:

		{'error':'some error content'}



### Front end setup

#### Steps:
	ensure the angular cli is installed
	> ng version
	> Angular CLI: 11.2.13 (...)

	navigate to the front-end directory from the root of the project
	> cd front/song-library

	install the node dependencies
	> npm install

	run the server
	> ng serve --open

	As long as you have the database running locally in another cmd window, the app should open and display a table of Song data.



### Front end testing and building

	From inside the SongLibrary/front/song-library directory...

	You can run the tests using the following commands:
	> ng test
	> ng e2e

	The tests will ensure the components are rendering and operating correctly, and that the app is able to run and interact with the local database.
	(NOTE make sure the local database is still running in another cmd prompt)

	You can build a production version of the application using:
	> npm run build

	Note that by default angular will create several script files with unique hashes to facilitate caching.
	One of the requirements was to create a distribution with a single javascript file, so we use 'npm run build' rather than 'ng build'; the package.json file is set up to avoid hashing.
	Next, assuming windows cmd prompt, run the following command from inside 'SongLibrary/front' to concatenate the output scripts into a single 'concat.js' script file:
	>type .\dist\song-library\*.js > .\dist\song-library\concat.js

	Then replace the script files at the bottom of  ..front/dist/song-library/index.html  with a single import of 'concat.js'
	You also must update the 'base href' attribute of the index page so github pages knows where to find the script and css files:
	> (...)
	> <base href="/SongLibrary/">
	> (...)

	Finally, you can push the built front app to the gh-pages branch on github
	> git subtree push --prefix front/song-library/dist/song-library origin gh-pages
