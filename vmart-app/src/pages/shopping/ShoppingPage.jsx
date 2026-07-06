import { useState, useEffect } from "react";
import { FiShoppingCart, FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function ShoppingPage() {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
    setShops(load(KEYS.SHOPS));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        next = [...prev, { name: product.name, qty: 1, price: product.price || 0, discount: product.discount || 0, shop: product.shop || "" }];
      }
      save(KEYS.CART, next);
      return next;
    });
    showToast(`${product.name} added to cart!`);
  };

  const cartCount = cart.reduce((s, p) => s + p.qty, 0);
  const available = products.filter((p) => p.inStock !== false);

  const categories = [...new Set(available.filter((p) => p.category).map((p) => p.category))];

  const filtered = available.filter((p) => {
    if (selectedShop && p.shop !== selectedShop) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

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

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
        <FiFilter size={14} style={{ color: "var(--text-subtle)" }} />
        <div className="ui-select-wrapper" style={{ flex: 1, minWidth: 130 }}>
          <select className="ui-select" value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
            <option value="">All Shops</option>
            {shops.map((s) => (
              <option key={s.name} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="ui-select-wrapper" style={{ flex: 1, minWidth: 130 }}>
          <select className="ui-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Shop view: list of shops when no filter */}
      {!selectedShop && shops.length > 0 && filtered.length > 0 && (
        <div className="ui-card" style={{ padding: "var(--space-4)" }}>
          <h3 className="ui-card-title" style={{ marginBottom: "var(--space-3)" }}>Shop by Store</h3>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {shops.map((s) => {
              const count = filtered.filter((p) => p.shop === s.name).length;
              if (count === 0) return null;
              return (
                <button key={s.name} onClick={() => setSelectedShop(s.name)}
                  style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", borderRadius: "var(--radius-full)", padding: "var(--space-2) var(--space-4)", cursor: "pointer", color: "var(--text)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  🏪 {s.name}
                  <span className="ui-tag" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          {available.length === 0
            ? "No products available. Add products in the Products page first."
            : "No products match the selected filters."}
        </p>
      ) : (
        <div className="ui-card-grid" style={{ display: "grid", gap: "var(--space-4)" }}>
          {filtered.map((p, idx) => {
            const finalPrice = p.price - (p.price * (p.discount || 0)) / 100;
            return (
              <div key={idx} className="ui-card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{
                  height: 140,
                  background: "var(--bg-surface)",
                  display: "grid", placeItems: "center",
                  fontSize: "2.5rem", color: "var(--text-subtle)",
                  borderBottom: "1px solid var(--border)",
                }}>
                  📦
                </div>
                <div style={{ padding: "var(--space-3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <h3 className="ui-card-title" style={{ margin: 0, fontSize: "0.95rem" }}>{p.name}</h3>
                    {p.category && <span className="ui-tag">{p.category}</span>}
                  </div>
                  {p.shop && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      🏪 {p.shop}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {p.discount > 0 && (
                      <>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)", textDecoration: "line-through" }}>
                          ₹{p.price.toFixed(2)}
                        </span>
                        <span className="ui-tag" style={{ fontSize: "0.7rem" }}>-{p.discount}%</span>
                      </>
                    )}
                  </div>
                  <button className="ui-btn ui-btn-primary" onClick={() => addToCart(p)}
                    style={{ width: "100%", marginTop: "var(--space-2)", fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}>
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
