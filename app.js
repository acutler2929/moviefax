'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql');
// const path = require('path');
const nodemailer = require('nodemailer');

/////////////////// Modules
const apiHandler = require('./modules/apiHandler');
// const dataHandler = require('./modules/dataHandler');
const loginHandler = require('./modules/loginHandler');
const sourceHandler = require('./modules/sourceHandler');
const { doesNotMatch } = require('assert');
const { callbackPromise } = require('nodemailer/lib/shared');

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

app.get('/', (req, res) => {
	console.log('welcome to homepage');

	console.log(`req.url: ${req.url}`);
	// greetingMessage: loginStatus.greetingMessage,

	res.render('pages/index', {
		req: req,
	});
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
		req.session.userid = loginResponse.userInfo.userID;
		req.session.username = loginResponse.userInfo.userName;
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

app.post('/sample-search', (req, res) => {
	console.log('app.js receiving query for SAMPLE data');
	const sampleData = new Boolean(true);
	// console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	console.log(`req.url: ${req.url}`);

	// using sample data for now...

	const imdbSearchData = require('./tmp/imdb-search-sample.json');
	// const tmdbSearchData = require('./json/tmdb-search-sample.json');

	(function saveListState() {
		fs.writeFile(
			'./tmp/movie-list-state.json',
			JSON.stringify(imdbSearchData),
			(err) => {
				console.log(err);
			}
		);
	})();

	console.log('req.session on following line:');
	console.dir(req.session);

	res.render('pages/index.ejs', {
		searchQuery: imdbSearchData.expression,
		detailsLink: sampleData == true ? '/sample-details' : '/details',
		imdbSearchData: imdbSearchData,
		req: req,
	});
});

///////////////////////////////////////////////////////// Searching movies...

app.post('/query-search', async (req, res) => {
	const query = req.body.query;
	console.log('req.body on next line:');
	console.dir(req.body);
	console.log(`app.js: receiving query for movie name ${query}`);
	const sampleData = new Boolean(false);
	// console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

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

		(function saveListState() {
			fs.writeFile(
				'./tmp/movie-list-state.json',
				JSON.stringify(imdbSearchData),
				(err) => {
					console.log(err);
				}
			);
		})();

		res.render('pages/index.ejs', {
			searchQuery: imdbResponse.expression,
			detailsLink: sampleData == true ? '/sample-details' : '/details',
			imdbSearchData: imdbSearchData,
			req: req,
		});
	}
});

///////////////////////////////////////////// Getting movie details using SAMPLE data

app.get('/sample-details', async (req, res) => {
	console.log('app.js: /sampleDetails accessed!');
	const sampleData = new Boolean(true);
	// console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	const { query, pathname } = url.parse(req.url, true);
	const imdbID = JSON.stringify(query.id);
	console.log(`imdbID: ${imdbID}`);

	/////// next we should do api calls with imdbID and watchmode, but we will use sample data for now:
	const imdbTitleData = require('./tmp/imdb-title-sample.json');
	const watchmodeSourcesData = require('./tmp/watchmode-sources-sample.json');

	const movieSources = sourceHandler(watchmodeSourcesData);

	let movieData = {
		imdbID: imdbID,
		movieTitle: imdbTitleData.title,
		movieYear: imdbTitleData.year,
		contentRating: imdbTitleData.contentRating,
		moviePoster: imdbTitleData.image,
		movieSummary: imdbTitleData.plot,
		imdbRating: imdbTitleData.imDbRating,
		metacriticRating: imdbTitleData.metacriticRating,
		movieBudget: imdbTitleData.boxOffice.budget,
		movieGross: imdbTitleData.boxOffice.cumulativeWorldwideGross,
		moviePurchaseArray: movieSources.purchaseSources,
		movieRentArray: movieSources.rentalSources,
		movieStreamingArray: movieSources.streamingSources,
	};

	// console.log('movieData on following line:');
	// console.dir(movieData);

	let imdbSearchData = JSON.parse(
		fs.readFileSync('./tmp/movie-list-state.json')
	);
	// console.log(`imdbSearchData: ${imdbSearchData}`);

	(function saveState() {
		fs.writeFile(
			'./tmp/movie-data-state.json',
			JSON.stringify(movieData),
			(err) => {
				console.log(err);
			}
		);
	})();

	console.log('req.session on following line:');
	console.dir(req.session);

	res.render('pages/index.ejs', {
		imdbSearchData: imdbSearchData,
		movieData: movieData,
		detailsLink: sampleData == true ? '/sample-details' : '/details',
		req: req,
	});
});

///////////////////////////////////////////// Getting movie details

app.get('/details', async (req, res) => {
	const sampleData = new Boolean(false);
	// console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = query.id;
	console.log(`/details: receiving query for imdbID ${imdbID}`);

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
			metacriticRating: movieDataResponse.imdbTitleData.metacriticRating,
			movieBudget: movieDataResponse.imdbTitleData.boxOffice.budget,
			movieGross:
				movieDataResponse.imdbTitleData.boxOffice
					.cumulativeWorldwideGross,
			moviePurchaseArray: movieSources.purchaseSources,
			movieRentArray: movieSources.rentalSources,
			movieStreamingArray: movieSources.streamingSources,
		};

		/////////// loading movie-list state from temporary files:
		let imdbSearchData = JSON.parse(
			fs.readFileSync('./tmp/movie-list-state.json')
		);

		(function saveState() {
			fs.writeFile(
				'./tmp/movie-data-state.json',
				JSON.stringify(movieData),
				(err) => {
					console.log(err);
				}
			);
		})();

		res.render('pages/index.ejs', {
			imdbSearchData: imdbSearchData,
			movieData: movieData,
			detailsLink: sampleData == true ? '/sample-details' : '/details',
			req: req,
		});
	}
});

////////////////////////////// Adding a movie to a user's list:

app.post('/add-movie', (req, res) => {
	console.log(req.url);
	console.log('req.session on following line:');
	console.dir(req.session);

	//////////////// read the movie data state from TMP folder
	let movieData = JSON.parse(fs.readFileSync('./tmp/movie-data-state.json'));

	///////////////////// building function to add movieData to MYSQL table user_movies
	function addMovie(movieData) {
		console.log(`addMovie() fired, movieData.imdbID = ${movieData.imdbID}`);
		//////////// taking movieData object, and cutting it into an array that contains just the movie's info without source data
		function makeMovieArr(movieData) {
			let movieArr = [];

			for (let i in movieData) movieArr.push(movieData[i]);
			const movieInfoArr = movieArr
				.slice(0, -3)
				.concat(req.session.userid);

			return movieInfoArr;
		}

		///////////// taking movieData object, and cutting it into an array that contains only the SOURCES info, without any other movie data...
		function makeSourcesArr(movieData) {
			// let sourcesArr = [];
			let purchaseArr = [];
			let rentalArr = [];
			let streamingArr = [];
			let finalArr = [];

			for (let i in movieData.moviePurchaseArray)
				purchaseArr.push(
					Object.values(movieData.moviePurchaseArray[i])
				);

			for (let i in movieData.movieRentArray)
				rentalArr.push(Object.values(movieData.movieRentArray[i]));

			for (let i in movieData.movieStreamingArray)
				streamingArr.push(
					Object.values(movieData.movieStreamingArray[i])
				);

			const sourcesArr = purchaseArr
				.concat(rentalArr)
				.concat(streamingArr);

			for (let i in sourcesArr) {
				let source = sourcesArr[i]
					.filter(
						(entry) =>
							entry !== 'Deeplinks available for paid plans only.'
					)
					.slice(0, -2);
				source.unshift(movieData.imdbID);

				finalArr.push(source);
			}

			return finalArr;
		}

		const movieInfoArr = makeMovieArr(movieData);
		const movieSourcesArr = makeSourcesArr(movieData);

		console.log('movieInfoArr:');
		console.dir(movieInfoArr);

		const movieInfoQuery =
			'INSERT INTO user_movies (imdbID, movie_title, release_year, content_rating, movie_poster, movie_summary, imdb_rating, metacritic_rating, movie_budget, movie_gross, users_selected) VALUES (?);';
		const movieSourcesQuery =
			'INSERT INTO movie_sources (imdbID, source_id, source_name, source_type, region, web_url, format, price) VALUES ?;';

		//////////// pushing movie info to MYSQL table user_movies:
		connection.query(
			movieInfoQuery,
			[movieInfoArr],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
				}
				console.log(JSON.stringify(results));
			}
		);

		//////////// pushing movie sources info to MYSQL table movie_sources:
		connection.query(
			movieSourcesQuery,
			[movieSourcesArr],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
				}
				console.log(JSON.stringify(results));
			}
		);
	}

	//////////////// buidling function to add sources info to MYSQL table 'movie_sources'
	function addSources(movieData) {
		const movieSourcesArr = [];

		console.log('movieSourcesArr:');
		console.dir(movieSourcesArr);

		const query = '';
		let values = [movieSourcesArr];
		connection.query(
			query,
			[movieSourcesArr],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
				}
				console.log(JSON.stringify(results));
			}
		);
	}

	/////////////// building function to add userid to MYSQL movie row
	function addUserId(imdbid, userid) {
		connection.query(
			'UPDATE user_movies SET users_selected = CONCAT(users_selected, ?) WHERE imdbID = ?;',
			[userid, imdbid],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
				}
				console.log(JSON.stringify(results));
			}
		);
	}

	////////////////// see if this movie is stored in user_movies already
	connection.query(
		'SELECT * FROM user_movies WHERE imdbID = ?',
		movieData.imdbID,
		function (error, results, fields) {
			///////////// if it is, just add the current user's userid to it
			if (results && results.length > 0) {
				console.log(results);

				addUserId(movieData.imdbID, req.body.userid);

				//////////////// if NOT, add the MOVIE and SOURCES info, with current user's id, to MYSQL tables: user_movies and movie_sources
			} else if (!results || results.length == 0) {
				addMovie(movieData);
			}
		}
	);

	// console.log(movieData);

	res.redirect('/');
});

module.exports = app;
