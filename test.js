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
	let finalArr = [];

	for (let i in movieData.moviePurchaseArray)
		purchaseArr.push(Object.values(movieData.moviePurchaseArray[i]));

	for (let i in movieData.movieRentArray)
		rentalArr.push(Object.values(movieData.movieRentArray[i]));

	for (let i in movieData.movieStreamingArray)
		streamingArr.push(Object.values(movieData.movieStreamingArray[i]));

	const sourcesArr = purchaseArr.concat(rentalArr).concat(streamingArr);
	// console.log('sourcesArr:');
	// console.log(sourcesArr);

	for (let i in sourcesArr) {
		let source = sourcesArr[i]
			.filter(
				(entry) => entry !== 'Deeplinks available for paid plans only.'
			)
			.slice(0, -2);
		source.unshift('imdbID placeholder');

		finalArr.push(source);
	}

	return finalArr;
}

// console.log(makeMovieArr(movieState));

// console.log(makeSourcesArr(movieState));
