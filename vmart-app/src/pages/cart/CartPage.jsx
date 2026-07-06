import { useState, useEffect } from "react";
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function CartPage() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useUI();
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [createdOrders, setCreatedOrders] = useState([]);

  useEffect(() => {
    setCart(load(KEYS.CART));
    setCustomers(load(KEYS.CUSTOMERS));
  }, []);

  const updateQty = (name, delta) => {
    setCart((prev) => {
      const next = prev.map((p) =>
        p.name === name ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      );
      save(KEYS.CART, next);
      return next;
    });
  };

  const removeItem = async (name) => {
    const confirmed = await showConfirm(`Remove ${name} from cart?`);
    if (!confirmed) return;
    setCart((prev) => {
      const next = prev.filter((p) => p.name !== name);
      save(KEYS.CART, next);
      return next;
    });
    showToast("Item removed from cart", "error");
  };

  const calcSubtotal = (item) => {
    const t = item.qty * item.price;
    const d = item.discount > 0 ? (t * item.discount) / 100 : 0;
    return t - d;
  };

  /* Group cart items by shop */
  const groupByShop = (items) => {
    const groups = {};
    items.forEach((item) => {
      const shop = item.shop || "General";
      if (!groups[shop]) groups[shop] = { shop, items: [] };
      groups[shop].items.push(item);
    });
    return Object.values(groups);
  };

  const shopGroups = groupByShop(cart);

  const calcGroupTotal = (group) => {
    return group.items.reduce((s, p) => s + calcSubtotal(p), 0);
  };

  const grandTotal = cart.reduce((s, p) => s + calcSubtotal(p), 0);

  /* Capture group count before cart is cleared */
  const orderGroupCount = shopGroups.length;

  const confirmOrder = () => {
    if (!customerName.trim() || cart.length === 0) return;

    const found = customers.find((c) => c.name === customerName);
    const orders = load(KEYS.ORDERS);
    const newOrders = [];

    /* Create one order per shop group */
    shopGroups.forEach((group) => {
      const groupTotal = calcGroupTotal(group);
      const order = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shop: group.shop,
        customer: found
          ? { name: found.name, contact: found.contact || "", address: found.address || "" }
          : { name: customerName, contact: "", address: "" },
        products: group.items.map((p) => ({ ...p })),
        deliveryCharge: 0,
        itemsTotal: groupTotal,
        grandTotal: groupTotal,
        status: "pending",
        paymentStatus: "due",
        paidAmount: 0,
        invoiceId: null,
      };
      newOrders.push(order);
      orders.push(order);
    });

    save(KEYS.ORDERS, orders);
    save(KEYS.CART, []);
    setCart([]);
    setCreatedOrders(newOrders);
    setConfirmed(true);
    showToast(`${newOrders.length} order(s) placed successfully!`);
  };

  if (confirmed) {
    return (
      <section className="page-section">
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">Cart</p>
            <h1 className="page-heading">Order Placed!</h1>
          </div>
          <div className="ui-badge"><FiShoppingCart /></div>
        </div>
        <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-7)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>✅</div>
          <h3 style={{ margin: 0, color: "var(--text-h)" }}>Order confirmed!</h3>
          <p className="page-summary" style={{ marginTop: "var(--space-2)" }}>
            {createdOrders.length} order(s) placed across {orderGroupCount} shop(s).
          </p>
          {createdOrders.length > 1 && (
            <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-2)" }}>
              {createdOrders.map((o) => (
                <div key={o.id}>🏪 {o.shop} — {o.products.length} item(s)</div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)", justifyContent: "center" }}>
            <button className="ui-btn ui-btn-primary" onClick={() => navigate("/order")}>
              View Orders
            </button>
            <button className="ui-btn ui-btn-secondary" onClick={() => navigate("/shopping")}>
              Shop More
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Cart</p>
          <h1 className="page-heading">Your Cart ({cart.length})</h1>
        </div>
        <div className="ui-badge"><FiShoppingCart /></div>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              <FiShoppingCart />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>Your cart is empty</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>Browse products to add items to your cart.</p>
            </div>
            <button className="ui-btn ui-btn-primary" onClick={() => navigate("/shopping")}
              style={{ padding: "var(--space-3) var(--space-6)" }}>
              Browse Products
            </button>
          </div>
      ) : (
        <>
          {/* Grouped by shop */}
          {shopGroups.map((group) => (
            <div key={group.shop} className="ui-card" style={{ padding: "var(--space-4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)", color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>
                <FiShoppingBag /> {group.shop}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {group.items.map((item, idx) => (
                  <div key={idx} style={{ borderBottom: idx < group.items.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: idx < group.items.length - 1 ? "var(--space-3)" : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <h3 className="ui-card-title" style={{ margin: 0, fontSize: "0.95rem" }}>{item.name}</h3>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                          ₹{item.price.toFixed(2)}/item
                          {item.discount > 0 && <span style={{ color: "var(--error)", marginLeft: "var(--space-2)" }}>-{item.discount}%</span>}
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.name)}
                        style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                        aria-label="Remove item"><FiTrash2 /></button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                        <button onClick={() => updateQty(item.name, -1)}
                          style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", width: 32, height: 32, borderRadius: "var(--radius-sm)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                          <FiMinus size={14} />
                        </button>
                        <span style={{ fontWeight: 600, color: "var(--text-h)", minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.name, 1)}
                          style={{ border: "1px solid var(--border)", background: "var(--bg-surface)", width: 32, height: 32, borderRadius: "var(--radius-sm)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1rem" }}>
                        ₹{calcSubtotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "right", marginTop: "var(--space-2)", fontWeight: 700, fontSize: "1rem", color: "var(--text-h)" }}>
                Shop Total: ₹{calcGroupTotal(group).toFixed(2)}
              </div>
            </div>
          ))}

          {/* Customer selection */}
          <div className="ui-card">
            <h3 className="ui-card-title">Customer</h3>
            <SearchableSelect
              value={customerName}
              onChange={setCustomerName}
              options={customers.map((c) => c.name)}
              placeholder="Search or type customer name..."
            />
            {/* SearchableSelect has an internal input with id="searchable-select-input" */}
          </div>

          {/* Summary */}
          <div className="ui-card">
            <h3 className="ui-card-title">Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text)" }}>Items Total</span>
                <span style={{ fontWeight: 600, color: "var(--text-h)" }}>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "1.1rem" }}>Total</span>
                <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.3rem" }}>₹{grandTotal.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                Order will be split into {orderGroupCount} order(s) by shop. Each shop receives its own order.
              </div>
            </div>
          </div>

          <button className="ui-btn ui-btn-primary" onClick={confirmOrder}
            style={{ width: "100%", padding: "var(--space-4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}
            disabled={!customerName.trim() || cart.length === 0}>
            <FiArrowRight /> Confirm & Place Orders ({orderGroupCount})
          </button>
        </>
      )}
    </section>
  );
}
