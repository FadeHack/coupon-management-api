// src/utils/catchAsync.js (Create this new file)

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;