'use strict';

exports.greeting = function (req) {
	let greeting;
	let toggleLoginBtn;

	// If user is logged in...
	if (req.session.loggedin) {
		console.log('user logged in');
		// Greet user and show logout button:
		greeting = `Welcome back, ${userName}!`;
	} else {
		console.log('user Not logged in');
		// Greet stranger and show login button:
		greeting = 'Sign up to build your movie list...';
	}

	return { greeting, toggleLoginBtn };
};

exports.register = function () {};

exports.login = function () {};

exports.logout = function () {};
