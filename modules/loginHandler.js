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

// READ existing mySQL entry:
exports.auth = async function (req, connection) {
	let output;
	let loginStatus = new Boolean();
	let userInfo;
	let errorMessage;

	if (req.body.userName && req.body.userPassword) {
		await new Promise((resolve, reject) => {
			console.log('loginHandler.auth: connection query about to fire...');
			connection.query(
				'SELECT * FROM users WHERE userName = ? AND password = ?',
				[req.body.userName, req.body.userPassword],
				function (error, results, fields) {
					if (error) {
						console.log(`loginHandler.auth: ${error}`);

						loginStatus = false;
						userInfo = 'no user';
						errorMessage = error;

						reject({ loginStatus, userInfo, errorMessage });
					} else if (results.length > 0) {
						console.log(
							'loginHandler.auth: received valid results'
						);
						loginStatus = true;
						userInfo = JSON.parse(JSON.stringify(results[0]));
						errorMessage = 'no error';

						resolve({ loginStatus, userInfo, errorMessage });
					} else {
						console.log('loginHandler.auth: no results');
						loginStatus = false;
						userInfo = 'no user';
						errorMessage = 'Invalid user name / password!';

						resolve({ loginStatus, userInfo, errorMessage });
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
exports.passwordReset = async function (req, connection) {
	let output;
	let loginStatus = new Boolean();
	let userInfo;

	console.log(req.body.newPasswordOne, req.body.newPasswordTwo);

	if (req.body.newPasswordOne === req.body.newPasswordTwo) {
		await new Promise((resolve, reject) => {
			connection.query(
				'UPDATE users SET password = ? WHERE userName = ?',
				[req.body.newPasswordOne, req.body.userName],
				function (error, results, fields) {
					connection.query(
						'SELECT * FROM users WHERE userName = ? AND password = ?',
						[req.body.userName, req.body.newPasswordOne],
						function (error, results, fields) {
							if (results.length > 0) {
								loginStatus = true;
								userInfo = JSON.parse(
									JSON.stringify(results[0])
								);
								// console.log(userInfo);

								resolve({ loginStatus, userInfo });
							} else {
								loginStatus = false;
								userInfo = 'no user';

								reject({ loginStatus, userInfo });
							}
						}
					);
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
