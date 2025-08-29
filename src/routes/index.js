// src/routes/index.js

const express = require('express');
const couponRoute = require('./coupon.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/coupons',
    route: couponRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;