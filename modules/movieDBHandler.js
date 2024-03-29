'use strict';

////////////// this module, movieDBHandler.js, gives the MovieFax app different ways to interact with the MYSQL database

///////////////////// building function to add movieState to MYSQL table user_movies
exports.addMovie = function (movieData, movieSources, connection) {
	console.log(
		`movieDBHandler.addMovie() fired, movieState.imdbID = ${movieData.imdbID}, ${movieData.movieTitle}`
	);

	///////////// taking movieSources object, and cutting it into just one array...
	function makeSourcesArr(imdbID, movieSources) {
		console.log('from makeSourcesArr(), here is the movieSources object:');
		console.dir(movieSources);

		let purchaseArr = [];
		let rentalArr = [];
		let streamingArr = [];
		let finalArr = [];

		for (let i in movieSources.purchaseSources)
			purchaseArr.push(Object.values(movieSources.purchaseSources[i]));

		for (let i in movieSources.rentalSources)
			rentalArr.push(Object.values(movieSources.rentalSources[i]));

		for (let i in movieSources.streamingSources)
			streamingArr.push(Object.values(movieSources.streamingSources[i]));

		const sourcesArr = purchaseArr.concat(rentalArr).concat(streamingArr);

		for (let i in sourcesArr) {
			let source = sourcesArr[i]
				.filter(
					(entry) =>
						entry !== 'Deeplinks available for paid plans only.'
				)
				.slice(0, -2);
			source.unshift(imdbID);

			finalArr.push(source);
		}

		return finalArr;
	}

	// const movieInfoArr = makeMovieArr(movieState.movieData);
	const movieSourcesArr = makeSourcesArr(movieData.imdbID, movieSources);
	const movieInfoArr = Object.values(movieData);
	// const movieSourcesArr = Object.entries(movieSources);

	// console.log('movieInfoArr:');
	// console.dir(movieInfoArr);
	// console.log('movieSourcesArr:');
	// console.dir(movieSourcesArr);

	const movieInfoQuery =
		'INSERT INTO user_movies (imdb_id, movie_title, release_year, content_rating, movie_poster, movie_summary, imdb_rating, metacritic_rating, movie_budget, movie_gross) VALUES (?);';
	const movieSourcesQuery =
		'INSERT INTO movie_sources (imdb_id, source_id, source_name, source_type, region, web_url, format, price) VALUES ?;';

	//////////// pushing movie info to MYSQL table user_movies:
	connection.query(
		movieInfoQuery,
		[movieInfoArr],
		function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
			}
			console.log(JSON.stringify(results));
		}
	);

	//////////// pushing movie sources info to MYSQL table movie_sources:
	connection.query(
		movieSourcesQuery,
		[movieSourcesArr],
		function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
			}
			console.log(JSON.stringify(results));
		}
	);
};

//////////////// grabbing details of a specific movie from MYSQL...
exports.getMovieDetails = async function (imdbID, connection) {
	////////// let's use fs temporarily to make it easier to work with data
	const fs = require('fs');
	console.log('movieDBHandler.getMovieDetails() fired...');
	let output;
	let detailsQuery = 'SELECT * FROM user_movies WHERE imdb_id = ?;';
	let sourcesQuery = 'SELECT * FROM movie_sources WHERE imdb_id = ?';

	///////////// first, grab movie info from user_movies...
	let detailsJSON = await new Promise((resolve, reject) => {
		connection.query(
			detailsQuery,
			[imdbID],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
					reject(JSON.stringify(error));
				}
				// console.log(JSON.stringify(results));
				resolve(JSON.stringify(results));
			}
		);
	})
		.then((res) => {
			console.log('movieDBHandler.getMovieDetails() Promise success!');
			// console.log(res);
			output = res;

			return output;
		})
		.catch((err) => {
			console.log('movieDBHandler.getMovieDetails() Promise failed :(');
			console.log(err);
			output = err;

			return output;
		});

	//////// then, grab sources from movie_sources
	let sourcesJSON = await new Promise((resolve, reject) => {
		connection.query(
			sourcesQuery,
			[imdbID],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
					reject(JSON.stringify(error));
				}
				// console.log(JSON.stringify(results));
				resolve(JSON.stringify(results));
			}
		);
	})
		.then((res) => {
			console.log('movieDBHandler.getMovieDetails() Promise success!');
			// console.log(res);
			output = res;

			return output;
		})
		.catch((err) => {
			console.log('movieDBHandler.getMovieDetails() Promise failed :(');
			console.log(err);
			output = err;

			return output;
		});

	let detailsObj = JSON.parse(detailsJSON);
	let movieSourcesArray = JSON.parse(sourcesJSON);

	output = {
		...detailsObj[0],
		movieSourcesArray,
	};

	return output;
};

//////////////// grabbing the user's list of selected movies:
exports.getMovieList = async function (req, connection) {
	console.log('movieDBHandler.getMovieList() fired...');

	let output;
	let query =
		'SELECT * FROM selected_movies RIGHT JOIN user_movies ON selected_movies.imdb_id = user_movies.imdb_id WHERE user_id = ?;';

	await new Promise((resolve, reject) => {
		connection.query(
			query,
			[req.session.userid],
			function (error, results, fields) {
				if (error) {
					console.log(JSON.stringify(error));
					reject(JSON.stringify(error));
				}
				// console.log(JSON.stringify(results));
				resolve(JSON.stringify(results));
			}
		);
	})
		.then((res) => {
			console.log('movieDBHandler.getMovieList() Promise success!');
			// console.log(res);
			output = res;

			return output;
		})
		.catch((err) => {
			console.log('movieDBHandler.getMovieList() Promise failed :(');
			console.log(err);
			output = err;

			return output;
		});

	return output;
};

/////////////// building function to add userid to MYSQL movie row
exports.addSelection = function (userid, imdbid, connection) {
	console.log(
		`movieDBHandler.addUserId() fired with userid: ${userid}, and imdbid: ${imdbid}`
	);

	connection.query(
		'INSERT INTO selected_movies (user_id, imdb_id) VALUES (?, ?);',
		[userid, imdbid],
		function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
			}
			console.log(JSON.stringify(results));
		}
	);
};

////////////////// and this function DROPS a user's selected movie...
exports.deleteSelection = function (userid, imdbid, connection) {
	console.log(
		`movieDBHandler.deleteSelection() fired with userid: ${userid}, and imdbid: ${imdbid}`
	);

	connection.query(
		'DELETE FROM selected_movies WHERE user_id = ? AND imdb_id = ?;',
		[userid, imdbid],
		function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
			}
			console.log(JSON.stringify(results));
		}
	);
};
