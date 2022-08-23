'use strict';

const movieState = require('./tmp/movie-data-state.json');

function makeMovieArr(movieData) {
	let movieArr = [];

	for (let i in movieData) movieArr.push(movieData[i]);
	const movieInfoArr = movieArr.slice(0, -3).concat(7);

	return movieInfoArr;
}

function makeSourcesArr(movieData) {
	// let sourcesArr = [];
	let purchaseArr = [];
	let rentalArr = [];
	let streamingArr = [];

	for (let i in movieData.moviePurchaseArray)
		purchaseArr.push(movieData.moviePurchaseArray[i]);

	for (let i in movieData.movieRentArray)
		rentalArr.push(movieData.movieRentArray[i]);

	for (let i in movieData.movieStreamingArray)
		streamingArr.push(movieData.movieStreamingArray[i]);

	const sourcesArr = purchaseArr.concat(rentalArr).concat(streamingArr);

	return sourcesArr;
}

// console.log(makeMovieArr(movieState));

console.log(makeSourcesArr(movieState));
