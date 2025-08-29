// src/middleware/validate.js

const Joi = require('joi');
const httpStatus = require('http-status').default;
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  // pick only the defined keys in the schema from the request object
  const validSchema = Joi.object(
    Object.keys(schema).reduce((acc, key) => {
      acc[key] = schema[key];
      return acc;
    }, {})
  );
  
  const object = Object.keys(validSchema.describe().keys)
    .reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(req, key)) {
        acc[key] = req[key];
      }
      return acc;
    }, {});

  const { value, error } = validSchema
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new AppError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;