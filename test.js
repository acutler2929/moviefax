'use strict';

let movieState = require('./tmp/movie-data-state.json');
let movieSearchState = require('./tmp/movie-search-state.json');
let userListState = require('./tmp/user-list-state.json');

let imdbID = 'tt0076759'; // <-- this is the imdb id for star wars
let otherImdbID = 'xxxxxxxxx'; // <-- obviously NOT star wars

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

let savedList = JSON.parse(userListState);

function isMovieSaved(imdbID, savedList) {
	let result = new Boolean(true);
	let imdbList = [];
	for (let i in savedList) {
		imdbList.push(savedList[i].imdb_id);
	}
	// console.log(imdbList);
	result = imdbList.includes(imdbID) ? true : false;

	if (result == true) {
		console.log('movie data IS stored in MYSQL, retrieving it now...');
	} else {
		console.log(
			'movie data IS NOT stored in MYSQL, starting an api call...'
		);
	}

	return result;
}

// console.log(makeMovieArr(movieState));

// console.log(makeSourcesArr(movieState));

// console.log(`userListState is a ${typeof userListState}, here it is:`); <--- JSON STRING
// console.log(userListState);
console.log(`savedList is a ${typeof savedList}, here is the first entry:`);
console.log(savedList[0]);

console.log('now, here is the product of isMovieSaved():');
console.log(isMovieSaved(imdbID, savedList));
console.log(isMovieSaved(otherImdbID, savedList));
