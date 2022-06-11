'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.insertSearchResults = async function (apiResponse) {
	console.log(apiResponse);

	let searchTitle = [];
	let searchImage = [];
	let searchDescription = [];
	let searchMarkup = [];

	await apiResponse.forEach((entry, i) => {
		console.log(entry.title);
		searchTitle.push(entry.title);
		searchImage.push(entry.image);
		searchDescription.push(entry.description);
		searchMarkup.push(`
            <div class="search-results">
				<h2>${searchTitle[i]}</h2>
				<img class="search-images" src="${searchImage[i]}" />
				<p>${searchDescription[i]}</p>
            </div>
        `);

		return searchMarkup;
	});

	// console.log(searchMarkup);
	return searchMarkup;
};

/////////////// data to display selected movie:
exports.insertSelectedMovie = async function (apiResponse) {
	console.log(apiResponse);

	const moviePoster = '',
		title = '',
		year = '',
		description = '',
		popularity = '',
		markup = `
			<div id="movie-poster">
				<h2>{%MOVIEPOSTER%}</h2>
			</div>
			<div id="description-data">
				<div id="title-year">
					<h2>{%TITLE%}</h2>
					<p>{%YEAR%}</p>
				</div>
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
		`;

	let offers = [];

	await apiResponse.forEach((entry, i) => {
		offers.push(entry[i]);
	});
};
