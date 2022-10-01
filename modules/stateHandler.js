'use strict';

/////////////////////// Building classes to store movie data and lists... /////////////////////////

class MovieDataState {
	constructor(isSaved, movieData, movieSources) {
		this.isSaved = isSaved;
		this.movieData = movieData;
		this.movieSources = movieSources;
	}

	overWrite(newSaveStatus, newData, newSources) {
		this.isSaved = newSaveStatus;
		this.movieData = {};
		this.movieSources = [];
		this.movieData = newData;
		this.movieSources = newSources;
	}
}

class MovieSearchState {
	constructor(searchData) {
		this.searchData = searchData;
	}

	overWrite(newData) {
		this.searchData = {};
		this.searchData = newData;
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
