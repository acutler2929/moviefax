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

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('frontend'));

app.post('/querySearch', async (req, res) => {
	const query = req.body.query;
	console.log(`app.js: receiving query for movie name ${query}`);

	// imdbResponse comes back from api Handler...
	// const imdbResponse = await apiHandler.searchMovieData(query);
	// console.log(
	// 	`app.js: received imdbResponse for movie ${imdbResponse[0].title}`
	// );

	// using sample data for now...
	const imdbSearchData = require('./templates/json/imdb-search-sample.json');

	const htmlSearchData = await dataHandler.insertSearchResults(
		imdbSearchData
	);

	// const htmlSearchData = await dataHandler.insertSearchResults(imdbResponse);
	// console.log(htmlSearchData[0]);

	// res.send(imdbResponse);
	res.send(htmlSearchData);
});

app.get('/details', async (req, res) => {
	console.log('app.js: /details accessed!');
	const { query, pathname } = url.parse(req.url, true);
	// console.dir(query);
	// console.dir(pathname);
	const imdbID = JSON.stringify(query.id);
	console.log(`imdbID: ${imdbID}`);

	/////// next we should do api calls with imdbID, but we will use sample data for now:
	const imdbTitleData = require('./templates/json/imdb-title-sample.json');
	const watchmodeSourcesData = require('./templates/json/watchmode-sources-sample.json');

	const fullSampleData = JSON.stringify({
		imdbTitleData,
		watchmodeSourcesData,
	});

	const output = dataHandler.replaceData(movieDataTemplate, fullSampleData);
	// console.log(output);

	res.send(output);

	// res.sendFile(path.join(__dirname, '/templates/html/movie-data.html'));
});

// app.post('/movieData', async (req, res) => {
// 	const imdbID = req.body.imdbID;
// 	console.log(
// 		`receiving query for imdbID ${imdbID}- but is actually Star Wars test data...`
// 	);

// movieDataResponse comes back from api Handler...
// const movieDataResponse = await apiHandler.selectedMovieData(imdbID);
// console.log(`app.js movieDataResponse: ${movieDataResponse}`);

///////// using sample data for now:
// const imdbTitleData = require('./templates/json/imdb-title-sample.json');
// const watchmodeSourcesData = require('./templates/json/watchmode-sources-sample.json');

// const fullSampleData = JSON.stringify({
// 	imdbTitleData,
// 	watchmodeSourcesData,
// });

// console.log(`app.js: fullSampleData is a ${typeof fullSampleData}`);

// console.log(
// 	`app.js: this is the sample data after parsing: ${
// 		JSON.parse(fullSampleData).imdbTitleData.fullTitle
// 	}`
// );

// const htmlMovieData = await dataHandler.insertSelectedMovie(fullSampleData);

// res.send(htmlMovieData);

// res.send(movieDataTemplate);
// });

module.exports = app;
