// src/models/coupon.model.js

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['cart-wise', 'product-wise', 'bxgy'],
    },
    description: {
      type: String,
      required: true,
    },
    // This object will hold different fields based on the coupon 'type'
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: null, // A null end date means it never expires
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;