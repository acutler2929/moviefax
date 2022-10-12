'use strict';

/////////// This client-side js page is meant to program buttons on the index page to be able to toggle between movie search results / custom movie list on one side, and general movie info / movie source info on the other side

////////// checking if the page is 'index'
if (document.body.id === 'index') {
	console.log('we are on the index page');
	///////////// Toggling class "hidden" for the buttons above movie lists and movie info

	const listToggleBtn = document.querySelector('#toggle-list-button');
	const infoToggleBtn = document.querySelector('#toggle-movie-info-button');
	const searchResults = document.querySelector('#search-results-wrapper');
	const userMovieList = document.querySelector('#user-movies-wrapper');
	const movieInfoDisplay = document.querySelector('#poster-data-wrapper');
	const sourcesInfoDisplay = document.querySelector('#data-sources-wrapper');

	listToggleBtn.addEventListener('click', () => {
		console.log('toggling lists...');

		searchResults.classList.toggle('hidden');
		userMovieList.classList.toggle('hidden');
	});

	infoToggleBtn.addEventListener('click', () => {
		console.log('toggling info display...');

		movieInfoDisplay.classList.toggle('hidden');
		sourcesInfoDisplay.classList.toggle('hidden');
	});
} else if (document.body.id === 'login') {
	console.log('we are on the login page');
}

//////////////////////
//////// And this section toggles the layout of movies-content-wrapper depending on screen size. On larger screens, the scrolling list (containing custom list / search results) occupies the left of the screen on a Y axis. On smaller screens, the scrolling list sits atop selected movie data (but beneath the navbar) on an X axis

const viewWidth = Math.max(
	document.documentElement.clientWidth || 0,
	window.innerWidth || 0
);
const viewHeight = Math.max(
	document.documentElement.clientHeight || 0,
	window.innerHeight || 0
);

/////// this is the list-wrapper
const listWrapper = document.getElementById('list-wrapper');
const searchResultsWrapper = document.getElementById('search-results-wrapper');
const userMoviesWrapper = document.getElementById('user-movies-wrapper');

////// and this is the movie-data-wrapper
const movieDataWrapper = document.getElementById('movie-data-wrapper');

/////////////////// small screen portrait mode

if (viewWidth < 600) {
	listWrapper.classList.toggle('list-x-axis');
	searchResultsWrapper.classList.toggle('list-group-horizontal');
	userMoviesWrapper.classList.toggle('list-group-horizontal');
} else if (viewWidth >= 600) {
	listWrapper.classList.toggle('list-y-axis');
	searchResultsWrapper.classList.toggle('list-group');
	userMoviesWrapper.classList.toggle('list-group');
}
