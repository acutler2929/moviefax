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
	// const imdbResponse = await apiHandler.searchMovieData(query);
	// console.log(
	// 	`app.js: received imdbResponse for movie ${imdbResponse[0].title}`
	// );

	// using sample data for now...
	const imdbSearchData = require('./templates/imdb-search-sample.json');

	const htmlSearchData = await dataHandler.insertSearchResults(
		imdbSearchData
	);

	// const htmlSearchData = await dataHandler.insertSearchResults(imdbResponse);
	// console.log(htmlSearchData[0]);

	// res.send(imdbResponse);
	res.send(htmlSearchData);
});

app.post('/movieData', async (req, res) => {
	const imdbID = req.body.imdbID;
	console.log(
		`receiving query for imdbID ${imdbID}- but is actually Star Wars test data...`
	);

	// movieDataResponse comes back from api Handler...
	// const movieDataResponse = await apiHandler.selectedMovieData(imdbID);
	// console.log(`app.js movieDataResponse: ${movieDataResponse}`);

	///////// using sample data for now:
	const imdbTitleData = require('./templates/imdb-title-sample.json');
	const watchmodeSourcesData = require('./templates/watchmode-sources-sample.json');

	const fullSampleData = JSON.stringify({
		imdbTitleData,
		watchmodeSourcesData,
	});

	console.log(`app.js: fullSampleData is a ${typeof fullSampleData}`);

	console.log(
		`app.js: this is the sample data: ${
			JSON.parse(fullSampleData).imdbTitleData.fullTitle
		}`
	);

	const movieDataResponse = await dataHandler.insertSelectedMovie(
		fullSampleData
	);

	const htmlMovieData = await dataHandler.insertSelectedMovie(
		movieDataResponse
	);

	res.send(htmlMovieData);
});

module.exports = app;
