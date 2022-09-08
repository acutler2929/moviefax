'use strict';

/////////////////////////// maybe I'll use this or maybe not...
let State = class {
	constructor(userId, userName, searchState, movieList, selectedMovie) {
		this.userId = userId;
		this.userName = userName;
		this.searchState = [];
		this.movieList = [];
		this.selectedMovie = selectedMovie;

		console.log(
			`New State class created for name: ${this.userName}, id: ${this.userId}`
		);
	}
	///////// GET stuff
	getUserId() {
		return this.userId;
	}

	getUserName() {
		return this.userName;
	}

	getSearchState() {
		return this.searchState;
	}

	getMovieList() {
		return this.movieList;
	}

	getSelectedMovie() {
		return this.selectedMovie;
	}
	////////////// SET stuff
	setUserId(id) {
		this.userId = id;
		return this;
	}

	setUserName(name) {
		this.userName = name;
		return this;
	}

	setSearchState(searchArr) {
		this.searchState = searchArr;
		return this;
	}

	addMovie(movieObj) {
		this.movieList.push(movieObj);
		return this;
	}

	deleteMovie(movieObj) {
		this.movieList.splice();
	}

	setCurrentMovie(movieObj) {
		this.selectedMovie = movieObj;
		return this;
	}
};

module.exports = stateHandler;
