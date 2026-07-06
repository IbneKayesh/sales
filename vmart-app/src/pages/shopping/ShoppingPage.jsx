import { useState, useEffect, useCallback } from "react";
import { FiShoppingCart, FiFilter, FiHeart, FiSearch, FiStar, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

/* ── Star display helpers ── */
const StarDisplay = ({ rating, size = 12 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{
        color: i <= rating ? "#f59e0b" : "var(--border)",
        fontSize: size,
        lineHeight: 1,
      }}>★</span>
    );
  }
  return <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>{stars}</span>;
};

const StarPicker = ({ value, onChange, size = 24 }) => {
  const [hover, setHover] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 2, alignItems: "center", cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: size, lineHeight: 1, color: i <= (hover || value) ? "#f59e0b" : "var(--border)", transition: "color 0.1s ease, transform 0.1s ease", transform: hover >= i ? "scale(1.15)" : "scale(1)", display: "inline-block" }}>
          ★
        </span>
      ))}
    </span>
  );
};

function calcAvg(reviews) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
}

export default function ShoppingPage() {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [shops, setShops] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Reviews ── */
  const [allReviews, setAllReviews] = useState([]);

  /* ── Detail modal ── */
  const [detailModal, setDetailModal] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  /* ── Review modal (inside detail) ── */
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
    setShops(load(KEYS.SHOPS));
    setFavorites(load(KEYS.FAVORITES));
    setAllReviews(load(KEYS.REVIEWS));

    /* Read ?shop= from URL params to pre-filter */
    const shopParam = searchParams.get("shop");
    if (shopParam) {
      setSelectedShop(shopParam);
    }
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === product.name && f.shop === product.shop);
      let next;
      if (exists) {
        next = prev.filter((f) => !(f.name === product.name && f.shop === product.shop));
        showToast("Removed from favorites");
      } else {
        next = [...prev, { name: product.name, price: product.price, discount: product.discount, category: product.category, shop: product.shop, image: product.image || "" }];
        showToast(`${product.name} saved to favorites!`);
      }
      save(KEYS.FAVORITES, next);
      return next;
    });
  }, [showToast]);

  const isFavorite = useCallback((product) => favorites.some((f) => f.name === product.name && f.shop === product.shop), [favorites]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name && p.shop === product.shop);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.name === product.name && p.shop === product.shop ? { ...p, qty: p.qty + qty } : p
        );
      } else {
        next = [...prev, { name: product.name, qty, price: product.price || 0, discount: product.discount || 0, shop: product.shop || "" }];
      }
      save(KEYS.CART, next);
      return next;
    });
    showToast(`${product.name} added to cart!`);
  }, [showToast]);

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const available = products.filter((p) => (p.stock ?? (p.inStock ? 10 : 0)) > 0);
  const categories = [...new Set(available.filter((p) => p.category).map((p) => p.category))];

  const filtered = available.filter((p) => {
    if (selectedShop && p.shop !== selectedShop) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStockStatus = (p) => {
    const stock = p.stock ?? (p.inStock ? 10 : 0);
    if (stock <= 0) return null;
    if (stock <= 5) return { label: `Only ${stock} left`, color: "orange" };
    return null;
  };

  const getProductReviews = (product) =>
    allReviews.filter((r) => r.productName === product.name && r.productShop === (product.shop || ""));

  /* Open detail modal */
  const openDetail = (product) => {
    setDetailModal(product);
    setDetailQty(1);
    setNewRating(0);
    setNewReviewText("");
  };

  /* Submit review from detail modal */
  const submitReview = () => {
    if (newRating === 0 || !newReviewText.trim()) return;
    const review = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      productName: detailModal.name,
      productShop: detailModal.shop || "",
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
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Shop</p>
          <h1 className="page-heading">Products</h1>
        </div>
        <button className="ui-badge" onClick={() => navigate("/cart")}
          style={{ cursor: "pointer", border: "none", position: "relative" }}>
          <FiShoppingCart />
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -4, right: -4, background: "var(--accent-primary)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center" }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search bar */}
      <div className="ui-search">
        <FiSearch size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" }} />
        <input type="search" id="shopping-search" name="shopping-search" className="ui-search-input" placeholder="Search products by name..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: 36 }} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
        <FiFilter size={14} style={{ color: "var(--text-subtle)" }} />
        <div className="ui-select-wrapper" style={{ flex: 1, minWidth: 130 }}>
          <select id="shopping-shop-filter" name="shopping-shop-filter" className="ui-select" value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
            <option value="">All Shops</option>
            {shops.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div className="ui-select-wrapper" style={{ flex: 1, minWidth: 130 }}>
          <select id="shopping-category-filter" name="shopping-category-filter" className="ui-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Shop by Store chips */}
      {!selectedShop && !searchQuery && shops.length > 0 && filtered.length > 0 && (
        <div className="ui-card" style={{ padding: "var(--space-3)" }}>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {shops.map((s) => {
              const count = filtered.filter((p) => p.shop === s.name).length;
              if (count === 0) return null;
              return (
                <button key={s.name} onClick={() => setSelectedShop(s.name)}
                  style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", borderRadius: "var(--radius-full)", padding: "var(--space-1) var(--space-3)", cursor: "pointer", color: "var(--text)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                  🏪 {s.name}
                  <span style={{ fontSize: "0.65rem", background: "var(--accent-soft)", color: "var(--accent)", padding: "0 5px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Compact product list ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-7) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.8rem", color: "var(--accent)" }}>🛍️</div>
          <div>
            <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1rem" }}>
              {searchQuery ? "No matching products" : available.length === 0 ? "No products available" : "No matching products"}
            </h3>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.85rem", marginTop: "var(--space-1)" }}>
              {searchQuery ? `No products matching "${searchQuery}"` : available.length === 0 ? "Add products in the Products page first." : "Try adjusting the filters."}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {filtered.map((p, idx) => {
            const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
            const stockStatus = getStockStatus(p);
            const prodReviews = getProductReviews(p);
            const avgRating = calcAvg(prodReviews);
            return (
              <div key={idx} className="compact-product-card" onClick={() => openDetail(p)}
                style={{
                  display: "flex", gap: "var(--space-3)", cursor: "pointer",
                  background: "var(--bg-surface)", borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)", overflow: "hidden",
                  transition: "border-color 0.15s ease",
                  minHeight: 76,
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                {/* Thumbnail */}
                <div style={{
                  width: 80, height: 80, flexShrink: 0,
                  background: "var(--bg-surface)", display: "grid", placeItems: "center",
                  position: "relative", overflow: "hidden",
                }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4, boxSizing: "border-box" }} />
                  ) : (
                    <span style={{ fontSize: "1.5rem", opacity: 0.4 }}>📦</span>
                  )}
                  {p.discount > 0 && (
                    <span style={{ position: "absolute", top: 2, left: 2, background: "var(--error)", color: "#fff", fontSize: "0.55rem", fontWeight: 700, padding: "1px 5px", borderRadius: "var(--radius-sm)" }}>
                      -{p.discount}%
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }}
                    style={{
                      position: "absolute", bottom: 2, right: 2,
                      width: 24, height: 24, borderRadius: "50%",
                      border: "none", cursor: "pointer",
                      background: isFavorite(p) ? "var(--error)" : "rgba(0,0,0,0.06)",
                      color: isFavorite(p) ? "#fff" : "var(--text-subtle)",
                      display: "grid", placeItems: "center",
                      fontSize: 12, transition: "all 0.15s ease",
                    }}
                    aria-label={isFavorite(p) ? "Remove from favorites" : "Add to favorites"}>
                    <FiHeart fill={isFavorite(p) ? "currentColor" : "none"} size={10} />
                  </button>
                </div>

                {/* Info */}
                <div style={{ flex: 1, padding: "var(--space-2) var(--space-2) var(--space-2) 0", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
                  {/* Name + shop badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    {p.shop && (
                      <button onClick={(e) => { e.stopPropagation(); setSelectedShop(p.shop); }}
                        style={{ fontSize: "0.6rem", background: "var(--accent-soft)", color: "var(--accent)", padding: "1px 6px", borderRadius: "var(--radius-full)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 80, border: "none", cursor: "pointer", font: "inherit", colorScheme: "inherit", transition: "opacity 0.1s ease" }}
                        title={`Show only ${p.shop} products`}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-soft-dark)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-soft)"}>
                        🏪 {p.shop}
                      </button>
                    )}
                  </div>

                  {/* Rating + stock */}
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "1px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                      <StarDisplay rating={Math.round(avgRating)} size={10} />
                      <span style={{ fontSize: "0.65rem", color: "var(--text-subtle)", fontWeight: 500 }}>
                        {prodReviews.length > 0 ? `${avgRating.toFixed(1)}` : ""}
                      </span>
                    </span>
                    {stockStatus && (
                      <span style={{ fontSize: "0.6rem", color: "orange", fontWeight: 500 }}>{stockStatus.label}</span>
                    )}
                  </div>

                  {/* Price + Add to Cart */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "var(--space-1)" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-1)" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>₹{finalPrice.toFixed(2)}</span>
                      {p.discount > 0 && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textDecoration: "line-through" }}>₹{p.price.toFixed(2)}</span>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      className="ui-btn ui-btn-primary"
                      style={{ fontSize: "0.75rem", padding: "var(--space-1) var(--space-3)", borderRadius: "var(--radius-sm)", gap: "var(--space-1)", height: 30 }}>
                      <FiShoppingCart size={12} /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Product Detail Modal ── */}
      {detailModal && (() => {
        const p = detailModal;
        const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
        const stockStatus = getStockStatus(p);
        const prodReviews = getProductReviews(p);
        const avgRating = calcAvg(prodReviews);
        return (
          <div style={{ position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", animation: "modal-fade-in 0.2s ease" }}
            onClick={() => setDetailModal(null)}>
            <div onClick={(e) => e.stopPropagation()}
              style={{ background: "var(--bg-surface)", width: "100%", maxWidth: 500, borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0", maxHeight: "90vh", overflowY: "auto", animation: "modal-scale-in 0.25s ease" }}>

              {/* Image */}
              <div style={{ width: "100%", aspectRatio: "1", background: "var(--bg-surface)", display: "grid", placeItems: "center", position: "relative", overflow: "hidden", borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0" }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-4)", boxSizing: "border-box" }} />
                ) : (
                  <span style={{ fontSize: "4rem", opacity: 0.3 }}>📦</span>
                )}
                <button onClick={() => setDetailModal(null)}
                  style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.06)", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "var(--icon-md)", color: "var(--text)" }}>
                  <FiX />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p); }}
                  style={{ position: "absolute", top: 12, left: 12, width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer", background: isFavorite(p) ? "var(--error)" : "rgba(0,0,0,0.06)", color: isFavorite(p) ? "#fff" : "var(--text)", display: "grid", placeItems: "center", fontSize: "var(--icon-md)", transition: "all 0.15s ease" }}>
                  <FiHeart fill={isFavorite(p) ? "currentColor" : "none"} />
                </button>
                {p.discount > 0 && (
                  <span style={{ position: "absolute", bottom: 12, left: 12, background: "var(--error)", color: "#fff", fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: "var(--radius-full)" }}>
                    {p.discount}% OFF
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: "var(--space-4)" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ margin: 0, fontSize: "1.15rem", color: "var(--text-h)", fontWeight: 600 }}>{p.name}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                      {p.shop && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1)" }}>
                          <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500 }}>🏪 {p.shop}</span>
                          <button onClick={() => { setDetailModal(null); navigate(`/shopping?shop=${encodeURIComponent(p.shop)}`); }}
                            style={{ fontSize: "0.7rem", color: "var(--accent)", background: "var(--accent-soft)", border: "none", borderRadius: "var(--radius-sm)", padding: "0 6px", cursor: "pointer", fontWeight: 500, font: "inherit", colorScheme: "inherit", lineHeight: "1.6" }}
                            title={`View all products from ${p.shop}`}>
                            View all
                          </button>
                        </span>
                      )}
                      {p.category && <span className="ui-tag" style={{ fontSize: "0.7rem" }}>{p.category}</span>}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)", whiteSpace: "nowrap" }}>₹{finalPrice.toFixed(2)}</span>
                </div>

                {p.discount > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-subtle)", textDecoration: "line-through" }}>₹{p.price.toFixed(2)}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--error)", fontWeight: 600 }}>Save ₹{(p.price - finalPrice).toFixed(2)}</span>
                  </div>
                )}

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginTop: "var(--space-2)", paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--border)" }}>
                  <StarDisplay rating={Math.round(avgRating)} size={16} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-h)" }}>{avgRating.toFixed(1)}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>({prodReviews.length} review{prodReviews.length !== 1 ? "s" : ""})</span>
                  {stockStatus && <span style={{ fontSize: "0.7rem", color: "orange", fontWeight: 500, marginLeft: "auto" }}>{stockStatus.label}</span>}
                </div>

                {/* Description */}
                {p.description && (
                  <div style={{ marginTop: "var(--space-3)" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.6 }}>{p.description}</p>
                  </div>
                )}

                {/* Qty selector + Add to Cart */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    <button onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                      style={{ width: 36, height: 36, border: "none", background: "transparent", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text)", fontSize: "var(--icon-md)" }}>
                      <FiMinus size={14} />
                    </button>
                    <span style={{ width: 36, textAlign: "center", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-h)" }}>{detailQty}</span>
                    <button onClick={() => setDetailQty(detailQty + 1)}
                      style={{ width: 36, height: 36, border: "none", background: "transparent", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text)", fontSize: "var(--icon-md)" }}>
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button className="ui-btn ui-btn-primary" onClick={() => { addToCart(p, detailQty); }}
                    style={{ flex: 1, padding: "var(--space-3)" }}>
                    <FiShoppingCart /> Add to Cart · ₹{(finalPrice * detailQty).toFixed(2)}
                  </button>
                </div>

                {/* Reviews Section */}
                <div style={{ marginTop: "var(--space-4)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
                  <h3 style={{ margin: "0 0 var(--space-3)", fontSize: "0.95rem", color: "var(--text-h)", fontWeight: 600 }}>
                    ⭐ Reviews ({prodReviews.length})
                  </h3>

                  {prodReviews.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      {[...prodReviews].reverse().map((r) => (
                        <div key={r.id} style={{ padding: "var(--space-3)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <StarDisplay rating={r.rating} size={11} />
                            <span style={{ fontSize: "0.65rem", color: "var(--text-subtle)" }}>{formatDate(r.createdAt)}</span>
                          </div>
                          {r.text && <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.8rem", color: "var(--text)", lineHeight: 1.5 }}>{r.text}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", textAlign: "center" }}>Be the first to review this product!</p>
                  )}

                  {/* Add review form */}
                  <div style={{ marginTop: "var(--space-3)", padding: "var(--space-3)", background: "var(--bg-disabled)", borderRadius: "var(--radius-md)" }}>
                    <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.8rem", color: "var(--text-h)", fontWeight: 600 }}>Write a Review</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text)" }}>Rating:</span>
                      <StarPicker value={newRating} onChange={setNewRating} size={18} />
                    </div>
                    <textarea id="shopping-review-text" name="shopping-review-text" className="ui-textarea" placeholder="Share your experience..."
                      rows={2} value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)}
                      style={{ minHeight: 60, fontSize: "0.85rem" }} />
                    <button className="ui-btn ui-btn-primary" onClick={submitReview}
                      disabled={newRating === 0 || !newReviewText.trim()}
                      style={{ width: "100%", marginTop: "var(--space-2)", fontSize: "0.85rem", padding: "var(--space-2)" }}>
                      <FiStar /> Submit Review
                    </button>
                  </div>
                </div>

                <div style={{ height: "var(--space-4)" }} />
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
