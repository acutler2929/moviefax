'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

// const apiHandler = require('./modules/apiHandler.js');
// const insertMovieData = require('./modules/insertMovieData');

const backEndGreeting = 'Hello from the backend!';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('../frontend'));

app.post('/getQuery', (req, res) => {
	const query = req.body.query;
	console.log(`receiving query for movie name ${query}`);
});

// app.get('/', (req, res) => {
// 	fs.readFile('../frontend/index.html', (err, data) => {
// 		res.writeHead(200, { 'Content-Type': 'text/html' });
// 		res.write(data);
// 		return res.end();
// 	});
// });

module.exports = app;
