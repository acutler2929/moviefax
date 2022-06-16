'use strict';

const axios = require('axios');

const apiKey = process.env.API_KEY;
// console.log('hello from apiHandler');

let searchResults;

exports.searchMovieData = async function (query) {
	console.log(`apiHandler.js: searching query ${query}`);
	await axios
		.get(
			`https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${query}&types=movie`
		)
		.then((res) => {
			// handle success
			searchResults = res.data.title_results[0];
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
