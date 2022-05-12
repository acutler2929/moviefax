'use strict';

const query = document.getElementById('search-query').value;

document.getElementById('search-button').addEventListener('click', function () {
	console.log('search button clicked...');
	fetch('../app/getQuery', { body: query, method: 'POST' });
});
