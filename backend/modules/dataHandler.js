'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.insertSearchResults = async function (apiResponse) {
	console.log('dataHandler.js insertSearchResults() fired...');
	// console.log(`dataHandler.js: ${apiResponse}`);

	let searchTitle = [];
	let searchImage = [];
	let searchDescription = [];
	let imdbID = [];
	let movieSearchMarkup = [];

	await apiResponse.results.forEach((entry, i) => {
		// console.log(entry.title);
		searchTitle.push(entry.title);
		searchImage.push(entry.image);
		searchDescription.push(entry.description);
		imdbID.push(entry.id);
		movieSearchMarkup.push(`
			<div class="container-lg movie-wrapper">
				<div id="${imdbID[i]}" class="preview-wrapper container-lg text-center">
					<h6 class="search-title">${searchTitle[i]}</h6>
					<img class="search-images" src="${searchImage[i]}" />
					<p class="search-description"><small>${searchDescription[i]}</small></p>
				</div>
				<div id="data-${searchTitle[i]}" class="movie-data-wrapper container-lg hidden">
					
					
				</div>
			</div>
        `);

		return movieSearchMarkup;
	});

	// console.log(movieSearchMarkup);
	return movieSearchMarkup;
};

/////////////// data to display selected movie:
exports.insertSelectedMovie = async function (data) {
	console.log('dataHandler.js: insertSelectedMovie() fired....');
	// console.log(`dataHandler.js: ${JSON.stringify(data, null, 2)}`);
	const apiResponse = JSON.parse(data);
	console.log(
		`dataHandler.js: apiResponse is a ${typeof apiResponse} after parsing`
	);

	let offers = [];
	let movieOffersMarkup = [];

	const insertImdbData = async function (JSONObj) {
		const summary = JSONObj.imdbTitleData.plot;
		const popularity = JSONObj.imdbTitleData.metacriticRating;
		// console.log(`dataHandler.js: plot: ${summary}`);
		// console.log(typeof summary);
		// console.log(`dataHandler.js: metacritic rating: ${popularity}`);
		// console.log(typeof popularity);
		// console.log(JSONObj.watchmodeSourcesData[0]);
		// console.log(`sourcesArray is a ${typeof sourcesArray}`);

		const movieDataMarkup = `
		<div class="container-lg summary-pop-wrapper">
			<div class="container-sm text-left movie-summary">
				<p><small>${summary}</small></p>
			</div>
			<div class="container-sm popularity">
				<p>${popularity}</p>
			</div>
		</div>
		`;

		return movieDataMarkup;
	};

	const insertWatchmodeData = async function (JSONObj) {
		const sourcesArray = Object.entries(JSONObj.watchmodeSourcesData);
		sourcesArray.map((entry, i) => {
			// console.log(entry[1]);
			// console.log(`WATCHMODE ENTRY: ${entry[1].name}`);
			offers.push(entry[1].name);
			movieOffersMarkup.push(`
			<div class="source-offers">		
			<span>${offers[i]}</span>
			</div>	
			`);

			return movieOffersMarkup;
		});

		return movieOffersMarkup;
	};

	const dataMarkup = await insertImdbData(apiResponse);
	const offersMarkup = await insertWatchmodeData(apiResponse);

	const fullMarkup = JSON.stringify(dataMarkup.concat(offersMarkup));

	// console.log(`dataHandler.js: fullMarkup: ${fullMarkup}`);

	return fullMarkup;
};
