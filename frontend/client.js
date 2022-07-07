'use strict';

const submitButton = document.getElementById('search-button');

async function searchMovies() {
	////////////// First, clear the content wrapper before inserting anything else:
	document.getElementById('search-results-wrapper').innerHTML = '';

	let movieSearchResults;

	const query = document.getElementById('search-query').value;
	// console.log(`search button clicked with entry ${query}`);

	let response = await fetch('/querySearch', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});

	movieSearchResults = await response.json();
	// console.log(movieSearchResults);

	movieSearchResults.forEach((entry) => {
		document
			.getElementById('search-results-wrapper')
			.insertAdjacentHTML('afterbegin', `${entry}`);
	});

	// const moviePreview = document.querySelectorAll('.movie-wrapper');

	// moviePreview.forEach((element) => {
	// 	element.addEventListener('click', async function showMovieData() {
	// 		// console.log(element);

	// 		// const movieSearchItem = element.children[0];
	// 		const imdbID = element.children[0].id;
	// 		const movieData = element.children[1];
	// 		console.log(
	// 			`showMovieData() fired at ${element.children[0].children[0].textContent}, imdb id: ${imdbID}`
	// 		);

	// const movieData = document.getElementById(`data-${element.id}`);
	// console.log(movieData);
	// console.log(element.childNodes);
	// console.log(element.children);

	/////////// Sending the movie name to the apiHandler through app.js...
	// let response = await fetch('/movieData', {
	// 	method: 'POST',
	// 	headers: { 'Content-Type': 'application/json' },
	// 	body: JSON.stringify({ imdbID }),
	// });

	// const movieDataResults = await response.json();
	// console.log(`client.js: markup received: ${movieDataResults}`);

	// movieData.classList.toggle('hidden');
	// movieData.classList.toggle('data-wrapper');
	// movieData.insertAdjacentHTML('afterbegin', `${movieDataResults}`);
	// element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
	// 	});
	// });
}

submitButton.onclick = searchMovies;
