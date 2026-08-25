import { useMemo, useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendorBySlug } from '@/data/vendors';
import { getVendorReviews, getVendorAverageRating, getVendorRatingBreakdown } from '@/data/vendorReviews';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import formatCurrency from '@/utils/formatCurrency';

const VendorProfilePage = () => {
  const { slug } = useParams();

  const vendor = useMemo(() => {
    return getVendorBySlug(slug) || null;
  }, [slug]);

  const reviews = useMemo(() => {
    return vendor ? getVendorReviews(vendor.id) : [];
  }, [vendor]);

  const averageRating = useMemo(() => {
    return vendor ? getVendorAverageRating(vendor.id) : 0;
  }, [vendor]);

  const ratingBreakdown = useMemo(() => {
    return vendor ? getVendorRatingBreakdown(vendor.id) : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  }, [vendor]);

  const [displayCount, setDisplayCount] = useState(12);

  const allVendorProducts = useMemo(() => {
    if (!vendor) return [];
    return products.filter(p => p.vendor_id === vendor.id);
  }, [vendor]);

  const vendorProducts = useMemo(() => {
    return allVendorProducts.slice(0, displayCount);
  }, [allVendorProducts, displayCount]);

  const hasMoreProducts = displayCount < allVendorProducts.length;

  const loadMoreProducts = useCallback(() => {
    setDisplayCount(prev => prev + 12);
  }, []);

  useEffect(() => {
    if (vendor) {
      document.title = `${vendor.name} - Seller Profile | ShopEasy`;
    } else {
      document.title = 'Seller Not Found | ShopEasy';
    }
    return () => { document.title = 'ShopEasy - Online Shopping'; };
  }, [vendor]);

  if (!vendor) {
    return (
      <main className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ marginBottom: 'var(--spacing-4)' }}>Seller Not Found</h1>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-6)' }}>
            The seller you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  const reviewCount = reviews.length;

  return (
    <main className="page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="breadcrumb-current">{vendor.name}</span>
        </nav>

        {/* Vendor Header Banner */}
        <div className="vendor-page-header">
          <div className="vendor-page-banner" style={{ backgroundImage: `url(${vendor.banner})` }} />
          <div className="vendor-page-header-content">
            <img src={vendor.logo} alt={vendor.name} className="vendor-page-logo" />
            <div className="vendor-page-header-info">
              <h1 className="vendor-page-name">
                {vendor.name}
                {vendor.verified && <span className="vendor-badge-lg-verified">✓ Verified Seller</span>}
              </h1>
              <div className="vendor-page-meta">
                <span className="vendor-page-rating">
                  ★ {averageRating || vendor.rating} ({reviewCount} reviews)
                </span>
                <span>•</span>
                <span>{vendor.location}</span>
                <span>•</span>
                <span>{vendorProducts.length} products</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-page-layout">
          {/* Left: Vendor Info + Rating Breakdown */}
          <aside className="vendor-page-sidebar">
            {/* About */}
            <div className="vendor-page-card">
              <h3 className="vendor-page-card-title">About {vendor.name}</h3>
              <p className="vendor-page-description">{vendor.description}</p>
              <div className="vendor-page-details">
                <div className="vendor-page-detail">
                  <span className="vendor-page-detail-label">Location</span>
                  <span className="vendor-page-detail-value">{vendor.location}</span>
                </div>
                <div className="vendor-page-detail">
                  <span className="vendor-page-detail-label">Ships From</span>
                  <span className="vendor-page-detail-value">{vendor.shippingFrom}</span>
                </div>
                <div className="vendor-page-detail">
                  <span className="vendor-page-detail-label">Response Time</span>
                  <span className="vendor-page-detail-value">{vendor.responseTime}</span>
                </div>
                <div className="vendor-page-detail">
                  <span className="vendor-page-detail-label">Member Since</span>
                  <span className="vendor-page-detail-value">
                    {new Date(vendor.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="vendor-page-card">
              <h3 className="vendor-page-card-title">Seller Rating</h3>
              <div className="vendor-page-rating-large">
                <span className="vendor-page-rating-number">{averageRating || vendor.rating}</span>
                <span className="vendor-page-rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`rating-star ${i < Math.floor(averageRating || vendor.rating) ? '' : 'empty'}`}>★</span>
                  ))}
                </span>
                <span className="vendor-page-rating-count">{vendor.reviewCount} total reviews</span>
              </div>
              <div className="vendor-rating-breakdown">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = ratingBreakdown[stars];
                  const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
                  return (
                    <div key={stars} className="vendor-rating-row">
                      <span className="vendor-rating-label">{stars} ★</span>
                      <div className="vendor-rating-bar">
                        <div className="vendor-rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="vendor-rating-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right: Products + Reviews */}
          <div className="vendor-page-main">
            {/* Products Section */}
            <section className="vendor-page-products">
              <h2 className="section-title">Products by {vendor.name} ({vendorProducts.length})</h2>
              <div className="vendor-products-grid">
                {vendorProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {hasMoreProducts && (
                <div className="vendor-load-more">
                  <button className="btn btn-outline" onClick={loadMoreProducts}>
                    Load More ({displayCount} of {allVendorProducts.length})
                  </button>
                </div>
              )}
              {allVendorProducts.length === 0 && (
                <p className="vendor-page-empty">No products listed by this seller.</p>
              )}
            </section>

            {/* Reviews Section */}
            <section className="vendor-page-reviews">
              <h2 className="section-title">Seller Reviews ({reviewCount})</h2>

              {reviews.length === 0 ? (
                <p className="vendor-page-empty">No reviews yet for this seller.</p>
              ) : (
                <div className="vendor-reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="vendor-review-card">
                      <div className="vendor-review-header">
                        <div className="vendor-review-customer">
                          <span className="vendor-review-avatar">
                            {review.customerName.charAt(0)}
                          </span>
                          <div>
                            <span className="vendor-review-name">{review.customerName}</span>
                            <span className="vendor-review-date">
                              {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="vendor-review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`rating-star ${i < review.rating ? '' : 'empty'}`}>★</span>
                          ))}
                        </div>
                      </div>

                      <h4 className="vendor-review-title">{review.title}</h4>
                      <p className="vendor-review-comment">{review.comment}</p>

                      <div className="vendor-review-footer">
                        <span className="vendor-review-helpful">
                          👍 {review.helpful} people found this helpful
                        </span>
                      </div>

                      {/* Admin Replies */}
                      {review.replies && review.replies.length > 0 && (
                        <div className="vendor-review-replies">
                          {review.replies.map((reply, idx) => (
                            <div key={idx} className="vendor-review-reply">
                              <div className="vendor-review-reply-header">
                                <span className="vendor-review-reply-avatar">✓</span>
                                <span className="vendor-review-reply-author">{reply.author}</span>
                                <span className="vendor-review-reply-date">
                                  {new Date(reply.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                              </div>
                              <p className="vendor-review-reply-text">{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VendorProfilePage;
