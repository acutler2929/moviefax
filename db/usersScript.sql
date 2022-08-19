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

-- DELETE FROM users WHERE userID = 15;

-- ALTER TABLE users AUTO_INCREMENT = 1;

-- SELECT * FROM users;

SELECT * FROM users WHERE userName = 'rufus';