import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart, FiPackage, FiGrid, FiBox, FiDollarSign, FiAlertTriangle, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "./context/AuthContext";
import { load, KEYS } from "../utils/storage";
import "./HomePage.css";

/* ── Star display ── */
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
  return <span style={{ display: "inline-flex", gap: 1 }}>{stars}</span>;
};

function calcAvg(reviews) {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isCustomer, isShop } = useAuth();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setShops(load(KEYS.SHOPS));
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
    setOrders(load(KEYS.ORDERS));
    setInvoices(load(KEYS.INVOICES));
    setFavorites(load(KEYS.FAVORITES));
    setReviews(load(KEYS.REVIEWS));
  }, []);

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const inStockProducts = products.filter((p) => (p.stock ?? (p.inStock ? 10 : 0)) > 0);

  /* ── Shop Owner Dashboard ── */
  if (isShop) {
    const shopName = user?.shopName || user?.name || "";
    const shopProducts = products.filter((p) => p.shop === shopName);
    const shopOrders = orders.filter((o) => o.shop === shopName);
    const shopInvoices = invoices.filter(
      (inv) => inv.shop === shopName || inv.customer?.name === shopName
    );
    const pendingOrders = shopOrders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
    const totalRevenue = shopInvoices
      .filter((inv) => inv.paymentStatus === "paid")
      .reduce((s, inv) => s + (inv.grandTotal || 0), 0);
    const totalDue = shopInvoices
      .filter((inv) => inv.paymentStatus !== "paid" && inv.paymentStatus !== "partial_paid")
      .reduce((s, inv) => s + (inv.grandTotal || 0), 0);
    const partialDue = shopInvoices
      .filter((inv) => inv.paymentStatus === "partial_paid")
      .reduce((s, inv) => s + ((inv.grandTotal || 0) - (inv.paidAmount || 0)), 0);
    const lowStock = shopProducts.filter((p) => {
      const stock = p.stock ?? (p.inStock ? 10 : 0);
      return stock > 0 && stock <= 5;
    });

    return (
      <section className="page-section home-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">Dashboard</p>
            <h1 className="page-heading">{shopName}</h1>
          </div>
          <button className="ui-badge" onClick={() => navigate("/shop-profile")}
            style={{ cursor: "pointer", border: "none" }}>
            🏪
          </button>
        </div>

        <p className="page-summary">
          Welcome back, {user?.name || "Shop Owner"}! Here's your shop at a glance.
        </p>

        {/* Stats Grid */}
        <div className="home-stats-grid">
          <div className="home-stat-card" onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>
            <div className="home-stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
              <FiBox />
            </div>
            <div className="home-stat-value">{shopProducts.length}</div>
            <div className="home-stat-label">Products</div>
          </div>
          <div className="home-stat-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
            <div className="home-stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
              <FiPackage />
            </div>
            <div className="home-stat-value">{shopOrders.length}</div>
            <div className="home-stat-label">Total Orders</div>
          </div>
          <div className="home-stat-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
            <div className="home-stat-icon" style={{ background: pendingOrders.length > 0 ? "var(--error-bg)" : "rgba(34,197,94,0.1)", color: pendingOrders.length > 0 ? "var(--error)" : "#22c55e" }}>
              <FiAlertTriangle />
            </div>
            <div className="home-stat-value" style={{ color: pendingOrders.length > 0 ? "var(--error)" : "var(--text-h)" }}>
              {pendingOrders.length}
            </div>
            <div className="home-stat-label">Pending</div>
          </div>
          <div className="home-stat-card" onClick={() => navigate("/invoice-collections")} style={{ cursor: "pointer" }}>
            <div className="home-stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <FiDollarSign />
            </div>
            <div className="home-stat-value">₹{(totalRevenue + totalDue + partialDue).toFixed(0)}</div>
            <div className="home-stat-label">Revenue</div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        {shopInvoices.length > 0 && (
          <div className="ui-card">
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Collected</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#22c55e" }}>₹{totalRevenue.toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Outstanding</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--error)" }}>₹{(totalDue + partialDue).toFixed(2)}</div>
              </div>
              <div style={{ flex: 1, minWidth: 100 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>Customers</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>{new Set(shopOrders.map((o) => o.customer?.name)).size}</div>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div className="ui-card" style={{ border: "1px solid orange", background: "rgba(255,165,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "rgba(255,165,0,0.15)", display: "grid", placeItems: "center", fontSize: "1.1rem", color: "orange" }}>
                <FiAlertTriangle />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-h)" }}>{lowStock.length} product{lowStock.length > 1 ? "s" : ""} low in stock</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
                  {lowStock.slice(0, 3).map((p) => p.name).join(", ")}
                  {lowStock.length > 3 ? ` and ${lowStock.length - 3} more` : ""}
                </div>
              </div>
              <button className="ui-btn ui-btn-secondary" onClick={() => navigate("/products")}
                style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                Restock
              </button>
            </div>
          </div>
        )}

        {/* Quick Management Actions */}
        <div className="home-actions-grid">
          <div className="ui-action-card" onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">📦</span>
            <h3 className="ui-action-card-title">Products ({shopProducts.length})</h3>
          </div>
          <div className="ui-action-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">📋</span>
            <h3 className="ui-action-card-title">Orders ({shopOrders.length})</h3>
          </div>
          <div className="ui-action-card" onClick={() => navigate("/invoice")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">🧾</span>
            <h3 className="ui-action-card-title">Invoices ({shopInvoices.length})</h3>
          </div>
          <div className="ui-action-card" onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">🏪</span>
            <h3 className="ui-action-card-title">My Shop</h3>
          </div>
          <div className="ui-action-card" onClick={() => navigate("/customers")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">👥</span>
            <h3 className="ui-action-card-title">Customers</h3>
          </div>
          <div className="ui-action-card" onClick={() => navigate("/invoice-collections")} style={{ cursor: "pointer" }}>
            <span className="ui-action-card-icon">💰</span>
            <h3 className="ui-action-card-title">Collections</h3>
          </div>
        </div>

        {/* Recent Orders */}
        {shopOrders.length > 0 && (
          <div className="ui-card">
            <h3 className="ui-card-title">Recent Orders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[...shopOrders].reverse().slice(0, 5).map((order) => (
                <div key={order.id} onClick={() => navigate("/order")}
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-h)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.customer?.name || "Guest"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
                      ₹{order.grandTotal?.toFixed(2)} · {order.products?.length || 0} item(s)
                    </div>
                  </div>
                  <span className="order-status-badge" data-status={order.status === "delivered" ? "delivered" : order.status === "cancelled" ? "cancelled" : "pending"}>
                    {order.status?.replace(/_/g, " ") || "pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {shopProducts.length === 0 && shopOrders.length === 0 && (
          <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-7) var(--space-4)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🚀</div>
            <h3 style={{ margin: 0, color: "var(--text-h)" }}>Welcome to Your Shop!</h3>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>
              Start by adding products. Customers will find them in the marketplace.
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", marginTop: "var(--space-4)" }}>
              <button className="ui-btn ui-btn-primary" onClick={() => navigate("/products")}>
                <FiBox /> Add Products
              </button>
              <button className="ui-btn ui-btn-secondary" onClick={() => navigate("/shop")}>
                <FiShoppingBag /> Manage Shop
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  /* ── Customer Marketplace ── */
  const userOrders = user ? orders.filter((o) => o.customer?.name === user.name) : [];
  const userInvoices = user ? invoices.filter((inv) => inv.customer?.name === user.name) : [];

  /* Get reviews for a product */
  const getProductReviews = (p) =>
    reviews.filter((r) => r.productName === p.name && r.productShop === (p.shop || ""));

  /* Trending = in-stock products sorted by rating, then discount */
  const trending = [...inStockProducts]
    .map((p) => ({ ...p, avgRating: calcAvg(getProductReviews(p)) }))
    .sort((a, b) => {
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return (b.discount || 0) - (a.discount || 0);
    })
    .slice(0, 4);

  /* Categories from products */
  const categories = [...new Set(inStockProducts.filter((p) => p.category).map((p) => p.category))];

  return (
    <section className="page-section home-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Welcome{user ? `, ${user.name}` : ""}</p>
          <h1 className="page-heading">Virtual Mart</h1>
        </div>
        <button className="ui-badge" onClick={() => navigate("/cart")}
          style={{ cursor: "pointer", border: "none", position: "relative" }}>
          <FiShoppingCart />
          {cartCount > 0 && (
            <span className="cart-badge-count">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <p className="page-summary">
        {shops.length > 0 || inStockProducts.length > 0
          ? `Browse ${inStockProducts.length} products across ${shops.length} shop${shops.length !== 1 ? "s" : ""}.`
          : "Discover products from multiple shops and get fast delivery."}
      </p>

      {/* Search bar */}
      <div className="ui-search">
        <input type="search" id="home-search" name="home-search" className="ui-search-input" placeholder="Search products, brands, or shops"
          onFocus={() => navigate("/shopping")} />
      </div>

      {/* Customer Stats */}
      <div className="home-stats-grid">
        <div className="home-stat-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
          <div className="home-stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
            <FiGrid />
          </div>
          <div className="home-stat-value">{shops.length}</div>
          <div className="home-stat-label">Shops</div>
        </div>
        <div className="home-stat-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
          <div className="home-stat-icon" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
            <FiBox />
          </div>
          <div className="home-stat-value">{inStockProducts.length}</div>
          <div className="home-stat-label">Products</div>
        </div>
        <div className="home-stat-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
          <div className="home-stat-icon" style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            <FiPackage />
          </div>
          <div className="home-stat-value">{userOrders.length}</div>
          <div className="home-stat-label">My Orders</div>
        </div>
        <div className="home-stat-card" onClick={() => navigate("/favorites")} style={{ cursor: "pointer" }}>
          <div className="home-stat-icon" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
            <FiHeart />
          </div>
          <div className="home-stat-value">{favorites.length}</div>
          <div className="home-stat-label">Wishlist</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="home-actions-grid">
        <div className="ui-action-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🛍️</span>
          <h3 className="ui-action-card-title">Shop Now</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🛒</span>
          <h3 className="ui-action-card-title">Cart ({cartCount})</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/order")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">📦</span>
          <h3 className="ui-action-card-title">My Orders</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/favorites")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">❤️</span>
          <h3 className="ui-action-card-title">Wishlist</h3>
        </div>
      </div>

      {/* Category quick links */}
      {categories.length > 0 && (
        <div className="ui-card" style={{ padding: "var(--space-4)" }}>
          <h3 className="ui-card-title" style={{ marginBottom: "var(--space-3)", fontSize: "0.95rem" }}>Shop by Category</h3>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const count = inStockProducts.filter((p) => p.category === cat).length;
              return (
                <button key={cat} onClick={() => navigate("/shopping")}
                  style={{
                    border: "1px solid var(--border)", background: "var(--bg-surface)",
                    borderRadius: "var(--radius-full)", padding: "var(--space-2) var(--space-4)",
                    cursor: "pointer", color: "var(--text)", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "var(--space-2)",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{cat}</span>
                  <span style={{ fontSize: "0.7rem", background: "var(--accent-soft)", color: "var(--accent)", padding: "0 6px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Shops */}
      {shops.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">Our Shops</h2>
            <button className="home-section-link" onClick={() => navigate("/shopping")}>View all</button>
          </div>
          <div className="home-shops-scroll">
            {shops.map((s, idx) => {
              const productCount = inStockProducts.filter((p) => p.shop === s.name).length;
              return (
                <button key={idx} className="home-shop-chip" onClick={() => navigate(`/shopping?shop=${encodeURIComponent(s.name)}`)}>
                  <span className="home-shop-chip-icon">🏪</span>
                  <span className="home-shop-chip-name">{s.name}</span>
                  <span className="home-shop-chip-count">{productCount}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Trending Products */}
      {trending.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">🔥 Trending Now</h2>
            <button className="home-section-link" onClick={() => navigate("/shopping")}>View all</button>
          </div>
          <div className="ui-card-grid">
            {trending.map((p, idx) => {
              const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
              const prodReviews = getProductReviews(p);
              const avgRating = calcAvg(prodReviews);
              return (
                <div key={idx} className="ui-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer", padding: 0, overflow: "hidden" }}>
                  <div className="home-product-image">
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-2)", boxSizing: "border-box" }} />
                    ) : (
                      <span style={{ fontSize: "2rem", opacity: 0.5 }}>📦</span>
                    )}
                    {p.discount > 0 && (
                      <span className="home-discount-badge">-{p.discount}%</span>
                    )}
                  </div>
                  <div style={{ padding: "var(--space-3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-h)" }}>{p.name}</span>
                    </div>
                    {p.shop && (
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/shopping?shop=${encodeURIComponent(p.shop)}`); }}
                        style={{ fontSize: "0.7rem", background: "var(--accent-soft)", color: "var(--accent)", padding: "1px 8px", borderRadius: "var(--radius-full)", fontWeight: 600, border: "none", cursor: "pointer", font: "inherit", colorScheme: "inherit", marginTop: "var(--space-1)", transition: "background 0.1s ease" }}
                        title={`Browse ${p.shop} products`}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-soft-dark)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-soft)"}>
                        🏪 {p.shop}
                      </button>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", marginTop: "var(--space-1)" }}>
                      <StarDisplay rating={Math.round(avgRating)} size={11} />
                      <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>
                        {prodReviews.length > 0 ? `(${prodReviews.length})` : ""}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--accent)" }}>₹{finalPrice.toFixed(2)}</span>
                      {p.discount > 0 && (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", textDecoration: "line-through" }}>
                          ₹{p.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recent Orders Summary */}
      {userOrders.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">📋 Recent Orders</h2>
            <button className="home-section-link" onClick={() => navigate("/order")}>View all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {[...userOrders].reverse().slice(0, 3).map((order) => (
              <div key={order.id} onClick={() => navigate("/order")}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <FiPackage size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-h)" }}>
                    {order.products?.length || 0} item(s) · ₹{order.grandTotal?.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
                    {order.shop && <>🏪 {order.shop}</>}
                  </div>
                </div>
                <span className="order-status-badge" data-status={order.status === "delivered" ? "delivered" : order.status === "cancelled" ? "cancelled" : "pending"}>
                  {order.status?.replace(/_/g, " ") || "pending"}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick invoice summary */}
      {userInvoices.length > 0 && (
        <>
          <div className="home-section-header">
            <h2 className="home-section-title">🧾 Invoices</h2>
            <button className="home-section-link" onClick={() => navigate("/invoice")}>View all</button>
          </div>
          <div className="ui-card" style={{ padding: "var(--space-4)" }}>
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 80 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>Total</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-h)" }}>{userInvoices.length}</div>
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>Paid</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#22c55e" }}>
                  {userInvoices.filter((inv) => inv.paymentStatus === "paid").length}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 80 }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-subtle)", textTransform: "uppercase", fontWeight: 600 }}>Due</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--error)" }}>
                  {userInvoices.filter((inv) => inv.paymentStatus === "due" || inv.paymentStatus === "partial_paid").length}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {shops.length === 0 && inStockProducts.length === 0 && userOrders.length === 0 && (
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-7) var(--space-4)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🛍️</div>
          <h3 style={{ margin: 0, color: "var(--text-h)" }}>Welcome to Virtual Mart!</h3>
          <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>
            Browse products from multiple shops and place orders with ease.
          </p>
          <button className="ui-btn ui-btn-primary" onClick={() => navigate("/shopping")} style={{ marginTop: "var(--space-3)" }}>
            <FiGrid /> Start Shopping
          </button>
        </div>
      )}
    </section>
  );
}
