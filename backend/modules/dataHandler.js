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
				<a href="/details?id=${imdbID[i]}">
				<div id="${imdbID[i]}" class="data-wrapper container-fluid text-center">
					<h6 class="search-title align-middle">${searchTitle[i]}</h6>
					<img class="search-images" src="${searchImage[i]}" />
					<p class="search-description align-middle"><small>${searchDescription[i]}</small></p>
				</div>
				<div id="data-${searchTitle[i]}" class="container-fluid hidden">
					
					
				</div>
				</a>
			</li>
        `);

		return movieSearchMarkup;
	});

	// console.log(movieSearchMarkup);
	return movieSearchMarkup;
};

/////////////// data to display selected movie:
// exports.insertSelectedMovie = async function (data) {
// 	console.log('dataHandler.js: insertSelectedMovie() fired....');
// 	// console.log(`dataHandler.js: ${JSON.stringify(data, null, 2)}`);
// 	const apiResponse = JSON.parse(data);
// 	console.log(
// 		`dataHandler.js: apiResponse is a ${typeof apiResponse} after parsing`
// 	);

// 	const insertImdbData = async function (JSONObj) {
// 		const summary = JSONObj.imdbTitleData.plot;
// 		const popularity = JSONObj.imdbTitleData.metacriticRating;
// 		const movieDataMarkup = `
// 		<div class="container-lg summary-pop-wrapper">
// 			<div class="container-lg text-left movie-summary">
// 				<p><small>${summary}</small></p>
// 			</div>
// 			<div class="container-lg popularity">
// 				<p>${popularity}</p>
// 			</div>
// 		</div>
// 		`;

// 		return movieDataMarkup;
// 	};

// 	const dataMarkup = await insertImdbData(apiResponse);
// 	// const offersMarkup = await insertWatchmodeData(apiResponse);

// 	const fullMarkup = JSON.stringify(dataMarkup.concat(offersMarkup));

// 	// console.log(`dataHandler.js: fullMarkup: ${fullMarkup}`);

// 	return fullMarkup;
// };

exports.replaceData = function (html, data) {
	const input = JSON.parse(data);
	const sources = input.watchmodeSourcesData;

	const purchaseSources = sources.filter((source) => source.type === 'buy');
	const rentalSources = sources.filter((source) => source.type === 'rent');
	const streamingSources = sources.filter((source) => source.type === 'sub');

	// console.log(streamingSources);

	let purchaseArray = [];
	let rentalArray = [];
	let streamingArray = [];

	purchaseSources.forEach((source) => {
		purchaseArray.push(`
			<li class="purchase-source">
				<a href="${source.web_url}">${source.name}, ${source.format} from ${source.price}</a>
			</li>
		`);
		return purchaseArray;
	});

	rentalSources.forEach((source) => {
		rentalArray.push(`
			<li class="rental-source">
				<a href="${source.web_url}">${source.name}, ${source.type} ${source.format} from ${source.price}</a>
			</li>
		`);
		return rentalArray;
	});

	streamingSources.forEach((source) => {
		streamingArray.push(`
			<li class="streaming-source">
				<a href="${source.web_url}">${source.name}, ${source.format}</a>
			</li>
		`);
		return streamingArray;
	});

	const purchaseMarkup = purchaseArray.join('');
	const rentalMarkup = rentalArray.join('');
	const streamingMarkup = streamingArray.join('');

	let output = html.replace(/{%MOVIETITLE%}/g, input.imdbTitleData.title);
	output = output.replace(/{%MOVIEPOSTER%}/g, input.imdbTitleData.image);
	output = output.replace(/{%MOVIEYEAR%}/g, input.imdbTitleData.year);
	output = output.replace(/{%MOVIESUMMARY%}/g, input.imdbTitleData.plot);
	output = output.replace(/{%MOVIERATING%}/g, input.imdbTitleData.imDbRating);

	sources.forEach((source) => {
		// console.log(source);
		if (source.type === 'buy') {
			output = output.replace(/{%MOVIEPURCHASE%}/g, purchaseMarkup);
		} else if (source.type === 'rent') {
			output = output.replace(/{%MOVIERENT%}/g, rentalMarkup);
		} else output = output.replace(/{%MOVIESTREAMING%}/g, streamingMarkup);
	});

	return output;
};
