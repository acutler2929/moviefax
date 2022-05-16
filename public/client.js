'use strict';

const query = document.getElementById('search-query').value;

document.getElementById('search-button').addEventListener('click', function () {
	console.log('search button clicked...');
	fetch('http://localhost:8888/app/getQuery', {
		method: 'GET',
	});
});
