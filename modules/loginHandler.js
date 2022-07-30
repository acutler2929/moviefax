'use strict';

let loginStatus;
let userName;
let userEmail;
let userPassword;

let loginMessage = 'Login to continue...';

exports.greeting = function (req) {
	let greetingMessage;
	let toggleLoginBtn;

	// If user is logged in...
	if (req.session.loggedin) {
		console.log('user logged in');
		// Greet user and show logout button:
		greetingMessage = `Welcome back, ${userName}!`;
	} else {
		console.log('user Not logged in');
		// Greet stranger and show login button:
		greetingMessage = 'Sign up to build your movie list...';
	}

	return { greetingMessage, toggleLoginBtn };
};

exports.register = function (req) {};

exports.login = async function (req, connection) {
	userName = req.body.userName;
	userPassword = req.body.userPassword;

	if (userName && userPassword) {
		await connection.query(
			'SELECT * FROM users WHERE userName = ? AND password = ?',
			[userName, userPassword],
			function (error, results, fields) {
				console.log(results);
				// If there is an issue with the query, output the error
				if (error) {
					console.log(error);
					throw error;
				}
				// If the account exists
				if (results.length > 0) {
					console.log(
						`loginHandler.js: /login returning user: ${userName}, ${userPassword}`
					);
					// Authenticate the user
					loginStatus = true;

					return { userName, userPassword, loginStatus };
				} else {
					loginMessage = 'Invalid user name / password!';
					loginStatus = false;

					return { loginMessage, loginStatus };
				}
			}
		);
	}

	return { loginMessage, loginStatus };
};

exports.logout = function (req) {};
