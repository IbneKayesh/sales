import { useState, useEffect } from "react";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { showToast, setBusy } = useUI();
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setFavorites(load(KEYS.FAVORITES));
    setCart(load(KEYS.CART));
  }, []);

  const removeFavorite = (product) => {
    setBusy(true);
    setFavorites((prev) => {
      const next = prev.filter(
        (f) => !(f.name === product.name && f.shop === product.shop),
      );
      save(KEYS.FAVORITES, next);
      return next;
    });
    showToast("Removed from favorites");
    setBusy(false);
  };

  const addToCart = (product) => {
    setBusy(true);
    setCart((prev) => {
      const existing = prev.find((p) => p.name === product.name);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.name === product.name ? { ...p, qty: p.qty + 1 } : p,
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
    setBusy(false);
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Saved items</p>
          <h1 className="page-heading">Favorites ({favorites.length})</h1>
        </div>
        <div className="fav-header-actions">
          <button
            className="ui-badge fav-back-btn"
            onClick={() => navigate("/shopping")}
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
        <div className="fav-empty-state">
          <div className="fav-empty-icon">
            <FiHeart />
          </div>
          <div>
            <h3 className="fav-empty-heading">No favorites yet</h3>
            <p className="fav-empty-text">
              Save products you love by tapping the heart icon on any product.
            </p>
          </div>
          <button
            className="ui-btn ui-btn-primary fav-empty-btn"
            onClick={() => navigate("/shopping")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="fav-list">
          {favorites.map((product, idx) => {
            const finalPrice =
              product.price - (product.price * (product.discount || 0)) / 100;
            return (
              <div
                key={`${product.name}-${product.shop}-${idx}`}
                className="fav-card"
              >
                <div className="fav-card-content">
                  {/* Header */}
                  <div className="fav-card-header">
                    <div className="fav-card-info">
                      <h3 className="ui-card-title fav-card-title">
                        {product.name}
                      </h3>
                      {product.category && (
                        <span className="ui-tag fav-category-tag">
                          {product.category}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFavorite(product)}
                      className="fav-remove-btn"
                      aria-label="Remove from favorites"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* Shop chip */}
                  {product.shop && (
                    <button
                      onClick={() =>
                        navigate(
                          `/shopping?shop=${encodeURIComponent(product.shop)}`,
                        )
                      }
                      className="fav-shop-chip"
                      title={`Browse all products from ${product.shop}`}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "var(--accent-soft-dark)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "var(--accent-soft)")
                      }
                    >
                      🏪 {product.shop}
                    </button>
                  )}

                  {/* Price */}
                  <div className="fav-price-row">
                    <span className="fav-price-current">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="fav-price-original">
                          ₹{product.price.toFixed(2)}
                        </span>
                        <span className="ui-tag fav-discount-tag">
                          -{product.discount}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    className="ui-btn ui-btn-primary fav-add-btn"
                    onClick={() => addToCart(product)}
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
