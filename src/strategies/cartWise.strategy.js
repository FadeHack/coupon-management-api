// src/strategies/cartWise.strategy.js

const isApplicable = (cart, coupon) => {
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return cartTotal >= coupon.details.threshold;
};

const calculateDiscount = (cart, coupon) => {
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountPercentage = coupon.details.discountPercentage || 0;
  return (cartTotal * discountPercentage) / 100;
};

module.exports = {
  isApplicable,
  calculateDiscount,
};