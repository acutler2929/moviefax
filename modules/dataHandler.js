'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.replaceSearchData = async function (html, data, sampleData) {
	console.log('dataHandler.js replaceSearchData() fired...');
	console.log(
		`dataHandler.js: sampleData is a ${typeof sampleData} ${sampleData}`
	);
	// console.log(`html is a ${typeof html}, here it is:`);
	// console.log(html);

	const input = data;
	const detailsLink = sampleData == true ? '/sample-details' : '/details';

	console.log(`dataHandler.js: detailsLink is ${detailsLink}`);

	let moviesMarkupArray = [];

	input.results.forEach((result) => {
		moviesMarkupArray.push(`
			<li class="container-fluid movie-wrapper">
				<a href="${detailsLink}?id=${result.id}">
		 			<div id="${result.id}" class="data-wrapper container-fluid text-center">
		 				<h6 class="search-title align-middle">${result.title}</h6>
		 				<img class="search-images" src="${result.image}" />
		 				<p class="search-description align-middle"><small>${result.description}</small></p>
		 			</div>
		 		</a>
		 	</li>
		`);

		return moviesMarkupArray;
	});

	const moviesMarkup = moviesMarkupArray.join('');

	let output = html.replace(/{%SEARCHQUERY%}/g, input.expression);
	output = output.replace(/{%SEARCHRESULTS%}/g, moviesMarkup);

	return output;
};

exports.replaceDetailData = function (html, data) {
	const input = data,
		sources = input.watchmodeSourcesData,
		purchaseSources = sources
			.filter((source) => source.type === 'buy')
			.filter(
				(source, i, self) =>
					i ===
					self.findIndex((el) => el.source_id === source.source_id)
			),
		rentalSources = sources
			.filter((source) => source.type === 'rent')
			.filter(
				(source, i, self) =>
					i ===
					self.findIndex((el) => el.source_id === source.source_id)
			),
		streamingSources = sources
			.filter((source) => source.type === 'sub')
			.filter(
				(source, i, self) =>
					i ===
					self.findIndex((el) => el.source_id === source.source_id)
			);

	let purchaseArray = [];
	let rentalArray = [];
	let streamingArray = [];

	purchaseSources.forEach((source) => {
		purchaseArray.push(`
			<li class="purchase-source">
				<a href="${source.web_url}">${source.name} from ${source.price}</a>
			</li>
		`);
		return purchaseArray;
	});

	rentalSources.forEach((source) => {
		rentalArray.push(`
			<li class="rental-source">
				<a href="${source.web_url}">${source.name} from ${source.price}</a>
			</li>
		`);
		return rentalArray;
	});

	streamingSources.forEach((source) => {
		streamingArray.push(`
			<li class="streaming-source">
				<a href="${source.web_url}">${source.name}</a>
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
	output = output.replace(/{%IMDBRATING%}/g, input.imdbTitleData.imDbRating);
	output = output.replace(
		/{%METACRITICRATING%}/g,
		input.imdbTitleData.metacriticRating
	);
	output = output.replace(
		/{%CONTENTRATING%}/g,
		input.imdbTitleData.contentRating
	);
	output = output.replace(
		/{%MOVIEBUDGET%}/g,
		input.imdbTitleData.boxOffice.budget
	);
	output = output.replace(
		/{%MOVIEGROSS%}/g,
		input.imdbTitleData.boxOffice.cumulativeWorldwideGross
	);

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
