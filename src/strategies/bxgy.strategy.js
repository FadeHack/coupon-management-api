// src/strategies/bxgy.strategy.js

const isApplicable = (cart, coupon) => {
  const { buy_products, get_products } = coupon.details;
  const buyProductIds = buy_products.map(p => p.product_id);
  
  // Check if at least one of the "buy" products is in the cart
  const hasBuyProducts = cart.items.some(item => buyProductIds.includes(item.product_id));
  
  // A simple check: for BxGy, we assume if you have the "buy" items, it's potentially applicable.
  // The real calculation will determine the actual discount.
  return hasBuyProducts;
};

const calculateDiscount = (cart, coupon) => {
  const { buy_products, get_products, repetition_limit = 1 } = coupon.details;
  
  const buyProductIds = buy_products.map(p => p.product_id);
  const getProductIds = get_products.map(p => p.product_id);

  const cartBuyItems = cart.items.filter(item => buyProductIds.includes(item.product_id));
  const cartGetItems = cart.items.filter(item => getProductIds.includes(item.product_id));

  if (cartBuyItems.length === 0 || cartGetItems.length === 0) {
    return 0;
  }

  // Calculate total quantity of "buy" items in the cart
  const totalBuyQuantity = cartBuyItems.reduce((sum, item) => sum + item.quantity, 0);
  const requiredBuyQuantity = buy_products[0].quantity; // Assuming BxGy logic is based on the first item's quantity requirement

  // Determine how many times the offer can be applied
  const possibleApplications = Math.floor(totalBuyQuantity / requiredBuyQuantity);
  const actualApplications = Math.min(possibleApplications, repetition_limit);

  if (actualApplications === 0) {
    return 0;
  }
  
  // Find the price of the "get" item (assuming one type of "get" item for simplicity)
  const getProductDetails = get_products[0];
  const getItemInCart = cart.items.find(item => item.product_id === getProductDetails.product_id);
  
  if (!getItemInCart) {
      return 0;
  }
  
  const getProductPrice = getItemInCart.price;
  const freeQuantity = getProductDetails.quantity * actualApplications;

  // Ensure we don't give more free items than are in the cart
  const actualFreeQuantity = Math.min(freeQuantity, getItemInCart.quantity);
  
  return actualFreeQuantity * getProductPrice;
};


module.exports = {
  isApplicable,
  calculateDiscount,
};