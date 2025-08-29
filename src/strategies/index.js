// src/strategies/index.js

const cartWiseStrategy = require('./cartWise.strategy');
const productWiseStrategy = require('./productWise.strategy');
const bxgyStrategy = require('./bxgy.strategy');

const strategies = {
  'cart-wise': cartWiseStrategy,
  'product-wise': productWiseStrategy,
  'bxgy': bxgyStrategy,
};

const getStrategy = (couponType) => {
  const strategy = strategies[couponType];
  if (!strategy) {
    throw new Error(`Strategy for coupon type "${couponType}" not found.`);
  }
  return strategy;
};

module.exports = {
  getStrategy,
};