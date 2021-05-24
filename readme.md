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


# Discussion

### Technologies

I chose to implement a server side component using Node, Express, and MySQL because I am comfortable enough with those technologies to quickly get a bare-bones API running, and I am familiar enough with the hosting process on Heroku to facilitate local and live versions of the back-end system. I wanted to be able to configure and adjust the API throughout the front-end development process as needs and issues arose and as the application evolved.

I chose Angular for the front-end application because it is a very robust framework and I wanted to continue climbing its learning curve. There were multiple features I wanted to either learn or learn to integrate with other concepts, so it offered a good balance of comfort and novelty. In particular, I wanted to use reactive forms, an angular materials table, and the ngx-slider module as the primary components of the Song Library. There are parts of the application that could be abstracted further, but I generally tried to follow standard practices for angular applications involving services, subcomponents, etc.

### UI and UX

For the primary Song content in the application, the angular-mat table provided an excellent point of entry for much of the desired functionality. The Angular Materials components do a good job of integrating accessibility constructs, and the table is easily extended to facilitate sorting by columns.

I chose to use modals to display form content for adding, deleting, and editing the song data. Since the primary focus of the application is the display of all Songs and the number of Songs and attributes is relatively small, I felt modals would support the flow of interaction well without inhibiting a user's context. For deletion, users are prompted whether they are certain, and can easily acknowledge or dismiss the modal. For editing, the song form is populated with the chosen song's data. For adding, a fresh form is presented. If the user directly cancels the modal any entered values are erased, but if they dismiss the modal by clicking outside then the form content is preserved. Form data can only be submitted when the reactive form is valid.

For Validation, I ensure the Song attributes are of the correct type. I also imposed some relatively arbitrary restrictions on the attributes:

	- title and artist cannot be longer than 100 characters. Brevity is the soul of wit.
	- release date must be a valid year in Common Era, but cannot be further in the future than the year 9999. If a compelling argument could be made for supporting songs from BCE or beyond several thousand years in the future I might consider modifying this restriction.
	- price must be a non-negative number less than or equal to $1,000,000. Negative prices would adversely affect the Song Library's bank account, and prices above one million dollars are unacceptable.

For filtering I chose to use a slider due to that interaction modality's simplicity. As either end of the slider is adjusted, the table reacts dynamically to display only songs with release dates within the given boundaries. I throttle the firing of that event so that it updates quickly enough but does not fire excessively. The bounds of the filter do change dynamically when songs are added to or removed from the collection. The Save List button only saves the set of currently filtered songs, and does not allow the saving of empty lists.

I imported some angular bootstrap modules to give helpful alerts on success or error of various user interactions. Console logging is fine, but it is also helpful to display success, warning, or danger alerts in familiar colors so users are given direct feedback on the operations they perform. I chose to stack the alerts, so if you are quick enough to generate several they will start filling your screen, but I also set them to disappear after a few seconds since the messages are fairly brief. This approach probably does not scale well in contexts where users are performing many operations in sequence, but is ok for a simple application.

For the color scheme, fonts, and button styles, I copied color codes directly from the PERA website. PERA capitalizes text on buttons and balances white and grey with several shades of green, so I tried to reflect those features despite the relative simplicity of the Song Library app. I used the lightest green color on every other row in the table so attention is easily drawn to individual songs. PERA primary buttons are a slightly different shade of blue than the default bootstrap blue, and button hovering reduces opacity rather than adding shadows, so I overrode those styles in the root css file of the angular app.

### Testing

I tried to generate a reasonable number of tests to ensure the components and overall application work as expected. They do not cover every possible interaction or case by any means, but they give confidence that the app is being generated, the table, buttons, and slider are being added to the page properly, data is displayed as expected, the user interactions call the right methods, the app interfaces with the local database, and so forth.
