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

	const moviePreview = document.querySelectorAll('.movie-wrapper');

	moviePreview.forEach((element) => {
		element.addEventListener('click', function showMovieData() {
			console.log(`showMovieData() fired at ${element.id}`);

			// const movieData = document.getElementById(`data-${element.id}`);
			const movieData = element.children[1];
			// console.log(movieData);
			// console.log(element.childNodes);
			// console.log(element.children);

			movieData.classList.remove('hidden');
			element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		});
	});
}

submitButton.onclick = searchMovies;

/////////// Sending the movie name to the apiHandler through app.js...
// let response = await fetch('/getQuery', {
// 	method: 'POST',
// 	headers: { 'Content-Type': 'application/json' },
// 	body: JSON.stringify({ query }),
// });
// movieDataResults = await response.json();
// // console.log(movieSearchResults);

// document
// 	.getElementById('movie-data-wrapper')
// 	.insertAdjacentHTML('afterbegin', `${movieDataResults}`);
