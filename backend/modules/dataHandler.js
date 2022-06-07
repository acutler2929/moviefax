'use strict';

// console.log('hello from dataHandler!');

///////////// data to display Search Results:
exports.insertSearchResults = async function (apiResponse) {
	console.log(apiResponse);

	let title = [];
	let image = [];
	let description = [];
	let markup = [];

	await apiResponse.forEach((entry, i) => {
		console.log(entry.title);
		title.push(entry.title);
		image.push(entry.image);
		description.push(entry.description);
		markup.push(`
            <div class="search-results">
                <h2>${title[i]}</h2>
                <img class="search-images" src="${image[i]}" />
                <p>${description[i]}</p>
            </div>
        `);

		return markup;
	});

	// console.log(markup);
	return markup;
};

/////////////// data to display selected movie:
exports.insertSelectedMovie = async function (apiResponse) {};
