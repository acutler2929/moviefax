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
			<li class="container-fluid movie-wrapper">
				<div id="${imdbID[i]}" class="data-wrapper container-fluid text-center">
					<h6 class="search-title align-middle">${searchTitle[i]}</h6>
					<img class="search-images" src="${searchImage[i]}" />
					<p class="search-description align-middle"><small>${searchDescription[i]}</small></p>
				</div>
				<div id="data-${searchTitle[i]}" class="container-fluid hidden">
					
					
				</div>
			</li>
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

	let offersName = [];
	let offersURL = [];
	let offersFormat = [];
	let movieOffersMarkup = ``;

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
			<div class="container-lg text-left movie-summary">
				<p><small>${summary}</small></p>
			</div>
			<div class="container-lg popularity">
				<p>${popularity}</p>
			</div>
		</div>
		`;

		return movieDataMarkup;
	};

	const insertWatchmodeData = async function (JSONObj) {
		const sourcesArray = Object.entries(JSONObj.watchmodeSourcesData);
		sourcesArray.forEach((entry, i) => {
			// console.log(entry[1]);
			// console.log(`WATCHMODE ENTRY: ${entry[1].name}`);
			offersName.push(entry[1].name);
			offersURL.push(entry[1].web_url);
			offersFormat.push(entry[1].format);
			movieOffersMarkup += `
				<div class="source-offers">		
					<a href="${offersURL}">${offersName[i]} ${offersFormat[i]}</a>
				</div>	
			`;

			return movieOffersMarkup;
		});
		// console.log(`dataHandler.js movie offers: ${movieOffersMarkup}`);
		return movieOffersMarkup;
	};

	const dataMarkup = await insertImdbData(apiResponse);
	const offersMarkup = await insertWatchmodeData(apiResponse);

	const fullMarkup = JSON.stringify(dataMarkup.concat(offersMarkup));

	// console.log(`dataHandler.js: fullMarkup: ${fullMarkup}`);

	return fullMarkup;
};
