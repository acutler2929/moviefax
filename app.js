'use strict';

const express = require('express');

const config = require('./config');

const app = express();

app.get('/', (req, res) => {
	res.status(200).json({
		message: 'Hello from the server!',
		app: 'MovieFax',
	});
});

app.post('/', (req, res) => {
	res.send('POST to this endpoint...');
});

app.listen('8888', () => {
	console.log('App running on port 8888...');
});
