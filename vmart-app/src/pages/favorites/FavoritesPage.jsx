import { useState, useEffect } from "react";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setFavorites(load(KEYS.FAVORITES));
    setCart(load(KEYS.CART));
  }, []);

  const removeFavorite = (product) => {
    setFavorites((prev) => {
      const next = prev.filter(
        (f) => !(f.name === product.name && f.shop === product.shop)
      );
      save(KEYS.FAVORITES, next);
      return next;
    });
    showToast("Removed from favorites");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        next = [
          ...prev,
          {
            name: product.name,
            qty: 1,
            price: product.price || 0,
            discount: product.discount || 0,
            shop: product.shop || "",
          },
        ];
      }
      save(KEYS.CART, next);
      return next;
    });
    showToast(`${product.name} added to cart!`);
  };

  const cardBase = {
    borderRadius: "var(--radius-xl)",
    border: "1px solid var(--border)",
    overflow: "hidden",
    background: "var(--bg-surface)",
  };

  const contentStyle = {
    padding: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Saved items</p>
          <h1 className="page-heading">Favorites ({favorites.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            className="ui-badge"
            onClick={() => navigate("/shopping")}
            style={{ cursor: "pointer", border: "none" }}
            aria-label="Back to shopping"
          >
            <FiArrowLeft />
          </button>
          <div className="ui-badge">
            <FiHeart />
          </div>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "var(--space-8) var(--space-4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "grid",
              placeItems: "center",
              fontSize: "2rem",
              color: "var(--accent)",
            }}
          >
            <FiHeart />
          </div>
          <div>
            <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>
              No favorites yet
            </h3>
            <p
              style={{
                color: "var(--text-subtle)",
                fontSize: "0.9rem",
                marginTop: "var(--space-2)",
              }}
            >
              Save products you love by tapping the heart icon on any product.
            </p>
          </div>
          <button
            className="ui-btn ui-btn-primary"
            onClick={() => navigate("/shopping")}
            style={{ padding: "var(--space-3) var(--space-6)" }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {favorites.map((product, idx) => {
            const finalPrice =
              product.price -
              (product.price * (product.discount || 0)) / 100;
            return (
              <div key={`${product.name}-${product.shop}-${idx}`} style={cardBase}>
                <div style={contentStyle}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        className="ui-card-title"
                        style={{ margin: 0, fontSize: "1rem" }}
                      >
                        {product.name}
                      </h3>
                      {product.category && (
                        <span
                          className="ui-tag"
                          style={{ marginTop: "var(--space-1)", display: "inline-block" }}
                        >
                          {product.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFavorite(product)}
                      style={{
                        border: "none",
                        background: "var(--error-bg)",
                        color: "var(--error)",
                        width: 36,
                        height: 36,
                        borderRadius: "var(--radius-md)",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "opacity 0.15s ease",
                      }}
                      aria-label="Remove from favorites"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* Shop chip */}
                  {product.shop && (
                    <button
                      onClick={() => navigate(`/shopping?shop=${encodeURIComponent(product.shop)}`)}
                      style={{
                        fontSize: "0.75rem",
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                        padding: "2px 10px",
                        borderRadius: "var(--radius-full)",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        font: "inherit",
                        colorScheme: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        transition: "background 0.1s ease",
                      }}
                      title={`Browse all products from ${product.shop}`}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--accent-soft-dark)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "var(--accent-soft)"}
                    >
                      🏪 {product.shop}
                    </button>
                  )}

                  {/* Price */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "var(--space-2)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "var(--accent)",
                      }}
                    >
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-subtle)",
                            textDecoration: "line-through",
                          }}
                        >
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span
                          className="ui-tag"
                          style={{ fontSize: "0.7rem", background: "var(--error-bg)", color: "var(--error)" }}
                        >
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    className="ui-btn ui-btn-primary"
                    onClick={() => addToCart(product)}
                    style={{
                      width: "100%",
                      fontSize: "0.85rem",
                      padding: "var(--space-3)",
                    }}
                  >
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
