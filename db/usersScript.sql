-- CREATE DATABASE MovieFax;

-- ALTER DATABASE MovieFax DEFAULT CHARACTER SET = utf8; 
-- ALTER DATABASE MovieFax DEFAULT COLLATE = utf8_general_ci;

USE MovieFax;

-- ALTER TABLE users DEFAULT CHARACTER SET = utf8; 
-- ALTER TABLE users DEFAULT COLLATE = utf8_general_ci;

-- CREATE TABLE users (
--     userID INT NOT NULL AUTO_INCREMENT,
--     userName varchar(55) NOT NULL UNIQUE,
--     email varchar(55) NOT NULL UNIQUE,
--     password varchar(55) NOT NULL UNIQUE,
--     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY(userID)
-- );

-- INSERT INTO users (userName, email, password)
--     VALUES ('Tom', 'tom@hotmail.com', '1234'),
--         ('Dick', 'dick@yahoo.com', 'password'),
--         ('Harry', 'harry@gmail.com',  '5678');

-- CREATE TABLE user_movies (
--     movieID INT NOT NULL AUTO_INCREMENT,
--     imbdID varchar(55) NOT NULL UNIQUE,
--     movie_title varchar(255) NOT NULL,
--     release_year year,
-- 	content_rating enum('G','PG','PG-13','R','NC-17'),
-- 	movie_poster varchar(255),
-- 	movie_summary varchar(255),
-- 	imdb_rating DECIMAL(2,1),
-- 	metacritic_rating DECIMAL(2,1),
-- 	movie_budget varchar(55),
-- 	movie_gross varchar(55),
-- 	movie_purchase_sources varchar(32),
-- 	movie_rental_sources varchar(32),
-- 	movie_streaming_sources varchar(32),
--     users_selected INT,
--     last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY(movieID)
-- );

-- INSERT INTO user_movies (imdbID, movie_title, release_year, content_rating, movie_poster, movie_summary, imdb_rating, metacritic_rating, movie_budget, movie_gross, movie_purchase_sources, movie_rental_sources, movie_streaming_sources, users_selected)
--     VALUES (imdbID, movie_title, release_year, content_rating, movie_poster, movie_summary, imdb_rating, metacritic_rating, movie_budget, movie_gross, movie_purchase_sources, movie_rental_sources, movie_streaming_sources, users_selected);

-- DELETE FROM users WHERE userID = 15;

-- ALTER TABLE users AUTO_INCREMENT = 1;

-- SELECT * FROM users;

SELECT * FROM user_movies;

