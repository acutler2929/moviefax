'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const url = require('url');
// const fs = require('fs');

const apiHandler = require('./modules/apiHandler.js');
const dataHandler = require('./modules/dataHandler');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// const router = ;

app.use(express.static('frontend'));

app.post('/getQuery', async (req, res) => {
	const query = req.body.query;
	console.log(`app.js: receiving query for movie name ${query}`);

	// imdbResponse comes back from api Handler...
	const imdbResponse = await apiHandler.searchMovieData(query);
	// console.log(`app.js: ${imdbResponse}`);
	// console.log(
	// 	`this is the first one: ${
	// 		imdbResponse[0]
	// 	}, it is a ${typeof imdbResponse}`
	// );
	console.log(
		`app.js: received imdbResponse for movie ${imdbResponse[0].title}`
	);

	const htmlSearchData = await dataHandler.insertSearchResults(imdbResponse);
	// console.log(htmlSearchData[0]);

	// res.send(imdbResponse);
	res.send(htmlSearchData);
});

app.post('/movieData', async (req, res) => {
	const imdbID = req.body.imdbID;
	console.log(`receiving query for imdbID ${imdbID}`);

	// watchmodeResponse comes back from api Handler...
	const watchmodeResponse = await apiHandler.selectedMovieData(imdbID);
	console.log(`app.js watchmodeResponse: ${watchmodeResponse}`);

	const htmlMovieData = await dataHandler.insertSelectedMovie(
		watchmodeResponse
	);

	res.send(htmlMovieData);
});

module.exports = app;
