// tests/unit/cartWise.strategy.test.js

const cartWiseStrategy = require('../../src/strategies/cartWise.strategy');

describe('Cart-Wise Strategy', () => {
  const coupon = {
    details: {
      threshold: 100,
      discountPercentage: 10,
    },
  };

  describe('isApplicable', () => {
    it('should return true if cart total is above the threshold', () => {
      const cart = { items: [{ price: 60, quantity: 2 }] }; // Total: 120
      expect(cartWiseStrategy.isApplicable(cart, coupon)).toBe(true);
    });

    it('should return true if cart total is equal to the threshold', () => {
      const cart = { items: [{ price: 50, quantity: 2 }] }; // Total: 100
      expect(cartWiseStrategy.isApplicable(cart, coupon)).toBe(true);
    });

    it('should return false if cart total is below the threshold', () => {
      const cart = { items: [{ price: 40, quantity: 2 }] }; // Total: 80
      expect(cartWiseStrategy.isApplicable(cart, coupon)).toBe(false);
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate the correct discount percentage on the cart total', () => {
      const cart = { items: [{ price: 100, quantity: 2 }] }; // Total: 200
      // 10% of 200 should be 20
      expect(cartWiseStrategy.calculateDiscount(cart, coupon)).toBe(20);
    });

    it('should return 0 discount if coupon details are missing', () => {
        const cart = { items: [{ price: 100, quantity: 2 }] };
        const invalidCoupon = { details: { threshold: 100 } }; // Missing discountPercentage
        expect(cartWiseStrategy.calculateDiscount(cart, invalidCoupon)).toBe(0);
      });
  });
});