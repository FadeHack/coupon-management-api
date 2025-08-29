// tests/integration/coupon.route.test.js
const request = require('supertest');
const httpStatus = require('http-status').default;
const app = require('../setup'); // Import the app from our setup file
const Coupon = require('../../src/models/coupon.model');

describe('Coupon Routes', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await Coupon.deleteMany();
  });

  describe('POST /v1/coupons', () => {
    let newCoupon;

    beforeEach(() => {
      newCoupon = {
        code: 'TEST10',
        description: 'A test coupon',
        type: 'cart-wise',
        details: {
          threshold: 50,
          discountPercentage: 10,
        },
      };
    });

    it('should return 201 CREATED and successfully create a new coupon if data is valid', async () => {
      const res = await request(app)
        .post('/v1/coupons')
        .send(newCoupon)
        .expect(httpStatus.CREATED);

      expect(res.body).toMatchObject({
        code: newCoupon.code,
        type: newCoupon.type,
        isActive: true,
      });

      const dbCoupon = await Coupon.findById(res.body.id);
      expect(dbCoupon).toBeDefined();
    });

    it('should return 400 BAD REQUEST if code is missing', async () => {
      delete newCoupon.code;

      await request(app)
        .post('/v1/coupons')
        .send(newCoupon)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});