'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

/////////////////// Modules
const apiHandler = require('./modules/apiHandler');
const movieDBHandler = require('./modules/movieDBHandler');
const loginHandler = require('./modules/loginHandler');
const sourceHandler = require('./modules/sourceHandler');
const stateHandler = require('./modules/stateHandler');
const { MovieSearchState } = require('./modules/stateHandler');

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

		await new Promise(async (resolve, reject) => {
			async function getUserMovies() {
				let results = await movieDBHandler.getMovieList(
					req,
					connection
				);
				return results;
			}

			let savedList = await getUserMovies();

			resolve(savedList);
			reject((err) => {
				console.log(err);
			});
		})
			.then((savedList) => {
				///////////// handling state by taking userListState from stateHandler.js:
				stateHandler.userListState.overWrite(JSON.parse(savedList));
				/////// telling client to expect userListState:
				req.session.containsListState = true;

				// console.log(
				// 	'and here is the first entry of userListState.listData from stateHandler.js:'
				// );
				// console.dir(stateHandler.userListState.listData[0]);

				res.render('pages/index', {
					movieSearchState: stateHandler.movieSearchState,
					movieDataState: stateHandler.movieDataState,
					userListState: stateHandler.userListState,
					req: req,
				});
			})
			.catch((error) => {
				console.log(error);
			});
	} else {
		// DEFAULT telling client not to expect any state:
		req.session.containsMovieState = new Boolean(false);
		req.session.containsSearchState = new Boolean(false);
		req.session.containsListState = new Boolean(false);

		res.render('pages/index', {
			req: req,
		});
	}
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
	req.session.username = 'guest';
	req.session.userid = '0';
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

///////////////////////////////////////////////////////// Searching movies...

app.post('/query-search', async (req, res) => {
	const query = req.body.query;
	console.log(`app.js: receiving query for movie name ${query}`);

	// imdbResponse comes back from api Handler...
	const imdbResponse = await apiHandler.searchMovieData(query);
	// console.log(imdbResponse.results);

	if (imdbResponse.message === 'ERROR' || imdbResponse.results === null) {
		res.send(imdbResponse.errorMessage);
	} else {
		console.log(
			`app.js: received imdbResponse for movie ${imdbResponse.results[0].title}`
		);
		// console.log('and here are the full results:');
		// console.dir(imdbResponse);

		///////////// handling state by taking movieSearchState from stateHandler.js:
		stateHandler.movieSearchState.overWrite(imdbResponse);
		/////// telling client to expect movieSearchState:
		req.session.containsSearchState = true;

		// stateHandler.saveSearchState(req.session.userid, imdbSearchData);
		// let movieData = stateHandler.loadMovieDataState(req.session.userid);
		// let savedList = stateHandler.loadUserListState(req.session.userid);

		res.render('pages/index.ejs', {
			searchQuery: imdbResponse.expression,
			movieSearchState: stateHandler.movieSearchState,
			movieDataState: stateHandler.movieDataState,
			userListState: stateHandler.userListState,
			req: req,
		});
	}
});

///////////////////////////////////////////// Getting movie details

app.get('/details', async (req, res) => {
	console.log('req.body on next line:');
	console.dir(req.body);
	console.log('here is the req.session object:');
	console.dir(req.session);
	// console.log(`app.js: saved data is a ${typeof savedData} ${savedData}`);
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = query.id;
	console.log(`${req.url}: receiving query for imdbID ${imdbID}`);

	///////// using a function with a loop to check if this movie is included in the user's saved MYSQL list
	let isSaved = new Boolean(true);
	////////// check imdbID against the imdb_id in savedList
	function isMovieSaved(imdbID, savedList) {
		let imdbList = [];
		for (let i in savedList) {
			imdbList.push(savedList[i].imdb_id);
		}
		// console.log(imdbList);
		isSaved = imdbList.includes(imdbID) ? true : false;

		if (isSaved == true) {
			console.log('movie data IS stored in MYSQL, retrieving it now...');
		} else {
			console.log(
				'movie data IS NOT stored in MYSQL, starting an api call...'
			);
		}

		return isSaved;
	}

	isSaved = isMovieSaved(imdbID, stateHandler.userListState.listData); // <-- should be a boolean reflecting whether movie is saved to the user or not
	console.log(`isSaved is a ${typeof isSaved} ${isSaved}`);

	/////////// if it is, get the data from MYSQL
	if (req.session.loggedin && isSaved == true) {
		let movieDBData = await movieDBHandler.getMovieDetails(
			imdbID,
			connection
		);

		let movieData = {
			imdbID: imdbID,
			movieTitle: movieDBData.movie_title,
			movieYear: movieDBData.release_year,
			contentRating: movieDBData.content_rating,
			moviePoster: movieDBData.movie_poster,
			movieSummary: movieDBData.movie_summary,
			imdbRating: movieDBData.imdb_rating,
			metacriticRating: movieDBData.metacritic_rating,
			movieBudget: movieDBData.movie_budget,
			movieGross: movieDBData.movie_gross,
		};

		let movieSources = sourceHandler.sortSavedData(
			movieDBData.movieSourcesArray
		);

		///////////// handling state by overwriting movieDataState from stateHandler.js:
		stateHandler.movieDataState.overWrite(isSaved, movieData, movieSources);
		/////// telling client to expect movieDataState:
		req.session.containsMovieState = true;

		// console.log('now, here is the movieDataState.movieSources object:');
		// console.dir(stateHandler.movieDataState.movieSources);

		res.render('pages/index.ejs', {
			movieSearchState: stateHandler.movieSearchState,
			movieDataState: stateHandler.movieDataState,
			userListState: stateHandler.userListState,
			req: req,
		});
	} else {
		/////////// if it isn't, then get the data from an api call
		// movieDataResponse comes back from api Handler...
		let movieDataResponse = await apiHandler.selectedMovieData(imdbID);
		// console.log(movieDataResponse);

		if (movieDataResponse.message === 'ERROR') {
			res.send(movieDataResponse.errorMessage);
		} else {
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
			};

			let movieSources = sourceHandler.replaceDetailData(
				movieDataResponse.watchmodeSourcesData
			);

			///////////// handling state by overwriting movieDataState from stateHandler.js:
			stateHandler.movieDataState.overWrite(
				isSaved,
				movieData,
				movieSources
			);
			/////// telling client to expect movieDataState:
			req.session.containsMovieState = true;

			// console.log('now, here is the movieDataState object:');
			// console.dir(stateHandler.movieDataState);

			res.render('pages/index.ejs', {
				movieSearchState: stateHandler.movieSearchState,
				movieDataState: stateHandler.movieDataState,
				userListState: stateHandler.userListState,
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

	////////////////// see if this movie is stored in user_movies already
	connection.query(
		'SELECT * FROM user_movies WHERE imdb_id = ?',
		movieData.imdbID,
		function (error, results, fields) {
			///////////// if it is, just add the current user's userid and imdb_id to selected_movies
			if (results && results.length > 0) {
				console.log(
					'movie IS SAVED, adding userid and imdb_id to table selected_movies'
				);
				console.log(results);

				movieDBHandler.addSelection(
					req.session.userid,
					movieData.imdbID,
					connection
				);

				//////////////// if NOT, add the MOVIE and SOURCES info, with current user's id, to MYSQL tables: user_movies and movie_sources, then add user_id and imdb_id to selected_movies
			} else if (!results || results.length == 0) {
				console.log('movie is NOT saved, adding it to MYSQL now');
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

app.get('/drop-movie', async (req, res) => {
	console.log(req.url);
	console.log('req.session on following line:');
	console.dir(req.session);

	///////////// loading movieData from tmp folder state:
	// const movieData = await stateHandler.loadMovieDataState(req.session.userid);
	const imdbID = movieData.imdbID;

	console.log(`/drop-movie: receiving DELETE query for imdbID ${imdbID}`);

	movieDBHandler.deleteSelection(req.session.userid, imdbID, connection);

	res.redirect('/');
});

// app.get('/test-data', (req, res) => {
// 	console.log(req.url);
// 	console.log('req.session on following line:');
// 	console.dir(req.session);

// 	const testData = {
// 		greeting: 'hello from the backend!',
// 	};

// 	res.send(testData);
// });

module.exports = app;
