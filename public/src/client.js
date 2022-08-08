'use strict';

///////////// Toggling class "hidden"

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

/////////////// Password reset email alert:

const iforgotBtn = document.getElementById('iforgot-button');

iforgotBtn.addEventListener('click', () => {
	console.log('change password!');
	alert('Password change email has been sent!');
});
