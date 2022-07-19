'use strict';

const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	database: 'MovieFax',
});

connection.connect(function (error) {
	if (!!error) {
		console.log(error);
	} else {
		console.log('db.js: Connected!:)');
	}
});

module.exports = connection;
