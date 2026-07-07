import { useState } from "react";
import {
  FiShoppingCart,
  FiHeart,
  FiStar,
  FiX,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUI } from "../pages/context/UIContext";
import { load, save, KEYS } from "../utils/storage";
import { formatDate, calcAvg } from "../utils/helpers";
import StarDisplay from "./StarDisplay";
import StarPicker from "./StarPicker";

export default function ProductDetailModal({ product, onClose, cart, onAddToCart, onToggleFavorite, isFavorite }) {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [qty, setQty] = useState(1);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [allReviews, setAllReviews] = useState(() => load(KEYS.REVIEWS));

  const p = product;
  const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;

  const getStock = (prod) => prod.stock ?? (prod.inStock ? 10 : 0);
  const getStockStatus = (prod) => {
    const stock = getStock(prod);
    if (stock <= 0) return { label: "Out of stock", color: "var(--error)" };
    if (stock <= 5) return { label: `Only ${stock} left`, color: "orange" };
    return { label: `${stock} in stock`, color: "green" };
  };
  const stockStatus = getStockStatus(p);

  const getProductReviews = (prod) =>
    allReviews.filter((r) => r.productName === prod.name && r.productShop === (prod.shop || ""));
  const prodReviews = getProductReviews(p);
  const avgRating = calcAvg(prodReviews);

  const isInCart = cart.some((c) => c.name === p.name && c.shop === p.shop);
  const getCartItem = cart.find((c) => c.name === p.name && c.shop === p.shop);

  const submitReview = () => {
    if (newRating === 0 || !newReviewText.trim()) return;
    const review = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      productName: p.name,
      productShop: p.shop || "",
      rating: newRating,
      text: newReviewText.trim(),
      customerName: "Customer",
      createdAt: new Date().toISOString(),
    };
    const updated = [...allReviews, review];
    setAllReviews(updated);
    save(KEYS.REVIEWS, updated);
    setNewRating(0);
    setNewReviewText("");
    showToast("Review submitted successfully!");
  };

  return (
    <div className="shop-detail-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="shop-detail-panel">
        {/* Image */}
        <div className="shop-detail-image-wrap">
          {p.image ? <img src={p.image} alt={p.name} className="shop-detail-img" />
            : <span className="shop-detail-placeholder">📦</span>}
          <button onClick={onClose} className="shop-detail-close-btn"><FiX /></button>
          <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(p); }}
            className={`shop-detail-fav-btn${isFavorite(p) ? " shop-detail-fav-btn--active" : " shop-detail-fav-btn--inactive"}`}>
            <FiHeart fill={isFavorite(p) ? "currentColor" : "none"} />
          </button>
          {p.discount > 0 && <span className="shop-detail-discount-badge">{p.discount}% OFF</span>}
        </div>

        {/* Content */}
        <div className="shop-detail-body">
          {/* Header */}
          <div className="shop-detail-header">
            <div className="shop-detail-name-area">
              <h2 className="shop-detail-name">{p.name}</h2>
              <div className="shop-detail-meta">
                {p.shop && (
                  <span className="shop-detail-shop-label">
                    <span className="shop-detail-shop-name">🏪 {p.shop}</span>
                    <button onClick={() => { onClose(); navigate(`/shopping?shop=${encodeURIComponent(p.shop)}`); }}
                      className="shop-detail-view-all-btn" title={`View all products from ${p.shop}`}>View all</button>
                  </span>
                )}
                {p.category && <span className="ui-tag shop-detail-category-tag">{p.category}</span>}
              </div>
            </div>
            <span className="shop-detail-price">₹{finalPrice.toFixed(2)}</span>
          </div>

          {p.discount > 0 && (
            <div className="shop-detail-discount-row">
              <span className="shop-detail-old-price">₹{p.price.toFixed(2)}</span>
              <span className="shop-detail-save-amount">Save ₹{(p.price - finalPrice).toFixed(2)}</span>
            </div>
          )}

          {/* Rating */}
          <div className="shop-detail-rating-row">
            <StarDisplay rating={Math.round(avgRating)} size={16} />
            <span className="shop-detail-rating-num">{avgRating.toFixed(1)}</span>
            <span className="shop-detail-review-count">({prodReviews.length} review{prodReviews.length !== 1 ? "s" : ""})</span>
            {stockStatus && <span className="shop-detail-stock-status" style={{ color: stockStatus.color }}>{stockStatus.label}</span>}
          </div>

          {/* Description */}
          {p.description && (
            <div className="shop-detail-desc">
              <p className="shop-detail-desc-text">{p.description}</p>
            </div>
          )}

          {/* Qty selector + Add to Cart */}
          <div className="shop-detail-actions">
            {getStock(p) <= 0 ? (
              <div className="shop-detail-oos"><span className="shop-detail-oos-text">Out of Stock</span></div>
            ) : (
              <>
                <div className="shop-detail-qty-selector">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="shop-detail-qty-btn"><FiMinus size={14} /></button>
                  <span className="shop-detail-qty-value">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="shop-detail-qty-btn"><FiPlus size={14} /></button>
                </div>
                {isInCart ? (
                  <button className="shop-detail-cart-btn" onClick={() => navigate("/cart")}>
                    ✓ In Cart · Qty: {getCartItem?.qty || 0}
                  </button>
                ) : (
                  <button className="ui-btn ui-btn-primary shop-detail-add-btn" onClick={() => onAddToCart(p, qty)}>
                    <FiShoppingCart /> Add to Cart · ₹{(finalPrice * qty).toFixed(2)}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Reviews Section */}
          <div className="shop-reviews-section">
            <h3 className="shop-reviews-title">⭐ Reviews ({prodReviews.length})</h3>

            {prodReviews.length > 0 ? (
              <div className="shop-reviews-list">
                {[...prodReviews].reverse().map((r) => (
                  <div key={r.id} className="shop-review-item">
                    <div className="shop-review-header">
                      <StarDisplay rating={r.rating} size={11} />
                      <span className="shop-review-date">{formatDate(r.createdAt)}</span>
                    </div>
                    {r.text && <p className="shop-review-text">{r.text}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="shop-no-reviews">Be the first to review this product!</p>
            )}

            {/* Add review form */}
            <div className="shop-add-review-box">
              <h4 className="shop-add-review-title">Write a Review</h4>
              <div className="shop-add-review-rating">
                <span className="shop-add-review-label">Rating:</span>
                <StarPicker value={newRating} onChange={setNewRating} size={18} />
              </div>
              <textarea id="shopping-review-text" name="shopping-review-text" className="ui-textarea shop-review-textarea"
                placeholder="Share your experience..." rows={2} value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)} />
              <button className="ui-btn ui-btn-primary shop-submit-review-btn" onClick={submitReview}
                disabled={newRating === 0 || !newReviewText.trim()}>
                <FiStar /> Submit Review
              </button>
            </div>
          </div>

          <div className="shop-detail-spacer" />
        </div>
      </div>
    </div>
  );
}
