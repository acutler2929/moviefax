'use strict';

const fs = require('fs');

/***
 * implementation of readFileSync
 */
var data = fs.readFileSync('./tmp/movie-list-state.json');
console.log(data.toString());
console.log('Program Ended');

/***
 * implementation of readFile
 */
fs.readFile('./tmp/movie-list-state.json', function (err, data) {
	if (err) return console.error(err);
	console.log(data.toString());
});

console.log('Program Ended');

// async function loadState() {
// 	let promise = new Promise((res, rej) => {
// 		fs.readFileSync('./tmp/movie-list-state.json');
// 	});

// 	// wait until the promise returns us a value
// 	let imdbSearchData = await promise;

// 	// "Now it's done!"
// 	console.log(imdbSearchData);
// }
// loadState();

// console.log(loadState.imdbSearchData);

// async function loadState() {
// 	await JSON.parse(
// 		fs.readFileSync('./tmp/movie-list-state.json', (err) => {
// 			if (err) {
// 				console.log(`error: ${err}`);
// 				return;
// 			} else {
// 				return;
// 			}
// 		})
// 	);
// 	let imdbSearchData = await loadState();

// 	console.log(imdbSearchData);

// 	return;
// }

// loadState();

// console.log(loadState.imdbSearchData);

// // console.log(`imdbSearchData: ${imdbSearchData}`);

// // imdbSearchData = JSON.parse(fs.readFileSync('./tmp/movie-list-state.json'));
