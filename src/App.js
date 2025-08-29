// src/App.js - (Updated file)

const express = require('express');
const httpStatus = require('http-status').default;
const morgan = require('morgan');
const config = require('./config');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');

const app = express();

if (config.env !== 'test') {
    app.use(morgan('dev'));
}

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get('/', (req, res) => {
    res.status(200).send('Coupon Management API is running!');
});

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;