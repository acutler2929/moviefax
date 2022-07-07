'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const fs = require('fs');
const path = require('path');

const apiHandler = require('./modules/apiHandler.js');
const dataHandler = require('./modules/dataHandler');

const movieDataTemplate = fs.readFileSync(
	`${__dirname}/templates/html/movie-data.html`,
	'utf-8'
);
const movieListTemplate = fs.readFileSync(
	`${__dirname}/templates/html/movie-list.html`,
	'utf-8'
);

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('frontend'));

app.post('/sample-search', async (req, res) => {
	console.log('app.js receiving query for SAMPLE data');
	const sampleData = new Boolean(true);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	// using sample data for now...

	const imdbSearchData = require('./templates/json/imdb-search-sample.json');

	const output = await dataHandler.replaceSearchData(
		movieListTemplate,
		imdbSearchData,
		sampleData
	);

	res.send(output);
});

app.post('/query-search', async (req, res) => {
	const query = req.body.query;
	console.log(`app.js: receiving query for movie name ${query}`);
	const sampleData = new Boolean(false);
	console.log(`app.js: sample data is a ${typeof sampleData} ${sampleData}`);

	// imdbResponse comes back from api Handler...
	const imdbResponse = await apiHandler.searchMovieData(query);

	console.log(
		`app.js: received imdbResponse for movie ${imdbResponse.results[0].title}`
	);

	const output = await dataHandler.replaceSearchData(
		movieListTemplate,
		imdbResponse,
		sampleData
	);
	console.log(output[0]);

	res.send(output);
});

app.get('/sample-details', async (req, res) => {
	console.log('app.js: /sampleDetails accessed!');
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = JSON.stringify(query.id);
	console.log(`imdbID: ${imdbID}`);

	/////// next we should do api calls with imdbID, but we will use sample data for now:
	const imdbTitleData = require('./templates/json/imdb-title-sample.json');
	const watchmodeSourcesData = require('./templates/json/watchmode-sources-sample.json');

	const fullSampleData = JSON.stringify({
		imdbTitleData,
		watchmodeSourcesData,
	});

	const output = dataHandler.replaceDetailData(
		movieDataTemplate,
		fullSampleData
	);
	// console.log(output);

	res.send(output);

	// res.sendFile(path.join(__dirname, '/templates/html/movie-data.html'));
});

app.get('/details', async (req, res) => {
	const { query, pathname } = url.parse(req.url, true);
	const imdbID = JSON.stringify(query.id);
	console.log(`/details: receiving query for imdbID ${imdbID}`);

	// movieDataResponse comes back from api Handler...
	const movieDataResponse = await apiHandler.selectedMovieData(imdbID);
	// console.log(`app.js movieDataResponse: ${movieDataResponse}`);

	const output = await dataHandler.replaceDetailData(
		movieDataTemplate,
		movieDataResponse
	);

	res.send(output);
});

// app.post('/movieData', async (req, res) => {

// res.send(movieDataTemplate);
// });

module.exports = app;
