'use strict';

/////////////////////// Building classes to store movie data and lists... /////////////////////////

class MovieDataState {
	constructor(isSaved, movieData, movieSources) {
		this.isSaved = isSaved;
		this.movieData = movieData;
		this.movieSources = movieSources;
	}

	///////////////////// Getters
	get saveStatus() {
		return this.isSaved;
	}
	get currMovieData() {
		return this.movieData;
	}
	get currMovieSources() {
		return this.movieSources;
	}

	///////////// Setters
	set newSavedStatus(savedStatus) {
		this.isSaved = savedStatus;
	}
	set newMovieData(newData) {
		this.movieData = newData;
	}
	set newSources(newSources) {
		this.movieSources = newSources;
	}
}

class MovieSearchState {
	constructor(searchData) {
		this.searchData = searchData;
	}

	get currSearchData() {
		return this.searchData;
	}

	set newSearchData(newData) {
		this.searchData = newData;
	}
}

class UserListState {
	constructor(listData) {
		this.listData = listData;
	}

	get currUserList() {
		return this.listData;
	}

	set addMovie(movieData) {
		this.listData.push(movieData);
	}
	set dropMovie(imdbID) {
		const index = this.listData.indexOf(imdbID);
		if (index > -1) {
			// only splice array when item is found
			array.splice(index, 1); // 2nd parameter means remove one item only
		}
	}
	set newUserList(newData) {
		this.listData = [];

		let newDataArr = Object.values(newData);
		// console.log('here is newDataArr:');
		// console.dir(newDataArr);
		newDataArr.forEach((movie) => this.listData.push(movie));
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
