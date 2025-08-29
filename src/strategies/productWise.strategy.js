// src/strategies/productWise.strategy.js

const isApplicable = (cart, coupon) => {
  const applicableProductIds = coupon.details.applicableProductIds || [];
  return cart.items.some(item => applicableProductIds.includes(item.product_id));
};

const calculateDiscount = (cart, coupon) => {
  const applicableProductIds = coupon.details.applicableProductIds || [];
  const discountPercentage = coupon.details.discountPercentage || 0;

  let totalDiscount = 0;
  cart.items.forEach(item => {
    if (applicableProductIds.includes(item.product_id)) {
      totalDiscount += (item.price * item.quantity * discountPercentage) / 100;
    }
  });

  return totalDiscount;
};

module.exports = {
  isApplicable,
  calculateDiscount,
};