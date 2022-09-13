'use strict';

const fs = require('fs');

/////////////////// SAVING state to tmp folder
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

///////////////// LOADING state from tmp folder
exports.loadMovieDataState = function () {
	try {
		let results = JSON.parse(
			fs.readFileSync('./tmp/movie-data-state.json', 'utf-8')
		);
		console.log('stateHandler.js: loaded movie data state');
		return results;
	} catch (error) {
		console.log(error);
	}
	return results;
};

exports.loadSearchState = function () {
	try {
		let results = JSON.parse(
			fs.readFileSync('./tmp/movie-search-state.json', 'utf-8')
		);
		console.log('stateHandler.js: loaded search state');
		return results;
	} catch (error) {
		console.log(error);
	}
	return results;
};

exports.loadUserListState = function () {
	try {
		let results = JSON.parse(
			JSON.parse(fs.readFileSync('./tmp/user-list-state.json', 'utf-8'))
		);
		console.log('stateHandler.js: loaded user list state');
		return results;
	} catch (error) {
		console.log(error);
	}
	return results;
};

/////////////////////// Building classes to store movie data and lists...
//////////// still haven't made up my mind about using this...
/*
export class movieData {
	constructor(imdbId, name, salary) {
		this.imdbId = imdbId;
		this.name = name;
		this.salary = salary;
	}

	addToList() {
		this.salary += 100;
	}
}

export class movieList {
	constructor(id, name, salary) {
		this.id = id;
		this.name = name;
		this.salary = salary;
	}

	increaseSalary() {
		this.salary += 100;
	}
}
*/
