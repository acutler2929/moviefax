'use strict';

const submitButton = document.getElementById('search-button');

async function searchMovies() {
	let movieData;
	const query = document.getElementById('search-query').value;
	console.log(`search button clicked with entry ${query}`);
	let response = await fetch('/getQuery', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	});
	movieData = await response.json();
	console.log(movieData);
}

// async function searchMovies() {
// 	let movieData;
// 	const query = document.getElementById('search-query').value;
// 	console.log(`search button clicked with entry ${query}`);
// 	let response = await fetch(
// 		`https://imdb-api.com/en/API/SearchMovie/${apiKey}/${query}`
// 	);
// 	movieData = await response.json();
// 	console.log(movieData);
// }

submitButton.onclick = searchMovies;
