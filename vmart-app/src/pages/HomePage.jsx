import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { load, KEYS } from "../utils/storage";

export default function HomePage() {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setShops(load(KEYS.SHOPS));
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
  }, []);

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const inStockProducts = products.filter((p) => p.inStock !== false);

  return (
    <section className="page-section home-page">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Welcome</p>
          <h1 className="page-heading">Find your next purchase in one tap.</h1>
        </div>
        <button className="ui-badge" onClick={() => navigate("/cart")}
          style={{ cursor: "pointer", border: "none", position: "relative" }}>
          <FiShoppingCart />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4,
              background: "var(--accent-primary)", color: "#fff",
              fontSize: "0.65rem", fontWeight: 700,
              width: 18, height: 18, borderRadius: "50%",
              display: "grid", placeItems: "center",
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <p className="page-summary">
        Discover {shops.length > 0 ? shops.length : "trending"} shops, browse {inStockProducts.length > 0 ? inStockProducts.length : "fresh"} products, and get fast delivery for every order.
      </p>

      <div className="ui-search">
        <input type="search" className="ui-search-input" placeholder="Search products, brands, or shops"
          onFocus={() => navigate("/shopping")} />
      </div>

      {/* Quick actions */}
      <div className="page-actions">
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
          <h3 className="ui-action-card-title">Orders</h3>
        </div>
        <div className="ui-action-card" onClick={() => navigate("/shop")} style={{ cursor: "pointer" }}>
          <span className="ui-action-card-icon">🏪</span>
          <h3 className="ui-action-card-title">Shops</h3>
        </div>
      </div>

      {/* Shops */}
      {shops.length > 0 && (
        <>
          <h2 style={{ fontSize: "1.1rem", margin: "var(--space-4) 0 0", color: "var(--text-h)" }}>Our Shops</h2>
          <div className="ui-card-grid">
            {shops.slice(0, 4).map((s, idx) => {
              const productCount = inStockProducts.filter((p) => p.shop === s.name).length;
              return (
                <div key={idx} className="ui-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>🏪</div>
                    <div>
                      <h3 className="ui-card-title" style={{ margin: 0 }}>{s.name}</h3>
                      <p className="ui-card-text" style={{ fontSize: "0.8rem", margin: "var(--space-1) 0 0" }}>{s.description || "Fresh products"}</p>
                    </div>
                  </div>
                  <div className="ui-card-meta">
                    <span>{productCount} product{productCount !== 1 ? "s" : ""}</span>
                    <span style={{ color: "var(--accent)", fontWeight: 500 }}>View →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Trending Products */}
      {inStockProducts.length > 0 && (
        <>
          <h2 style={{ fontSize: "1.1rem", margin: "var(--space-2) 0 0", color: "var(--text-h)" }}>Trending Products</h2>
          <div className="ui-card-grid">
            {inStockProducts.slice(0, 4).map((p, idx) => {
              const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
              return (
                <div key={idx} className="ui-card" onClick={() => navigate("/shopping")} style={{ cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--bg-surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: "1.3rem" }}>📦</div>
                    <div style={{ flex: 1 }}>
                      <h3 className="ui-card-title" style={{ margin: 0, fontSize: "0.9rem" }}>{p.name}</h3>
                      {p.shop && <p className="ui-card-text" style={{ fontSize: "0.78rem", margin: "var(--space-1) 0 0" }}>🏪 {p.shop}</p>}
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.1rem" }}>₹{finalPrice.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {shops.length === 0 && inStockProducts.length === 0 && (
        <>
          <div className="ui-card-grid">
            <div className="ui-card">
              <h3 className="ui-card-title">Get Started</h3>
              <p className="ui-card-text">Add shops and products to start selling. Customers can browse and order from multiple vendors.</p>
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
                <button className="ui-btn ui-btn-primary" onClick={() => navigate("/shop")}>Add Shops</button>
                <button className="ui-btn ui-btn-secondary" onClick={() => navigate("/products")}>Add Products</button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
