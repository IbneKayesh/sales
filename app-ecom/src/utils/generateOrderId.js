/**
 * Generate a unique order ID
 * @returns {string} Unique order ID
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${randomPart}`;
};

export default generateOrderId;
