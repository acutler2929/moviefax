'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const mysql = require('mysql');
// const path = require('path');
const nodemailer = require('nodemailer');

/////////////////// Modules
const apiHandler = require('./modules/apiHandler');
const movieDBHandler = require('./modules/movieDBHandler');
const loginHandler = require('./modules/loginHandler');
const sourceHandler = require('./modules/sourceHandler');
const stateHandler = require('./modules/stateHandler');
// const { doesNotMatch } = require('assert');
// const { callbackPromise } = require('nodemailer/lib/shared');

///////// Connecting to MYSQL

const mysqlPassword = process.env.MYSQL_PASSWORD;

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: mysqlPassword,
	database: 'moviefax',
});

const app = express();

////////////////////// Middleware

const sessionSecret = process.env.SESSION_SECRET;

app.use(
	session({
		secret: sessionSecret,
		resave: true,
		saveUninitialized: true,
	})
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/public', express.static(`${__dirname}/public`));

app.get('/', async (req, res) => {
	console.log('welcome to homepage');
	console.log(`req.url: ${req.url}`);

	//////// check if user is logged in
	if (req.session.loggedin == true) {
		/////////// if they are, send their list of movies
		let savedListObject;
		const savedData = new Boolean(false);

		await new Promise((resolve, reject) => {
			async function getUserMovies() {
				let results = await movieDBHandler.getMovieList(
					req,
					connection
				);
				return results;
			}

			let savedList = getUserMovies();

			console.log(
				`savedList is a ${typeof savedList}, here it is: ${savedList}`
			);

			resolve(savedList);
			reject((err) => {
				console.log(err);
			});
		})
			.then((savedList) => {
				/////////////// saving the current user's movies to the state:
				stateHandler.saveUserListState(savedList);

				return savedList;
			})
			.then((savedList) => {
				console.log(`savedList is a ${typeof savedList}`);
				savedListObject = JSON.parse(savedList);
				console.log(
					`savedListObject is a ${typeof savedListObject} and here is the first entry:`
				);
				console.dir(savedListObject[0]);

				return savedListObject;
			})
			.catch((error) => {
				console.log(error);
			});

		///////////// handling state:
		let imdbSearchData = stateHandler.loadSearchState();
		let movieData = stateHandler.loadMovieDataState();

		res.render('pages/index', {
			detailsLink: savedData == true ? '/saved-details' : '/details',
			imdbSearchData: imdbSearchData,
			movieData: movieData,
			savedList: savedListObject,
			req: req,
		});
	} else {
		res.render('pages/index', {
			req: req,
		});
	}

	/////////// loading movie-list state from temporary files:
	// let imdbSearchData = JSON.parse(
	// 	fs.readFileSync('./tmp/movie-list-state.json')
	// );
});

///////////////////////////////////////////////////// Login module

app.get('/login-form', (req, res) => {
	console.log('app.js: /login-form fired');
	console.log(`req.url: ${req.url}`);

	let loginMessage = 'Login to continue...';

	res.render('pages/login', { loginMessage: loginMessage, req: req });
});

///////////////// Authorizing login information:

app.post('/auth', async (req, res) => {
	const loginResponse = await loginHandler.auth(req, connection);

	console.log(
		`app.js: loginResponse received on following line: ${loginResponse}`
	);
	console.dir(loginResponse);

	if (loginResponse.loginStatus === true) {
		// Validate the user:
		req.session.loggedin = loginResponse.loginStatus;
		req.session.userid = loginResponse.userInfo.user_id;
		req.session.username = loginResponse.userInfo.user_name;
		req.session.userEmail = loginResponse.userInfo.email;
		console.log('req.session object on following line:');
		console.log(req.session);

		console.log(
			`app.js: login successful for user ${req.session.username}, email: ${req.session.userEmail}`
		);
		res.redirect('/');
	} else {
		// Or kick them back to the login page:
		req.session.loggedin = loginResponse.loginStatus;

		res.render('pages/login', {
			loginMessage: loginResponse.errorMessage,
			req: req,
		});
	}
});

app.post('/register', async (req, res) => {
	const registerResponse = await loginHandler.register(req, connection);

	console.log(
		`app.js: registerResponse received on following line: ${registerResponse}`
	);
	console.dir(registerResponse);

	if (registerResponse.loginStatus === true) {
		// Validate the user:
		req.session.loggedin = loginResponse.loginStatus;
		req.session.userid = loginResponse.userInfo.userID;
		req.session.username = loginResponse.userInfo.userName;
		req.session.userEmail = loginResponse.userInfo.email;
		console.log(req.session);

		console.log(
			`app.js: registry successful for NEW user ${req.session.userName}, email: ${req.session.userEmail}`
		);

		// Redirect to home:
		res.redirect('/');

		// If registration info already exists...
	} else if (registerResponse.userInfo === 'ER_DUP_ENTRY') {
		// then kick them back to the login page:
		req.session.loggedin = registerResponse.loginStatus;

		res.render('pages/login', {
			loginMessage: 'User name, email or password already exists!',
			req: req,
		});
		// or else if registration info is invalid...
	} else {
		// then kick them back to the login page:
		req.session.loggedin = registerResponse.loginStatus;

		res.render('pages/login', {
			loginMessage: 'Invalid name, email or password!',
			req: req,
		});
	}
});

app.get('/logout', (req, res) => {
	console.log('Logout button fired');

	req.session.loggedin = false;
	req.session.username = '';
	req.session.userid = '';
	req.session.userEmail = '';

	res.redirect('/');
});

app.get('/forgotPassword', (req, res) => {
	console.log(`req.url: ${req.url}`);

	res.render('pages/iforgot.ejs', {
		loginMessage: 'enter your email to change password...',
	});
});

app.post('/passwordEmail', (req, res) => {
	console.log(`req.url: ${req.url}`);
	let recoverEmail = req.body.email;
	const serverGmail = process.env.MY_GMAIL;
	const googleAppPassword = process.env.GOOGLE_APP_PASSWORD;

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: serverGmail,
			pass: googleAppPassword,
		},
	});

	const mailOptions = {
		from: serverGmail,
		to: recoverEmail,
		subject: 'MovieFax Password Reset',
		html: `
		<p>Click <a href="http://localhost:8888/new-password">here</a>, then enter a new password...</p>
		`,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

	res.render('pages/iforgot.ejs', {
		loginMessage: 'please check your email',
	});
});

app.get('/new-password', (req, res) => {
	console.log(`req.url: ${req.url}`);

	res.render('pages/new-password', {
		loginMessage: 'Please enter new credentials...',
		req: req,
	});
});

app.post('/change-password', async (req, res) => {
	console.log(`req.url: ${req.url}`);

	const updatePassword = await loginHandler.passwordReset(req, connection);

	if (updatePassword.loginStatus === true)
		// Validate the user:
		req.session.loggedin = updatePassword.loginStatus;
	req.session.userName = updatePassword.userInfo.userName;
	req.session.userEmail = updatePassword.userInfo.userEmail;
	console.log(req.session);

	console.log(
		`app.js: registry successful for NEW user ${req.session.userName}, email: ${req.session.userEmail}`
	);

	// Redirect to home:
	res.redirect('/');
});

///////////////////////////////////////////////////////// Searching movies with SAMPLE data...

app.get('/saved-state-data', (req, res) => {
	console.log('app.js receiving query for STATE data');
	const savedData = new Boolean(true);
	// console.log(`app.js: saved data is a ${typeof savedData} ${savedData}`);

	console.log(`req.url: ${req.url}`);

	// using saved data for now...

	console.log('req.session on following line:');
	console.dir(req.session);

	let imdbSearchData = stateHandler.loadSearchState();
	let movieData = stateHandler.loadMovieDataState();
	let savedList = stateHandler.loadUserListState();
	// console.log(`savedList is a ${typeof savedList}, here it is:`);
	// console.dir(savedList);

	res.render('pages/index.ejs', {
		searchQuery: imdbSearchData.expression,
		detailsLink: savedData == true ? '/saved-details' : '/details',
		imdbSearchData: imdbSearchData,
		movieData: movieData,
		savedList: savedList,
		req: req,
	});
});

///////////////////////////////////////////////////////// Searching movies...

app.post('/query-search', async (req, res) => {
	const query = req.body.query;
	console.log('req.body on next line:');
	console.dir(req.body);
	console.log(`app.js: receiving query for movie name ${query}`);
	const savedData = new Boolean(false);
	// console.log(`app.js: saved data is a ${typeof savedData} ${savedData}`);

	// imdbResponse comes back from api Handler...
	const imdbResponse = await apiHandler.searchMovieData(query);
	// console.log(imdbResponse.results);

	if (imdbResponse.message === 'ERROR' || imdbResponse.results === null) {
		res.send(imdbResponse.errorMessage);
	} else {
		console.log(
			`app.js: received imdbResponse for movie ${imdbResponse.results[0].title}`
		);

		const imdbSearchData = imdbResponse;

		////////// handling state:
		stateHandler.saveSearchState(imdbSearchData);
		let movieData = stateHandler.loadMovieDataState();
		let savedList = stateHandler.loadUserListState();

		res.render('pages/index.ejs', {
			searchQuery: imdbResponse.expression,
			detailsLink: savedData == true ? '/saved-details' : '/details',
			imdbSearchData: imdbSearchData,
			movieData: movieData,
			savedList: savedList,
			req: req,
		});
	}
});

///////////////////////////////////////////// Getting movie details using SAVED data

// app.get('/saved-details', async (req, res) => {
// 	console.log('app.js: /savedDetails accessed!');
// 	const savedData = new Boolean(true);
// 	// console.log(`app.js: saved data is a ${typeof savedData} ${savedData}`);

// 	const { query, pathname } = url.parse(req.url, true);
// 	const imdbID = JSON.stringify(query.id);
// 	console.log(`imdbID: ${imdbID}`);

// 	/////// next we should do api calls with imdbID and watchmode, but we will use saved data for now:
// 	const imdbTitleData = require('./tmp/imdb-title-saved.json');
// 	const watchmodeSourcesData = require('./tmp/watchmode-sources-saved.json');

// 	const movieSources = sourceHandler(watchmodeSourcesData);

// 	let movieData = {
// 		imdbID: imdbID,
// 		movieTitle: imdbTitleData.title,
// 		movieYear: imdbTitleData.year,
// 		contentRating: imdbTitleData.contentRating,
// 		moviePoster: imdbTitleData.image,
// 		movieSummary: imdbTitleData.plot,
// 		imdbRating: imdbTitleData.imDbRating,
// 		metacriticRating: imdbTitleData.metacriticRating,
// 		movieBudget: imdbTitleData.boxOffice.budget,
// 		movieGross: imdbTitleData.boxOffice.cumulativeWorldwideGross,
// 		moviePurchaseArray: movieSources.purchaseSources,
// 		movieRentArray: movieSources.rentalSources,
// 		movieStreamingArray: movieSources.streamingSources,
// 	};

// 	// console.log('movieData on following line:');
// 	// console.dir(movieData);

// 	let imdbSearchData = stateHandler.loadSearchState();

// 	// stateHandler.saveMovieDataState(movieData);

// 	console.log('req.session on following line:');
// 	console.dir(req.session);

// 	res.render('pages/index.ejs', {
// 		imdbSearchData: imdbSearchData,
// 		movieData: movieData,
// 		detailsLink: savedData == true ? '/saved-details' : '/details',
// 		req: req,
// 	});
// });

///////////////////////////////////////////// Getting movie details

app.get('/details', async (req, res) => {
	let savedData = new Boolean(false);
	// console.log(`app.js: saved data is a ${typeof savedData} ${savedData}`);
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = query.id;
	console.log(`/details: receiving query for imdbID ${imdbID}`);

	/////////// loading movie-list state from temporary files:
	let imdbSearchData = stateHandler.loadSearchState();
	let savedList = stateHandler.loadUserListState();

	///////// using a function with a loop to check if this movie is included in the user's saved list
	function isMovieSaved(imdbID, savedList) {
		let result = new Boolean(true);
		let imdbList = [];
		for (let i in savedList) {
			imdbList.push(savedList[i].imdb_id);
		}
		// console.log(imdbList);
		result = imdbList.includes(imdbID) ? true : false;

		if (result == true) {
			console.log('movie data IS stored in MYSQL, retrieving it now...');
		} else {
			console.log(
				'movie data IS NOT stored in MYSQL, starting an api call...'
			);
		}

		return result;
	}

	if (req.session.loggedin && isMovieSaved(imdbID, savedList) == true) {
		/////////// if it is, get the data from MYSQL

		let movieData = await movieDBHandler.getMovieDetails(
			imdbID,
			connection
		);

		console.log(`here is movieData so far:`);
		console.log(movieData);

		res.render('pages/index.ejs', {
			imdbSearchData: imdbSearchData,
			movieData: movieData,
			detailsLink: savedData == true ? '/saved-details' : '/details',
			savedList: savedList,
			req: req,
		});
	} else {
		/////////// if it isn't, then get the data from an api call
		// movieDataResponse comes back from api Handler...
		const movieDataResponse = await apiHandler.selectedMovieData(imdbID);
		// console.log(movieDataResponse);

		if (movieDataResponse.message === 'ERROR') {
			res.send(movieDataResponse.errorMessage);
		} else {
			const movieSources = sourceHandler(
				movieDataResponse.watchmodeSourcesData
			);
			// console.log('movieDataResponse.imdbTitleData:');
			// console.dir(movieDataResponse.imdbTitleData);

			let movieData = {
				imdbID: imdbID,
				movieTitle: movieDataResponse.imdbTitleData.title,
				movieYear: movieDataResponse.imdbTitleData.year,
				contentRating: movieDataResponse.imdbTitleData.contentRating,
				moviePoster: movieDataResponse.imdbTitleData.image,
				movieSummary: movieDataResponse.imdbTitleData.plot,
				imdbRating: movieDataResponse.imdbTitleData.imDbRating,
				metacriticRating:
					movieDataResponse.imdbTitleData.metacriticRating,
				movieBudget: movieDataResponse.imdbTitleData.boxOffice.budget,
				movieGross:
					movieDataResponse.imdbTitleData.boxOffice
						.cumulativeWorldwideGross,
				moviePurchaseArray: movieSources.purchaseSources,
				movieRentArray: movieSources.rentalSources,
				movieStreamingArray: movieSources.streamingSources,
			};

			res.render('pages/index.ejs', {
				imdbSearchData: imdbSearchData,
				movieData: movieData,
				detailsLink: savedData == true ? '/saved-details' : '/details',
				savedList: savedList,
				req: req,
			});
		}
	}
});

////////////////////////////// Adding a movie to a user's list:

app.post('/add-movie', (req, res) => {
	console.log(req.url);
	console.log('req.session on following line:');
	console.dir(req.session);

	//////////////// read the movie data state from TMP folder
	// let movieData = JSON.parse(fs.readFileSync('./tmp/movie-data-state.json'));
	let movieData = stateHandler.loadMovieDataState();

	////////////////// see if this movie is stored in user_movies already
	connection.query(
		'SELECT * FROM user_movies WHERE imdb_id = ?',
		movieData.imdbID,
		function (error, results, fields) {
			///////////// if it is, just add the current user's userid and imdb_id to selected_movies
			if (results && results.length > 0) {
				console.log(results);

				movieDBHandler.addSelection(
					req.session.userid,
					movieData.imdbID,
					connection
				);

				//////////////// if NOT, add the MOVIE and SOURCES info, with current user's id, to MYSQL tables: user_movies and movie_sources, then add user_id and imdb_id to selected_movies
			} else if (!results || results.length == 0) {
				movieDBHandler.addMovie(movieData, connection);
				movieDBHandler.addSelection(
					req.session.userid,
					movieData.imdbID,
					connection
				);
			}
		}
	);

	// console.log(movieData);

	res.redirect('/');
});

////////////////////////// Dropping a movie from a user's list:

app.delete('/drop-movie', (req, res) => {
	console.log(req.url);
	console.log('req.session on following line:');
	console.dir(req.session);

	let movieData = stateHandler.loadMovieDataState();

	movieDBHandler.deleteSelection(
		req.session.userid,
		movieData.imdbID,
		connection
	);

	res.redirect('/');
});

module.exports = app;
