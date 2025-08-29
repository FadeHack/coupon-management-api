// src/validations/coupon.validation.js

const Joi = require('joi');

const createCoupon = {
  body: Joi.object().keys({
    code: Joi.string().required().uppercase(),
    description: Joi.string().required(),
    type: Joi.string().required().valid('cart-wise', 'product-wise', 'bxgy'),
    details: Joi.object().required(), // We can add more specific validation later if needed
    startDate: Joi.date(),
    endDate: Joi.date().allow(null),
  }),
};

const getCoupons = {
  query: Joi.object().keys({
    // Add any query params for filtering/pagination here later
  }),
};

const getCoupon = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateCoupon = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      details: Joi.object(),
      isActive: Joi.boolean(),
    })
    .min(1), // Require at least one field to be updated
};

const deleteCoupon = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};