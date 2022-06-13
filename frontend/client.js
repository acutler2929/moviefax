'use strict';

const submitButton = document.getElementById('search-button');

async function searchMovies() {
	////////////// First, clear the content wrapper before inserting anything else:
	document.getElementById('movie-data-wrapper').innerHTML = '';

	let movieSearchResults;

	const query = document.getElementById('search-query').value;
	// console.log(`search button clicked with entry ${query}`);

	let response = await fetch('/getQuery', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});
	movieSearchResults = await response.json();
	// console.log(movieSearchResults);

	movieSearchResults.forEach((entry) => {
		document
			.getElementById('movie-data-wrapper')
			.insertAdjacentHTML('afterbegin', `${entry}`);
	});

	let title = '';
	const searchResult = document.getElementById(`preview-${title}`);

	//////////// doesn't work for some reason:
	searchResult.onclick = () => {
		console.log('search result clicked');
	};
}

async function selectMovie() {
	console.log('selectMovie() fired');

	////////////// First, clear the content wrapper before inserting anything else:
	document.getElementById('movie-data-wrapper').innerHTML = '';

	let movieDataResults;

	//////////// THIS needs to be the NAME of the movie you clicked on:
	// const query = document.getElementsByClassName('search-results').value;
	console.log(`movie ${query} selected`);

	/////////// Sending the movie name to the apiHandler through app.js...
	let response = await fetch('/getQuery', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});
	movieDataResults = await response.json();
	// console.log(movieSearchResults);

	document
		.getElementById('movie-data-wrapper')
		.insertAdjacentHTML('afterbegin', `${movieDataResults}`);
}

submitButton.onclick = searchMovies;
