import { useState, useMemo } from "react";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import { IconSearch, IconClose, IconCheck } from "@/icons";
import { PRODUCTS, CATEGORIES } from "./PosPage";

/**
 * Style 1 — Two Panel POS
 * Left: searchable product grid organized by category
 * Right: cart / order summary with totals and checkout
 */
const TwoPanelPos = ({ cart, addToCart, updateQty, removeFromCart, clearCart, subtotal, tax, total }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="pos-two-panel">
      {/* ── Left: Products ── */}
      <div className="pos-products">
        {/* Search */}
        <div className="pos-search">
          <InputText
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<IconSearch size={14} />}
          />
        </div>

        {/* Categories */}
        <div className="pos-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pos-cat-btn${activeCategory === cat ? " pos-cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="pos-product-grid">
          {filteredProducts.map((product) => {
            const inCart = cart.find((item) => item.id === product.id);
            return (
              <button
                key={product.id}
                type="button"
                className={`pos-product-card${inCart ? " pos-product-card--in-cart" : ""}`}
                onClick={() => addToCart(product)}
              >
                <span className="pos-product-emoji">{product.emoji}</span>
                <span className="pos-product-name">{product.name}</span>
                <span className="pos-product-price">${product.price.toFixed(2)}</span>
                {inCart && (
                  <span className="pos-product-qty-badge">{inCart.qty}</span>
                )}
              </button>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="pos-empty">No products found</div>
          )}
        </div>
      </div>

      {/* ── Right: Cart ── */}
      <div className="pos-cart">
        <div className="pos-cart-header">
          <h3 className="pos-cart-title">Order</h3>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearCart}>
              Clear all
            </Button>
          )}
        </div>

        <div className="pos-cart-items">
          {cart.length === 0 && <div className="pos-empty">Tap products to add</div>}
          {cart.map((item) => (
            <div key={item.id} className="pos-cart-item">
              <div className="pos-cart-item-info">
                <span className="pos-cart-item-emoji">{item.emoji}</span>
                <div className="pos-cart-item-text">
                  <span className="pos-cart-item-name">{item.name}</span>
                  <span className="pos-cart-item-price">${item.price.toFixed(2)} each</span>
                </div>
              </div>
              <div className="pos-cart-item-controls">
                <div className="pos-qty-control">
                  <button type="button" className="pos-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span className="pos-qty-value">{item.qty}</span>
                  <button type="button" className="pos-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="pos-cart-item-total">${(item.price * item.qty).toFixed(2)}</span>
                <button type="button" className="pos-cart-item-remove" onClick={() => removeFromCart(item.id)}>
                  <IconClose size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pos-totals">
          <div className="pos-total-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="pos-total-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="pos-total-row pos-total-row--grand">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button variant="info" fullWidth onClick={() => alert(`Checkout: $${total.toFixed(2)}`)}>
          <IconCheck size={16} className="icon-left" />
          Checkout · ${total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default TwoPanelPos;
