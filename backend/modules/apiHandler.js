'use strict';

const axios = require('axios');

const imdbApiKey = process.env.IMDB_API_KEY;
const watchmodeApiKey = process.env.WATCHMODE_API_KEY;
// console.log('hello from apiHandler');

let searchData;
let imdbTitleData;
let watchmodeSourcesData;

exports.searchMovieData = async function (query) {
	console.log(`apiHandler.js: searching query ${query}`);
	await axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/${query}`)
		.then((res) => {
			// handle success
			searchData = res.data;
			return searchData;
		})
		.catch((err) => {
			// handle error
			console.log(err);
		})
		.then((res) => {
			// always executed
		});

	return searchData;
};

exports.selectedMovieData = async function (imdbID) {
	await axios
		.get(`https://imdb-api.com/en/API/Title/${imdbApiKey}/${imdbID}`)
		.then((res) => {
			// handle success
			imdbTitleData = res.data;
			return imdbTitleData;
		})
		.catch((err) => {
			// handle error
			console.log(err);
		});

	await axios
		.get(
			`https://api.watchmode.com/v1/title/${imdbID}/details/?apiKey=${watchmodeApiKey}`
		)
		.then((res) => {
			// handle success
			watchmodeSourcesData = res.data;
			return watchmodeSourcesData;
		})
		.catch((err) => {
			// handle error
			console.log(err);
		});

	return { imdbTitleData, watchmodeSourcesData };
};
