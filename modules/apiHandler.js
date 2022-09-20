'use strict';

const axios = require('axios');

const imdbApiKey = process.env.IMDB_API_KEY;
const watchmodeApiKey = process.env.WATCHMODE_API_KEY;
// console.log(`hello from apiHandler, imdbApiKey: ${imdbApiKey}`);

let searchData;
let imdbTitleData;
let watchmodeSourcesData;

exports.searchMovieData = async function (query) {
	console.log(`apiHandler.js: searchMovieData() query ${query}`);
	await axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/${query}`)
		.then((res) => {
			// handle success
			console.log('apiHandler.js: searchMovieData() calling imdb api...');
			searchData = res.data;
			return searchData;
		})
		.catch((err) => {
			// handle error
			console.log(`returning "ERROR": ${err.message}`);
			return { message: 'ERROR' };
		});

	return searchData;
};

exports.selectedMovieData = async function (imdbID) {
	console.log(`apiHandler.js: selectedMovieData() query ${imdbID}`);
	await axios
		.get(`https://imdb-api.com/en/API/Title/${imdbApiKey}/${imdbID}`)
		.then((res) => {
			// handle success
			console.log(
				'apiHandler.js: selectedMovieData() calling imdb api...'
			);
			imdbTitleData = res.data;
			return imdbTitleData;
		})
		.catch((err) => {
			// handle error
			console.log(`returning "ERROR": ${err.message}`);
			return { message: 'ERROR' };
		});

	await axios
		.get(
			`https://api.watchmode.com/v1/title/${imdbID}/sources/?apiKey=${watchmodeApiKey}`
		)
		.then((res) => {
			// handle success
			console.log(
				'apiHandler.js: selectedMovieData() calling watchmode api...'
			);
			watchmodeSourcesData = res.data;
			return watchmodeSourcesData;
		})
		.catch((err) => {
			// handle error
			console.log(`returning "ERROR": ${err.message}`);
			return { message: 'ERROR' };
		});

	const output = { imdbTitleData, watchmodeSourcesData };

	return output;
};
