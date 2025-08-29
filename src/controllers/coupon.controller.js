// src/controllers/coupon.controller.js

const httpStatus = require('http-status').default;
const couponService = require('../services/coupon.service');
const catchAsync = require('../utils/catchAsync'); // We'll create this utility
const AppError = require('../utils/AppError');



const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(httpStatus.CREATED).send(coupon);
});

const getCoupons = catchAsync(async (req, res) => {
  const result = await couponService.queryCoupons();
  res.send(result);
});

const getCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.id);
  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  res.send(coupon);
});

const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCouponById(req.params.id, req.body);
  res.send(coupon);
});

const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCouponById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getApplicableCoupons = catchAsync(async (req, res) => {
  const { cart } = req.body;
  const applicableCoupons = await couponService.getApplicableCoupons(cart);
  res.send({ applicable_coupons: applicableCoupons });
});

const applyCoupon = catchAsync(async (req, res) => {
  const { cart } = req.body;
  const { id } = req.params;
  const updatedCart = await couponService.applyCouponToCart(id, cart);
  res.send({ updated_cart: updatedCart });
});

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  getApplicableCoupons,
  applyCoupon,
};