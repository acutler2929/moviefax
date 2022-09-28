'use strict';

const fs = require('fs');

////////////////// checking if user dir exists, and creating it if it doesn't

// const checkDir = function (userID) {
// 	const userDir = fs.existsSync(`./tmp/user-${userID}`);

// 	if (userDir == true) {
// 		return;
// 	} else if (userDir == false) {
// 		fs.mkdirSync(`./tmp/user-${userID}`);
// 		return;
// 	}
// };

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
/*

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
		console.log(
			`stateHandler.js: saved movie DATA state for userID: ${userID}`
		);
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
		console.log(
			`stateHandler.js: saved movie SEARCH state for userID: ${userID}`
		);
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
		console.log(
			`stateHandler.js: saved user LIST state for userID: ${userID}`
		);
	} catch (error) {
		console.log(error);
	}
};

///////////////// LOADING state from tmp folder
exports.loadMovieDataState = function (userID) {
	let results;
	let stateFile = `./tmp/user-${userID}/movie-data-state.json`;
	/////// checking if directory exists, and creaing it if it doesn't
	checkDir(userID);
	///////////// checking if file exists, and exiting if it doesn't
	if (fs.existsSync(stateFile) == false) {
		return;
	} else {
		try {
			results = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
			console.log(
				`stateHandler.js: loaded movie DATA state for userID: ${userID}`
			);
			return results;
		} catch (error) {
			console.log(error);
		}
		return results;
	}
};

exports.loadSearchState = function (userID) {
	let results;
	let stateFile = `./tmp/user-${userID}/movie-data-state.json`;
	/////// checking if directory exists, and creaing it if it doesn't
	checkDir(userID);
	///////////// checking if file exists, and exiting if it doesn't
	if (fs.existsSync(stateFile) == false) {
		return;
	} else {
		try {
			results = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
			console.log(
				`stateHandler.js: loaded SEARCH state for userID: ${userID}`
			);
			return results;
		} catch (error) {
			console.log(error);
		}
		return results;
	}
};

exports.loadUserListState = function (userID) {
	let results;
	let stateFile = `./tmp/user-${userID}/movie-data-state.json`;
	/////// checking if directory exists, and creaing it if it doesn't
	checkDir(userID);
	///////////// checking if file exists, and exiting if it doesn't
	if (fs.existsSync(stateFile) == false) {
		return;
	} else {
		try {
			let results = JSON.parse(
				JSON.parse(fs.readFileSync(stateFile, 'utf-8'))
			);
			console.log(
				`stateHandler.js: loaded user LIST state for userID: ${userID}`
			);
			return results;
		} catch (error) {
			console.log(error);
		}
		return results;
	}
};
*/

/////////////////////// Building classes to store movie data and lists... ///////////////////////////////////////////////////
//////////// still haven't made up my mind about using this... //////////////////////////////////////////////////////////////

class MovieDataState {
	constructor(movieData, movieSources) {
		this.movieData = movieData;
		this.movieSources = movieSources;
	}

	overWrite(newData, newSources) {
		this.movieData = {};
		this.movieSources = [];
		this.movieData = newData;
		newSources.forEach((source) => this.movieSources.push(source));
	}
}

class MovieSearchState {
	constructor(searchData) {
		this.searchData = searchData;
	}

	overWrite(newData) {
		this.searchData = [];
		newData.forEach((movie) => this.searchData.push(movie));
	}
}

class UserListState {
	constructor(listData) {
		this.listData = listData;
	}

	addMovie(movieData) {
		this.listData.push(movieData);
	}

	dropMovie(imdbID) {
		const index = this.listData.indexOf(imdbID);
		if (index > -1) {
			// only splice array when item is found
			array.splice(index, 1); // 2nd parameter means remove one item only
		}
	}

	overWrite(newData) {
		this.listData = [];
		newData.forEach((movie) => this.listData.push(movie));
	}
}

///////////// DEFAULT starting off with empty state variables:

let movieDataState = new MovieDataState();
let movieSearchState = new MovieSearchState();
let userListState = new UserListState();

module.exports = {
	movieDataState: movieDataState,
	movieSearchState: movieSearchState,
	userListState: userListState,
};
