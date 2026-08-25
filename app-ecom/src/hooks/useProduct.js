import { useMemo } from 'react';
import { products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { extractProductId } from '@/utils/slugify';

const useProduct = (slugOrId) => {
  const productId = extractProductId(slugOrId);

  const product = useMemo(() => {
    return products.find(p => p.id === productId) || null;
  }, [productId]);

  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === productId);
  }, [productId]);

  const suggestedProducts = useMemo(() => {
    if (!product) return [];
    
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  }, [productReviews]);

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(review => {
      breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    });
    return breakdown;
  }, [productReviews]);

  return {
    product,
    reviews: productReviews,
    suggestedProducts,
    averageRating,
    ratingBreakdown,
    reviewCount: productReviews.length,
    isLoading: false,
    error: product === null && productId ? 'Product not found' : null
  };
};

export default useProduct;
