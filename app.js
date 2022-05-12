'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const apiHandler = require('./modules/apiHandler.js');
const insertMovieData = require('./modules/insertMovieData');

const app = express();

console.log('hello from app.js!');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));
