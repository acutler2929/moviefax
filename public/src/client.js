'use strict';

////////// checking if the page is 'index' (if there is no loginMessage, then we are in 'index', not 'login')
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

///////////////// listening to the server:
// const fromServer = fetch('http://localhost:8888/', {}).then((res) => {
// 	return res.body;
// });

// console.log(fromServer);

// fetch('http://localhost:8888/')
// 	.then((data) => data.json())
// 	.catch((error) => console.log(error));
