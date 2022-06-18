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
			// console.log(element);
			const imdbID = element.children[0].id;

			console.log(
				`showMovieData() fired at ${element.children[0].children[0].textContent}, imdb id: ${imdbID}`
			);

			// const movieData = document.getElementById(`data-${element.id}`);
			const movieData = element.children[1];
			// console.log(movieData);
			// console.log(element.childNodes);
			// console.log(element.children);

			/////////// Sending the movie name to the apiHandler through app.js...
			let response = fetch('/movieData', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ imdbID }),
			});
			movieDataResults = response.json();
			console.log(movieDataResults);

			movieData.classList.remove('hidden');
			element.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		});
	});
}

submitButton.onclick = searchMovies;

// document
// 	.getElementById('movie-data-wrapper')
// 	.insertAdjacentHTML('afterbegin', `${movieDataResults}`);
