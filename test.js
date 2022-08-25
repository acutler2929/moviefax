'use strict';

const movieState = require('./tmp/movie-data-state.json');

function makeMovieArr(movieData) {
	let movieArr = [];

	for (let i in movieData) movieArr.push(movieData[i]);
	const movieInfoArr = movieArr.slice(0, -3).concat(7);

	return movieInfoArr;
}

function makeSourcesArr(movieData) {
	let purchaseArr = [];
	let rentalArr = [];
	let streamingArr = [];
	let trimmedSources = [];
	let filteredSources = [];
	let finalArr = [];

	for (let i in movieData.moviePurchaseArray) {
		purchaseArr.push(Object.values(movieData.moviePurchaseArray[i]));
	}

	for (let i in movieData.movieRentArray) {
		rentalArr.push(Object.values(movieData.movieRentArray[i]));
	}

	for (let i in movieData.movieStreamingArray) {
		streamingArr.push(Object.values(movieData.movieStreamingArray[i]));
	}

	const sourcesArr = purchaseArr.concat(rentalArr).concat(streamingArr);

	for (let i in sourcesArr) {
		let source = sourcesArr[i]
			.filter(
				(entry) => entry !== 'Deeplinks available for paid plans only.'
			)
			.slice(0, -2);

		finalArr.push(source);
	}

	return finalArr;
}

// console.log(makeMovieArr(movieState));

console.log(makeSourcesArr(movieState));

/*
let arr = [
	24,
	'Amazon',
	'buy',
	'US',
	'Deeplinks available for paid plans only.',
	'Deeplinks available for paid plans only.',
	'https://watch.amazon.com/detail?gti=amzn1.dv.gti.70a9f750-16a3-4e79-b0ac-34745db98d51',
	'SD',
	12.99,
	null,
	null,
];

// let arr = Object.values(obj);

console.log(`is arr an array? ${Array.isArray(arr)}`);

console.log(arr);

let filteredArr = arr
	.filter((entry) => entry !== 'Deeplinks available for paid plans only.')
	.slice(0, -2);

console.log(filteredArr);
*/
