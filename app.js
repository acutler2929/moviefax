'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql');
// const path = require('path');

/////////////////// Modules
const apiHandler = require('./modules/apiHandler');
const dataHandler = require('./modules/dataHandler');
const loginHandler = require('./modules/loginHandler');
const sourceHandler = require('./modules/sourceHandler');

////////////////// HTML page templates

const movieDataTemplate = fs.readFileSync(
	`${__dirname}/views/pages/movie-data.ejs`,
	'utf-8'
);

const movieListTemplate = fs.readFileSync(
	`${__dirname}/views/pages/movie-list.ejs`,
	'utf-8'
);

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

// app.use((req, res, next) => {
// 	// Greet stranger and show login button:
// 	let indexGreeting = 'Sign up to build your movie list...';

// 	// Verify login status
// 	indexGreeting = loginHandler.greeting(req);
// 	console.log(`loginHandler.greeting returned object:`);
// 	console.dir(indexGreeting);
// 	console.log(indexGreeting);

// 	next();
// });

let userName;
let userEmail;
let userPassword;

let loginMessage = 'Login to continue...';

app.get('/', (req, res) => {
	console.log('welcome to homepage');

	console.log(`req.url: ${req.url}`);
	// greetingMessage: loginStatus.greetingMessage,

	res.render('pages/index', {
		req: req,
	});
});

//////////////////////// Routes

/////////////////// Login module

app.get('/login-form', (req, res) => {
	console.log('app.js: /login-form fired');

	console.log(`req.url: ${req.url}`);

	res.render('pages/login', { loginMessage: loginMessage, req: req });
});

app.post('/login', async (req, res) => {
	const loginResponse = await loginHandler.login(req, connection);

	console.log(loginResponse);
	console.dir(loginResponse);

	console.log('am i being executed???');

	if (loginResponse.loginStatus === true) {
		console.log(
			`app.js: login successful for user ${loginResponse.userInfo.userName}, id: ${loginResponse.userInfo.userID}`
		);
		// Authenticate the user
		req.session.loggedin = true;
		req.session.userName = loginResponse.userInfo.userName;
		res.redirect('/');
	} else {
		res.render('pages/login', {
			loginMessage: loginResponse.loginMessage,
			req: req,
		});
	}
});

app.post('/register', (req, res) => {
	userName = req.body.newUserName;
	userEmail = req.body.newEmail;
	userPassword = req.body.newPassword;

	if (userName && userEmail && userPassword) {
		connection.query(
			'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
			[userName, userEmail, userPassword],
			function (error) {
				// If there is no error
				if (!error) {
					// Authenticate the user
					req.session.loggedin = true;
					req.session.username = userName;
					console.log(
						`app.js: /register new user: ${userName}, ${userEmail}, ${userPassword}`
					);
					// Redirect to home
					res.redirect('/');

					// If login info already exists, send appropriate error message
				} else if (error.code === 'ER_DUP_ENTRY') {
					loginMessage =
						'User name, email or password already exists!';

					res.render('pages/login', {
						loginMessage: loginMessage,
						req: req,
					});
				}
			}
		);
	}
});

app.get('/logout', (req, res) => {
	console.log('Logout button fired');

	req.session.loggedin = false;
	req.session.username = '';

	res.redirect('/');
});

////////////////////// Searching movies...

app.post('/sample-search', (req, res) => {
	console.log('app.js receiving query for SAMPLE data');
	const sampleData = new Boolean(true);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	console.log(`req.url: ${req.url}`);

	// using sample data for now...

	const imdbSearchData = require('./json/imdb-search-sample.json');
	// const tmdbSearchData = require('./json/tmdb-search-sample.json');

	res.render('pages/index.ejs', {
		searchQuery: imdbSearchData.expression,
		detailsLink: sampleData == true ? '/sample-details' : '/details',
		imdbSearchData: imdbSearchData,
		greetingMessage: loginStatus.greetingMessage,
		req: req,
	});

	// res.render('pages/movie-list', {
	// 	searchQuery: `"${req.body.query}"`,
	// 	detailsLink: sampleData == true ? '/sample-details' : '/details',
	// 	tmdbSearchData: tmdbSearchData,
	// });
});

app.post('/query-search', async (req, res) => {
	const query = req.body.query;
	console.log(`app.js: receiving query for movie name ${query}`);
	const sampleData = new Boolean(false);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

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

		res.render('pages/index.ejs', {
			searchQuery: imdbResponse.expression,
			detailsLink: sampleData == true ? '/sample-details' : '/details',
			imdbSearchData: imdbSearchData,
			greetingMessage: loginStatus.greetingMessage,
			req: req,
		});
	}
});

///////////////////////// Getting movie details

app.get('/sample-details', (req, res) => {
	console.log('app.js: /sampleDetails accessed!');
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = JSON.stringify(query.id);
	console.log(`imdbID: ${imdbID}`);

	/////// next we should do api calls with imdbID and watchmode, but we will use sample data for now:
	const imdbTitleData = require('./json/imdb-title-sample.json');
	const watchmodeSourcesData = require('./json/watchmode-sources-sample.json');

	const movieSources = sourceHandler(watchmodeSourcesData);

	res.render('pages/index.ejs', {
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
		greetingMessage: loginStatus.greetingMessage,
		req: req,
	});
});

app.get('/details', async (req, res) => {
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

		res.render('pages/index.ejs', {
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
			greetingMessage: loginStatus.greetingMessage,
			req: req,
		});
	}
});

module.exports = app;
