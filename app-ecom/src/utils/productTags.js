/**
 * Generate product tags based on product properties
 * Returns array of { label, type } objects
 */
export const getProductTags = (product) => {
  const tags = [];

  // SOLD OUT — no stock
  if (product.stock <= 0) {
    tags.push({ label: 'Sold Out', type: 'sold-out' });
    return tags; // No other tags if sold out
  }

  // OUT OF STOCK / LOW STOCK
  if (product.stock <= 5) {
    tags.push({ label: `Only ${product.stock} left`, type: 'low-stock' });
  }

  // FLASH SALE — has discount > 20%
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (discountPercent >= 30) {
    tags.push({ label: 'Flash Sale', type: 'flash-sale' });
  } else if (discountPercent >= 20) {
    tags.push({ label: 'Sale', type: 'sale' });
  }

  // POPULAR — high review count (> 200)
  if (product.reviewCount >= 300) {
    tags.push({ label: 'Best Seller', type: 'popular' });
  } else if (product.reviewCount >= 200) {
    tags.push({ label: 'Popular', type: 'trending' });
  }

  // HOT — high rating (>= 4.5) with decent reviews
  if (product.rating >= 4.7 && product.reviewCount >= 100) {
    tags.push({ label: 'Hot', type: 'hot' });
  }

  // NEW — high stock (could indicate new arrival)
  if (product.stock >= 200) {
    tags.push({ label: 'New', type: 'new' });
  }

  // Limit to 2 tags max to avoid clutter
  return tags.slice(0, 2);
};

export default getProductTags;
