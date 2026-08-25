/**
 * Calculate cart totals
 * @param {Array} cartItems - Array of cart items
 * @param {number} deliveryFee - Delivery fee
 * @param {number} discount - Discount amount (default: 0)
 * @returns {Object} Cart calculation breakdown
 */
export const calculateCart = (cartItems, deliveryFee = 0, discount = 0) => {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const total = subtotal + deliveryFee - discount;

  return {
    subtotal,
    deliveryFee,
    discount,
    total: Math.max(0, total),
    itemCount
  };
};

export default calculateCart;
