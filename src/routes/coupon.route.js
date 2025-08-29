// src/routes/coupon.route.js - (Updated file)

const express = require('express');
const couponController = require('../controllers/coupon.controller');
const couponValidation = require('../validations/coupon.validation');
const validate = require('../middleware/validate'); // Import validate

const router = express.Router();

router
  .route('/')
  .post(validate(couponValidation.createCoupon), couponController.createCoupon)
  .get(validate(couponValidation.getCoupons), couponController.getCoupons);

router.post('/applicable-coupons', couponController.getApplicableCoupons); // Note: Add validation for this later
router.post('/apply-coupon/:id', couponController.applyCoupon); // Note: Add validation for this later

router
  .route('/:id')
  .get(validate(couponValidation.getCoupon), couponController.getCoupon)
  .put(validate(couponValidation.updateCoupon), couponController.updateCoupon)
  .delete(validate(couponValidation.deleteCoupon), couponController.deleteCoupon);

module.exports = router;