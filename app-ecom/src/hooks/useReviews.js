import { useMemo } from 'react';
import { reviews as allReviews } from '@/data/reviews';

const useReviews = (productId) => {
  const productReviews = useMemo(() => {
    return allReviews.filter(r => r.productId === productId);
  }, [productId]);

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
    reviews: productReviews,
    averageRating,
    ratingBreakdown,
    reviewCount: productReviews.length
  };
};

export default useReviews;
