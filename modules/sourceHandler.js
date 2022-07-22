'use strict';

function replaceDetailData(data) {
	////////// Receiving an array of sources from watchmode
	const sources = data;

	////////////// Filtering sources by type: buy, rent or sub
	const purchaseSources = sources
		.filter((source) => source.type === 'buy')
		.filter(
			(source, i, self) =>
				i === self.findIndex((el) => el.source_id === source.source_id)
		);
	const rentalSources = sources
		.filter((source) => source.type === 'rent')
		.filter(
			(source, i, self) =>
				i === self.findIndex((el) => el.source_id === source.source_id)
		);
	const streamingSources = sources
		.filter((source) => source.type === 'sub')
		.filter(
			(source, i, self) =>
				i === self.findIndex((el) => el.source_id === source.source_id)
		);

	const output = { purchaseSources, rentalSources, streamingSources };

	return output;
}

module.exports = replaceDetailData;
