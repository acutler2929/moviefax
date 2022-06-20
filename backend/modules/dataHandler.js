'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.insertSearchResults = async function (apiResponse) {
	// console.log(`dataHandler.js: ${apiResponse}`);

	let searchTitle = [];
	let searchImage = [];
	let searchDescription = [];
	let imdbID = [];
	let movieSearchMarkup = [];

	await apiResponse.forEach((entry, i) => {
		// console.log(entry.title);
		searchTitle.push(entry.title);
		searchImage.push(entry.image);
		searchDescription.push(entry.description);
		imdbID.push(entry.id);
		movieSearchMarkup.push(`
			<div class="movie-wrapper">
				<div id="${imdbID[i]}" class="search-results">
					<h2>${searchTitle[i]}</h2>
					<img class="search-images" src="${searchImage[i]}" />
					<p>${searchDescription[i]}</p>
				</div>
				<div id="data-${searchTitle[i]}" class="hidden">
					
					
				</div>
			</div>
        `);

		return movieSearchMarkup;
	});

	// console.log(movieSearchMarkup);
	return movieSearchMarkup;
};

/////////////// data to display selected movie:
exports.insertSelectedMovie = async function (apiResponse) {
	console.log(apiResponse);

	let offers = [];
	let movieOffersMarkup = [];

	const summary = apiResponse.imdbTitleData.plot;
	const popularity = apiResponse.imdbTitleData.metacriticRating;
	const movieDataMarkup = `
		<div class="movie-data-wrapper">
			<div class="movie-summary">
				<p>${summary}</p>
			</div>
			<div class="popularity">
				<p>${popularity}</p>
			</div>
		</div>
	`;

	await apiResponse.watchmodeSourcesData.forEach((entry, i) => {
		console.log(`WATCHMODE ENTRY: ${entry[i]}`);
		offers.push(entry[i].name);
		movieOffersMarkup.push(`
			<div id="${searchTitle[i]}-offers">		
				<p>${offers[i]}</p>
			</div>	
		`);
	});

	const fullMarkup = movieDataMarkup.concat(movieOffersMarkup);

	return fullMarkup;
};
