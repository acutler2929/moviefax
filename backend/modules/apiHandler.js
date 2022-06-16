'use strict';

const axios = require('axios');

const imdbApiKey = process.env.IMDB_API_KEY;
const watchmodeApiKey = process.env.WATCHMODE_API_KEY;
// console.log('hello from apiHandler');

let searchResults;

exports.searchMovieData = async function (query) {
	console.log(`apiHandler.js: searching query ${query}`);
	await axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/${query}`)
		.then((res) => {
			// handle success
			searchResults = JSON.stringify(res.data);
			return searchResults;
		})
		.catch((err) => {
			// handle error
			console.log(err);
		})
		.then((res) => {
			// always executed
		});

	// console.log(searchResults);
	return searchResults;
};

exports.selectedMovieData = async function (imdbID) {
	await axios
		.get(
			`https://api.watchmode.com/v1/search/?apiKey=${watchmodeApiKey}&search_field=name&search_value=${imdbID}&types=movie`
		)
		.then((res) => {
			// handle success
			movieResults = JSON.stringify(res.data);
			return movieResults;
		})
		.catch((err) => {
			// handle error
			console.log(err);
		});

	return movieResults;
};
