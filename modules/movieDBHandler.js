'use strict';

////////////// this module, movieDBHandler.js, gives the MovieFax app different ways to interact with the MYSQL database

///////////////////// building function to add movieData to MYSQL table user_movies
exports.addMovie = function (movieData, connection) {
	console.log(
		`movieDBHandler.addMovie() fired, movieData.imdbID = ${movieData.imdbID}`
	);

	//////////// taking movieData object, and cutting it into an array that contains just the movie's info without source data
	function makeMovieArr(movieData) {
		let movieArr = [];

		for (let i in movieData) movieArr.push(movieData[i]);
		const movieInfoArr = movieArr.slice(0, -3);

		return movieInfoArr;
	}

	///////////// taking movieData object, and cutting it into an array that contains only the SOURCES info, without any other movie data...
	function makeSourcesArr(movieData) {
		// let sourcesArr = [];
		let purchaseArr = [];
		let rentalArr = [];
		let streamingArr = [];
		let finalArr = [];

		for (let i in movieData.moviePurchaseArray)
			purchaseArr.push(Object.values(movieData.moviePurchaseArray[i]));

		for (let i in movieData.movieRentArray)
			rentalArr.push(Object.values(movieData.movieRentArray[i]));

		for (let i in movieData.movieStreamingArray)
			streamingArr.push(Object.values(movieData.movieStreamingArray[i]));

		const sourcesArr = purchaseArr.concat(rentalArr).concat(streamingArr);

		for (let i in sourcesArr) {
			let source = sourcesArr[i]
				.filter(
					(entry) =>
						entry !== 'Deeplinks available for paid plans only.'
				)
				.slice(0, -2);
			source.unshift(movieData.imdbID);

			finalArr.push(source);
		}

		return finalArr;
	}

	const movieInfoArr = makeMovieArr(movieData);
	const movieSourcesArr = makeSourcesArr(movieData);

	console.log('movieInfoArr:');
	console.dir(movieInfoArr);
	console.log('movieSourcesArr:');
	console.dir(movieSourcesArr);

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
	console.log('movieDBHandler.getMovieDetails() fired...');
	let output;
	let query = 'SELECT * FROM user_movies WHERE imdb_id = ?;';

	await new Promise((resolve, reject) => {
		connection.query(query, [imdbID], function (error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				reject(JSON.stringify(error));
			}
			// console.log(JSON.stringify(results));
			resolve(JSON.stringify(results));
		});
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
		`movieDBHandler.addUserId() fired with userid and imdbid: ${[
			userid,
			imdbid,
		]}`
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
	console.log('movieDBHandler.deleteMovie() fired...');
};
