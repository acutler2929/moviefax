'use strict';

let loginStatus = new Boolean();
let userInfo;
let userEmail;

let loginMessage = 'Login to continue...';

exports.register = function (req) {};

exports.login = async function (req, connection) {
	console.log('loginHandler.login started');
	let output = 'login info expected';
	let query;

	if (req.body.userName && req.body.userPassword) {
		console.log('has username and password');
		await new Promise((resolve, reject) => {
			query = connection.query(
				'SELECT * FROM users WHERE userName = ? AND password = ?',
				[req.body.userName, req.body.userPassword],
				function (error, results, fields) {
					userInfo = JSON.parse(JSON.stringify(results[0]));
					console.log(`returned userInfo: ${userInfo}`);
					// If there is an issue with the query, output the error
					if (error) {
						console.log(error);
						throw error;
					}
					// If the account exists
					if (results.length > 0) {
						console.log(
							`loginHandler.js: /login returning user: ${userInfo.userName}, ${userInfo.userPassword}`
						);
						// Authenticate the user
						loginStatus = true;
						console.log(`loginStatus: ${loginStatus}`);

						output = { loginStatus, userInfo };
						// console.log(`login output: ${output}`);
						console.log(typeof output);

						return output;
					} else {
						loginMessage = 'Invalid user name / password!';
						loginStatus = false;
						console.log(`loginStatus: ${loginStatus}`);

						output = { loginStatus, loginMessage };
						// console.log(`login output: ${output}`);
						console.log(tyepof(output));

						return output;
					}
				}
			);
		});

		console.log(`longinHandler line 58: connection.query: ${query}`);

		return query;
	}

	console.log('query returned');
	console.log('loginHandler.login finished');
	return query;
};

exports.logout = function (req) {};
