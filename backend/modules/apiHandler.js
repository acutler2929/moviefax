'use strict';

const axios = require('axios');

const apiKey = process.env.API_KEY;
// console.log('hello from apiHandler');

let searchResults;

exports.searchMovieData = async function (query) {
	console.log(`searching query ${query}`);
	await axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${apiKey}/${query}`)
		.then((res) => {
			// handle success
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

// exports.selectedMovieData = async function(title) {
// 	await axios.get(``).then((res) => {}).catch((err) => {console.log(err);})
// }
