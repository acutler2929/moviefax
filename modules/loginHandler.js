'use strict';

// CREATE new mySQL entry:
exports.register = async function (req, connection) {
	let output;
	let loginStatus = new Boolean();
	let userInfo;

	if (req.body.newUserName && req.body.newEmail && req.body.newPassword) {
		await new Promise((resolve, reject) => {
			connection.query(
				'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
				[req.body.newUserName, req.body.newEmail, req.body.newPassword],
				function (error) {
					// If there is no error
					if (!error) {
						//Prepare to Authenticate the user
						loginStatus = true;
						userInfo = {
							userName: req.body.newUserName,
							email: req.body.newEmail,
							password: req.body.newPassword,
						};
						console.log(
							`app.js: /register new user: ${userInfo.userName}, ${userInfo.email}, ${userInfo.password}`
						);

						resolve({ loginStatus, userInfo });

						// If login info already exists, send appropriate error message
					} else if (error.code === 'ER_DUP_ENTRY') {
						loginStatus = false;
						userInfo = error.code;

						reject({ loginStatus, userInfo });
					}
				}
			);
		})
			.then((res) => {
				console.log(res);
				output = res;

				return output;
			})
			.catch((err) => {
				console.log(err);
				output = err;

				return output;
			});
	} else {
		console.log('invalid register info!');
		output = {
			loginStatus: false,
			userInfo: 'ERROR INVALID INFO',
		};

		return output;
	}

	return output;
};

// READ new mySQL entry:
exports.auth = async function (req, connection) {
	let output;
	let loginStatus = new Boolean();
	let userInfo;

	if (req.body.userName && req.body.userPassword) {
		await new Promise((resolve, reject) => {
			connection.query(
				'SELECT * FROM users WHERE userName = ? AND password = ?',
				[req.body.userName, req.body.userPassword],
				function (error, results, fields) {
					if (results.length > 0) {
						loginStatus = true;
						userInfo = JSON.parse(JSON.stringify(results[0]));
						// console.log(userInfo);

						resolve({ loginStatus, userInfo });
					} else {
						loginStatus = false;
						userInfo = 'no user';

						reject({ loginStatus, userInfo });
					}
				}
			);
		})
			.then((res) => {
				console.log('login module Promise success!');
				// console.log(res);
				output = res;

				return output;
			})
			.catch((err) => {
				console.log('login module Promise failed :(');
				// console.log(err);
				output = err;

				return output;
			});
	}

	return output;
};

// UPDATE existing mySQL entry:
exports.passwordReset = function (req) {};
