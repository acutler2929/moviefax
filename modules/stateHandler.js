'use strict';

const fs = require('fs');

////////////////// checking if user dir exists, and creating it if it doesn't

const checkDir = function (userID) {
	const userDir = fs.existsSync(`./tmp/user-${userID}`);

	if (userDir == true) {
		return;
	} else if (userDir == false) {
		fs.mkdirSync(`./tmp/user-${userID}`);
		return;
	}
};

/////////////// checking if user dir exists, and NOT LOADING it if it doesn't

// const checkReadDir = function (userID) {
// 	const userDir = fs.existsSync(`./tmp/user-${userID}`);

// 	if (userDir == true) {
// 		return;
// 	} else if (userDir == false) {
// 		fs.mkdirSync(`./tmp/user-${userID}`);
// 		return;
// 	}
// };

/////////////////// SAVING state to tmp folder
exports.saveMovieDataState = function (userID, data) {
	checkDir(userID);

	try {
		fs.writeFile(
			`./tmp/user-${userID}/movie-data-state.json`,
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

exports.saveSearchState = function (userID, data) {
	checkDir(userID);

	try {
		fs.writeFile(
			`./tmp/user-${userID}/movie-search-state.json`,
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

exports.saveUserListState = function (userID, data) {
	checkDir(userID);

	try {
		fs.writeFile(
			`./tmp/user-${userID}/user-list-state.json`,
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
exports.loadMovieDataState = function (userID) {
	checkDir(userID);

	try {
		let results = JSON.parse(
			fs.readFileSync(
				`./tmp/user-${userID}/movie-data-state.json`,
				'utf-8'
			)
		);
		console.log('stateHandler.js: loaded movie data state');
		return results;
	} catch (error) {
		console.log(error);
	}
	return results;
};

exports.loadSearchState = function (userID) {
	checkDir(userID);

	try {
		let results = JSON.parse(
			fs.readFileSync(
				`./tmp/user-${userID}/movie-search-state.json`,
				'utf-8'
			)
		);
		console.log('stateHandler.js: loaded search state');
		return results;
	} catch (error) {
		console.log(error);
	}
	return results;
};

exports.loadUserListState = function (userID) {
	checkDir(userID);

	try {
		let results = JSON.parse(
			JSON.parse(
				fs.readFileSync(
					`./tmp/user-${userID}/user-list-state.json`,
					'utf-8'
				)
			)
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
