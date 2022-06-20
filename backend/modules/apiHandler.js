'use strict';

const axios = require('axios');

const imdbApiKey = process.env.IMDB_API_KEY;
const watchmodeApiKey = process.env.WATCHMODE_API_KEY;
// console.log('hello from apiHandler');

let searchResults;
let movieResults;

exports.searchMovieData = async function (query) {
	console.log(`apiHandler.js: searching query ${query}`);
	await axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${imdbApiKey}/${query}`)
		.then((res) => {
			// handle success
			// searchResults = JSON.stringify(res.data.results);
			searchResults = res.data.results;
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
	///////// temporarily turned off so I don't burn through my api call limit with watchmode...
	// await axios
	// 	.get(
	// 		`https://api.watchmode.com/v1/title/${imdbID}/details/?apiKey=${watchmodeApiKey}`
	// 	)
	// 	.then((res) => {
	// 		// handle success
	// 		movieResults = res.data;
	// 		return movieResults;
	// 	})
	// 	.catch((err) => {
	// 		// handle error
	// 		console.log(err);
	// 	});

	/////////// let's use THIS data instead:

	// movieDataResults = ;

	return movieResults;
};
