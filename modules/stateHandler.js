'use strict';

const fs = require('fs');

/////////////////// SAVING state
exports.saveMovieDataState = function (data) {
	try {
		fs.writeFile(
			'./tmp/movie-data-state.json',
			JSON.stringify(data),
			(err) => {
				console.log(err);
			}
		);
		console.log('stateHandler.js: saved movie data state');
	} catch (error) {
		console.log(error);
	}
};

exports.saveSearchState = function (data) {
	try {
		fs.writeFile(
			'./tmp/movie-search-state.json',
			JSON.stringify(data),
			(err) => {
				console.log(err);
			}
		);
		console.log('stateHandler.js: saved movie search state');
	} catch (error) {
		console.log(error);
	}
};

exports.saveUserListState = function (data) {
	try {
		fs.writeFile(
			'./tmp/user-list-state.json',
			JSON.stringify(data),
			(err) => {
				console.log(err);
			}
		);
		console.log('stateHandler.js: saved user list state');
	} catch (error) {
		console.log(error);
	}
};

///////////////// LOADING state
exports.loadMovieDataState = function () {
	try {
		fs.readFileSync('./tmp/movie-data-state.json');
		console.log('stateHandler.js: loaded movie data state');
	} catch (error) {
		console.log(error);
	}
};

exports.loadSearchState = function () {
	try {
		fs.readFileSync('./tmp/movie-search-state.json');
		console.log('stateHandler.js: loaded search state');
	} catch (error) {
		console.log(error);
	}
};

exports.loadUserListState = function () {
	try {
		fs.readFileSync('./tmp/user-list-state.json');
		console.log('stateHandler.js: loaded user list state');
	} catch (error) {
		console.log(error);
	}
};
