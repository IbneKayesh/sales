import ReviewCard from '@/components/review/ReviewCard';

const ReviewList = ({ reviews, averageRating, ratingBreakdown, reviewCount }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="review-list-empty">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const maxCount = Math.max(...Object.values(ratingBreakdown || {}));

  return (
    <div className="review-list">
      <div className="review-summary">
        <div className="review-summary-overall">
          <div className="review-summary-rating">{averageRating}</div>
          <div className="review-summary-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`rating-star ${i < Math.floor(averageRating) ? '' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <div className="review-summary-count">{reviewCount} reviews</div>
        </div>

        {ratingBreakdown && (
          <div className="review-summary-breakdown">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-row">
                <span className="rating-label">{rating}★</span>
                <div className="rating-bar">
                  <div
                    className="rating-bar-fill"
                    style={{ width: `${(ratingBreakdown[rating] / maxCount) * 100}%` }}
                  />
                </div>
                <span className="rating-count">{ratingBreakdown[rating]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="review-items">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
