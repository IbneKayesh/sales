import { useState, useMemo } from "react";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Badge from "@/components/Badge";
import { IconSearch, IconPlus, IconClose, IconDelete, IconCheck } from "@/icons";
import { PRODUCTS, CATEGORIES } from "./PosPage";

/**
 * Style 2 — Full Grid POS
 * Full-width product grid with category tabs at top,
 * floating cart overlay that opens on the right when items exist.
 */
const FullGridPos = ({ cart, addToCart, updateQty, removeFromCart, clearCart, subtotal, tax, total, itemCount }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  // Group products by category for display
  const groupedProducts = useMemo(() => {
    if (activeCategory !== "All") return null;
    const groups = {};
    filteredProducts.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts, activeCategory]);

  return (
    <div className="pos-full-grid">
      {/* Top bar: search + categories */}
      <div className="pos-full-grid-toolbar">
        <div className="pos-full-grid-search">
          <InputText
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<IconSearch size={14} />}
          />
        </div>
        <div className="pos-categories pos-categories--scroll">
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
        {/* Cart toggle for small screens */}
        {itemCount > 0 && (
          <Button variant="info" size="sm" onClick={() => setShowCart(!showCart)} className="pos-cart-toggle">
            <IconCheck size={14} className="icon-left" />
            {itemCount} items · ${total.toFixed(2)}
          </Button>
        )}
      </div>

      <div className="pos-full-grid-content">
        {/* Product Grid */}
        <div className={`pos-full-grid-products${showCart ? " pos-full-grid-products--compressed" : ""}`}>
          {activeCategory !== "All" ? (
            <div className="pos-product-grid pos-product-grid--full">
              {filteredProducts.map((product) => {
                const inCart = cart.find((item) => item.id === product.id);
                return (
                  <button
                    key={product.id}
                    type="button"
                    className={`pos-product-card pos-product-card--lg${inCart ? " pos-product-card--in-cart" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    <span className="pos-product-emoji pos-product-emoji--lg">{product.emoji}</span>
                    <span className="pos-product-name">{product.name}</span>
                    <span className="pos-product-price">${product.price.toFixed(2)}</span>
                    {inCart && <span className="pos-product-qty-badge">{inCart.qty}</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            Object.entries(groupedProducts || {}).map(([category, products]) => (
              <div key={category} className="pos-full-grid-section">
                <h4 className="pos-full-grid-section-title">{category}</h4>
                <div className="pos-product-grid pos-product-grid--full">
                  {products.map((product) => {
                    const inCart = cart.find((item) => item.id === product.id);
                    return (
                      <button
                        key={product.id}
                        type="button"
                        className={`pos-product-card pos-product-card--lg${inCart ? " pos-product-card--in-cart" : ""}`}
                        onClick={() => addToCart(product)}
                      >
                        <span className="pos-product-emoji pos-product-emoji--lg">{product.emoji}</span>
                        <span className="pos-product-name">{product.name}</span>
                        <span className="pos-product-price">${product.price.toFixed(2)}</span>
                        {inCart && <span className="pos-product-qty-badge">{inCart.qty}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Sidebar */}
        <div className={`pos-cart pos-cart--sidebar${showCart ? " pos-cart--open" : ""}`}>
          <div className="pos-cart-header">
            <h3 className="pos-cart-title">Cart ({itemCount})</h3>
            <div className="pos-cart-header-actions">
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart}>Clear</Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                <IconClose size={14} />
              </Button>
            </div>
          </div>

          <div className="pos-cart-items">
            {cart.length === 0 && <div className="pos-empty">Cart is empty</div>}
            {cart.map((item) => (
              <div key={item.id} className="pos-cart-item">
                <div className="pos-cart-item-info">
                  <span className="pos-cart-item-emoji">{item.emoji}</span>
                  <div className="pos-cart-item-text">
                    <span className="pos-cart-item-name">{item.name}</span>
                    <span className="pos-cart-item-price">${item.price.toFixed(2)}</span>
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

          <div className="pos-totals">
            <div className="pos-total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="pos-total-row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="pos-total-row pos-total-row--grand"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <Button variant="info" fullWidth onClick={() => alert(`Checkout: $${total.toFixed(2)}`)}>
            <IconCheck size={16} className="icon-left" />
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FullGridPos;
