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

app.post('/auth', async (req, res) => {
	const loginResponse = await loginHandler.auth(req, connection);

	console.log(
		`app.js: loginResponse received on following line: ${loginResponse}`
	);
	console.dir(loginResponse);

	if (loginResponse.loginStatus === true) {
		// Validate the user:
		req.session.loggedin = loginResponse.loginStatus;
		req.session.userName = loginResponse.userInfo.userName;
		req.session.userEmail = loginResponse.userInfo.email;
		console.log(req.session);

		console.log(
			`app.js: login successful for user ${req.session.userName}, email: ${req.session.userEmail}`
		);
		res.redirect('/');
	} else {
		// Or kick them back to the login page:
		req.session.loggedin = loginResponse.loginStatus;

		res.render('pages/login', {
			loginMessage: 'Invalid user name / password!',
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
		req.session.loggedin = registerResponse.loginStatus;
		req.session.userName = registerResponse.userInfo.userName;
		req.session.userEmail = registerResponse.userInfo.userEmail;
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

///////////////////////////////////////////////////////// Searching movies...

app.post('/sample-search', (req, res) => {
	console.log('app.js receiving query for SAMPLE data');
	const sampleData = new Boolean(true);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	console.log(`req.url: ${req.url}`);

	// using sample data for now...

	const imdbSearchData = require('./tmp/imdb-search-sample.json');
	// const tmdbSearchData = require('./json/tmdb-search-sample.json');

	(function saveState() {
		fs.writeFile(
			'./tmp/movie-list-state.json',
			JSON.stringify(imdbSearchData),
			(err) => {
				console.log(err);
			}
		);
	})();

	res.render('pages/index.ejs', {
		searchQuery: imdbSearchData.expression,
		detailsLink: sampleData == true ? '/sample-details' : '/details',
		imdbSearchData: imdbSearchData,
		req: req,
	});
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

		(function saveState() {
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

///////////////////////////////////////////// Getting movie details

app.get('/sample-details', async (req, res) => {
	console.log('app.js: /sampleDetails accessed!');
	const sampleData = new Boolean(true);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	const { query, pathname } = url.parse(req.url, true);
	const imdbID = JSON.stringify(query.id);
	console.log(`imdbID: ${imdbID}`);

	/////// next we should do api calls with imdbID and watchmode, but we will use sample data for now:
	const imdbTitleData = require('./tmp/imdb-title-sample.json');
	const watchmodeSourcesData = require('./tmp/watchmode-sources-sample.json');

	const movieSources = sourceHandler(watchmodeSourcesData);

	async function loadState() {
		console.log('loadState() fired');
		let imdbSearchData;
		let output;
		await new Promise((resolve, reject) => {
			fs.readFile('./tmp/movie-list-state.json', function (err, data) {
				if (err) {
					console.log(err);
					reject;
				} else {
					resolve((imdbSearchData = JSON.parse(data)));
				}
			});
		})
			.then((res) => {
				console.log('imdbSearchData coming back from loadState()');
				// console.log(res);
				output = res;

				return output;
			})
			.catch((err) => {
				console.log('loadState() Promise failed :(');
				// console.log(err);
				output = err;

				return output;
			});
	}

	imdbSearchData = await loadState();

	// imdbSearchData = await JSON.parse(
	// 	fs.readFile('./tmp/movie-list-state.json', (err) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 	})
	// );

	console.log(imdbSearchData);

	res.render('pages/index.ejs', {
		imdbSearchData: imdbSearchData,
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
		detailsLink: sampleData == true ? '/sample-details' : '/details',
		req: req,
	});
});

app.get('/details', async (req, res) => {
	let imdbSearchData;
	const sampleData = new Boolean(false);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);
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

		(function loadState() {
			fs.readFile('./tmp/movie-list-state.json', function (err, data) {
				imdbSearchData = JSON.parse(data);
			});
		})();

		res.render('pages/index.ejs', {
			imdbSearchData: imdbSearchData,
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
			detailsLink: sampleData == true ? '/sample-details' : '/details',
			req: req,
		});
	}
});

app.post('/add-movie', (req, res) => {
	console.log(req.url);

	res.redirect('/details');
});

module.exports = app;
