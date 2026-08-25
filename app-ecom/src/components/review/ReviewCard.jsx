const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-card-avatar">
          {review.author.charAt(0).toUpperCase()}
        </div>
        <div className="review-card-meta">
          <span className="review-card-author">{review.author}</span>
          <span className="review-card-date">{formatDate(review.date)}</span>
        </div>
      </div>
      <div className="review-card-rating">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`rating-star ${i < review.rating ? '' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="review-card-text">{review.text}</p>

      {/* Admin Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="review-replies">
          {review.replies.map((reply, index) => (
            <div key={index} className="review-reply">
              <div className="review-reply-header">
                <div className="review-reply-avatar">
                  <span>✓</span>
                </div>
                <div className="review-reply-meta">
                  <span className="review-reply-author">ShopEasy Admin</span>
                  <span className="review-reply-date">{formatDate(reply.date)}</span>
                </div>
              </div>
              <p className="review-reply-text">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
