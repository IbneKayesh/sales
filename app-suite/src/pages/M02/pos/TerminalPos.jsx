import { useState, useMemo } from "react";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Badge from "@/components/Badge";
import { IconSearch, IconClose, IconCheck, IconReceipt } from "@/icons";
import { PRODUCTS, CATEGORIES } from "./PosPage";

/**
 * Style 3 — Terminal POS
 * Cashier-style layout:
 *   Left:  receipt / order summary
 *   Right: quick-add product buttons, category filter, number pad for qty
 */
const TerminalPos = ({ cart, addToCart, updateQty, removeFromCart, clearCart, subtotal, tax, total, itemCount }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [numPadValue, setNumPadValue] = useState("");

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "All" || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const handleNumPad = (digit) => {
    setNumPadValue((prev) => prev + digit);
  };

  const applyNumPad = () => {
    const qty = parseInt(numPadValue, 10);
    if (selectedItemId && qty > 0) {
      updateQty(selectedItemId, qty);
    }
    setNumPadValue("");
  };

  const clearNumPad = () => setNumPadValue("");

  const handleProductClick = (product) => {
    addToCart(product);
    setSelectedItemId(product.id);
  };

  return (
    <div className="pos-terminal">
      {/* ── Left: Receipt ── */}
      <div className="pos-terminal-receipt">
        <div className="pos-terminal-receipt-header">
          <IconReceipt size={20} />
          <h3>Receipt</h3>
          <Badge variant="info">{itemCount} items</Badge>
        </div>

        <div className="pos-terminal-receipt-items">
          {cart.length === 0 && <div className="pos-empty">No items yet</div>}
          {cart.map((item) => (
            <div
              key={item.id}
              className={`pos-terminal-receipt-item${selectedItemId === item.id ? " pos-terminal-receipt-item--selected" : ""}`}
              onClick={() => setSelectedItemId(item.id)}
            >
              <div className="pos-terminal-receipt-item-left">
                <span className="pos-terminal-receipt-item-emoji">{item.emoji}</span>
                <span className="pos-terminal-receipt-item-name">{item.name}</span>
              </div>
              <div className="pos-terminal-receipt-item-right">
                <span className="pos-terminal-receipt-item-qty">×{item.qty}</span>
                <span className="pos-terminal-receipt-item-total">${(item.price * item.qty).toFixed(2)}</span>
                <button
                  type="button"
                  className="pos-cart-item-remove"
                  onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                >
                  <IconClose size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pos-terminal-receipt-divider" />

        <div className="pos-totals pos-totals--terminal">
          <div className="pos-total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="pos-total-row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="pos-total-row pos-total-row--grand"><span>TOTAL</span><span>${total.toFixed(2)}</span></div>
        </div>

        <Button variant="info" fullWidth onClick={() => alert(`Checkout: $${total.toFixed(2)}`)}>
          <IconCheck size={16} className="icon-left" />
          PAY · ${total.toFixed(2)}
        </Button>

        {cart.length > 0 && (
          <Button variant="ghost" size="sm" fullWidth onClick={clearCart} style={{ marginTop: 4 }}>
            Clear Order
          </Button>
        )}
      </div>

      {/* ── Right: Products + Number Pad ── */}
      <div className="pos-terminal-controls">
        {/* Search */}
        <InputText
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<IconSearch size={14} />}
        />

        {/* Categories */}
        <div className="pos-categories pos-categories--compact">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pos-cat-btn pos-cat-btn--sm${activeCategory === cat ? " pos-cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Buttons */}
        <div className="pos-terminal-products">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              className="pos-terminal-product-btn"
              onClick={() => handleProductClick(product)}
            >
              <span className="pos-terminal-product-emoji">{product.emoji}</span>
              <span className="pos-terminal-product-name">{product.name}</span>
              <span className="pos-terminal-product-price">${product.price.toFixed(2)}</span>
            </button>
          ))}
        </div>

        {/* Number Pad for Quantity */}
        {selectedItemId && (
          <div className="pos-numpad">
            <div className="pos-numpad-display">
              <span className="pos-numpad-label">Set Qty:</span>
              <span className="pos-numpad-value">{numPadValue || "—"}</span>
            </div>
            <div className="pos-numpad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                <button key={d} type="button" className="pos-numpad-btn" onClick={() => handleNumPad(String(d))}>
                  {d}
                </button>
              ))}
              <button type="button" className="pos-numpad-btn pos-numpad-btn--fn" onClick={clearNumPad}>C</button>
              <button type="button" className="pos-numpad-btn" onClick={() => handleNumPad("0")}>0</button>
              <button type="button" className="pos-numpad-btn pos-numpad-btn--fn" onClick={applyNumPad}>
                <IconCheck size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalPos;
