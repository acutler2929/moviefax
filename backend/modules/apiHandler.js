'use strict';

const axios = require('axios');

const apiKey = process.env.API_KEY;
console.log(apiKey);

let movieData;

export function searchMovieData(query) {
	axios
		.get(`https://imdb-api.com/en/API/SearchMovie/${apiKey}/${query}`)
		.then((res) => {
			// handle success
			console.log(res);
		})
		.catch((err) => {
			// handle error
			console.log(err);
		})
		.then(() => {
			// always executed
		});
}
