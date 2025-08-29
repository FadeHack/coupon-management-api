// src/services/coupon.service.js

const Coupon = require('../models/coupon.model');
const { getStrategy } = require('../strategies');
const AppError = require('../utils/AppError');
const httpStatus = require('http-status').default;

/**
 * Create a coupon
 * @param {Object} couponBody
 * @returns {Promise<Coupon>}
 */
const createCoupon = async (couponBody) => {
  // Add logic to check if coupon code already exists if needed
  return Coupon.create(couponBody);
};

/**
 * Query for coupons
 * @returns {Promise<QueryResult>}
 */
const queryCoupons = async () => {
  const coupons = await Coupon.find();
  return coupons;
};

/**
 * Get coupon by ID
 * @param {ObjectId} id
 * @returns {Promise<Coupon>}
 */
const getCouponById = async (id) => {
  return Coupon.findById(id);
};

/**
 * Update coupon by ID
 * @param {ObjectId} couponId
 * @param {Object} updateBody
 * @returns {Promise<Coupon>}
 */
const updateCouponById = async (couponId, updateBody) => {
  const coupon = await getCouponById(couponId);
  if (!coupon) {
    // Throw our custom error
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  Object.assign(coupon, updateBody);
  await coupon.save();
  return coupon;
};

/**
 * Delete coupon by ID
 * @param {ObjectId} couponId
 * @returns {Promise<Coupon>}
 */
const deleteCouponById = async (couponId) => {
  const coupon = await Coupon.findByIdAndDelete(couponId);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  return coupon;
};


/**
 * Find all applicable coupons for a given cart
 * @param {Object} cart
 * @returns {Promise<Array>}
 */
const getApplicableCoupons = async (cart) => {
  const now = new Date();
  const allCoupons = await Coupon.find({
        isActive: true,
        startDate: { $lte: now }, // Start date is less than or equal to now
        $or: [
            { endDate: { $eq: null } }, // Or end date is null
            { endDate: { $gte: now } }  // Or end date is greater than or equal to now
        ]
  });
  const applicableCoupons = [];

  allCoupons.forEach((coupon) => {
    try {
      const strategy = getStrategy(coupon.type);
      if (strategy.isApplicable(cart, coupon)) {
        const discount = strategy.calculateDiscount(cart, coupon);
        if (discount > 0) {
          applicableCoupons.push({
            coupon_id: coupon.id,
            code: coupon.code,
            type: coupon.type,
            discount,
          });
        }
      }
    } catch (error) {
      // Log the error but don't stop the process
      console.error(`Error processing coupon ${coupon.code}: ${error.message}`);
    }
  });

  return applicableCoupons;
};

/**
 * Apply a specific coupon to a cart and return the updated cart
 * @param {string} couponId
 * @param {Object} cart
 * @returns {Promise<Object>}
 */
const applyCouponToCart = async (couponId, cart) => {
  const coupon = await getCouponById(couponId);
  if (!coupon || !coupon.isActive) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found or is not active');
  }

  const strategy = getStrategy(coupon.type);
  if (!strategy.isApplicable(cart, coupon)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Coupon is not applicable to this cart');
  }

  const totalDiscount = strategy.calculateDiscount(cart, coupon);
  const cartTotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Note: A real implementation would have more complex logic for distributing the discount
  // across items. For now, we'll just return the updated totals.
  const updatedCart = {
    ...cart,
    total_price: cartTotal,
    total_discount: totalDiscount,
    final_price: cartTotal - totalDiscount,
  };

  return updatedCart;
};

module.exports = {
  createCoupon,
  queryCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
  getApplicableCoupons,
  applyCouponToCart,
};