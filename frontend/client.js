// 'use strict';

// const submitButton = document.getElementById('search-button');

// async function searchMovies() {
// 	////////////// First, clear the content wrapper before inserting anything else:
// 	document.getElementById('search-results-wrapper').innerHTML = '';

// 	let movieSearchResults;

// 	const query = document.getElementById('search-query').value;
// 	// console.log(`search button clicked with entry ${query}`);

// 	let response = await fetch('/querySearch', {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ query }),
// 	});

// 	movieSearchResults = await response.json();
// 	// console.log(movieSearchResults);

// 	movieSearchResults.forEach((entry) => {
// 		document
// 			.getElementById('search-results-wrapper')
// 			.insertAdjacentHTML('afterbegin', `${entry}`);
// 	});

// }

// submitButton.onclick = searchMovies;
