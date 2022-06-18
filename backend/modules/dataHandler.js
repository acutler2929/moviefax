'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.insertSearchResults = async function (apiResponse) {
	// console.log(`dataHandler.js: ${apiResponse}`);

	let searchTitle = [];
	let searchImage = [];
	let searchDescription = [];
	let imdbID = [];
	let description = [];
	let popularity = [];
	let offers = [];
	let markup = [];

	await apiResponse.forEach((entry, i) => {
		// console.log(entry.title);
		searchTitle.push(entry.title);
		searchImage.push(entry.image);
		searchDescription.push(entry.description);
		imdbID.push(entry.id);
		markup.push(`
			<div class="movie-wrapper">
				<div id="${imdbID[i]}" class="search-results">
					<h2>${searchTitle[i]}</h2>
					<img class="search-images" src="${searchImage[i]}" />
					<p>${searchDescription[i]}</p>
				</div>
				<div id="data-${searchTitle[i]}" class="hidden">
					<div id="description">
						<p>{%DESCRIPTION%}</p>
					</div>
					<div id="popularity">
						<p>{%POPULARITY%}</p>
					</div>
					<div class="offers">
						<p>{%OFFERS%}</p>
					</div>
				</div>
			</div>
        `);

		return markup;
	});

	// console.log(markup);
	return markup;
};

/////////////// data to display selected movie:
exports.insertSelectedMovie = async function (apiResponse) {
	console.log(apiResponse);

	await apiResponse.forEach((entry, i) => {
		offers.push(entry[i]);
	});
};
