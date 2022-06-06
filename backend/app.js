'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const apiHandler = require('./modules/apiHandler.js');
const dataHandler = require('./modules/dataHandler');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('frontend'));

app.post('/getQuery', async (req, res) => {
	const query = req.body.query;
	console.log(`receiving query for movie name ${query}`);

	// apiResponse comes back from api Handler...
	const apiResponse = await apiHandler.searchMovieData(query);
	console.log(`received apiResponse for movie ${apiResponse[0].title}`);

	const htmlSearchData = await dataHandler.insertSearchResults(apiResponse);
	// console.log(htmlSearchData[0]);

	res.send(htmlSearchData);
});

// app.get('/', (req, res) => {
// 	fs.readFile('../frontend/index.html', (err, data) => {
// 		res.writeHead(200, { 'Content-Type': 'text/html' });
// 		res.write(data);
// 		return res.end();
// 	});
// });

module.exports = app;
