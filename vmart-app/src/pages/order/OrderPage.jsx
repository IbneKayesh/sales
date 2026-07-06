import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiList, FiPlusCircle, FiStore, FiSearch } from "react-icons/fi";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };
const emptyCustomer = { name: "", contact: "", address: "" };

export default function OrderPage() {
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("");

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [products, setProducts] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [view, setView] = useState("list");
  const [orderShop, setOrderShop] = useState("");

  useEffect(() => {
    setSavedCustomers(load(KEYS.CUSTOMERS));
    setSavedProducts(load(KEYS.PRODUCTS));
    setSavedOrders(load(KEYS.ORDERS));
    setShops(load(KEYS.SHOPS));
  }, []);

  const calcSubtotal = (item) => {
    const lineTotal = item.qty * item.price;
    const discAmount = item.discount > 0 ? (lineTotal * item.discount) / 100 : 0;
    return lineTotal - discAmount;
  };

  const itemsTotal = products.reduce((sum, item) => sum + calcSubtotal(item), 0);
  const grandTotal = itemsTotal + Number(deliveryCharge);

  const resetForm = () => {
    setCustomer({ ...emptyCustomer });
    setProducts([{ ...defaultProduct }]);
    setDeliveryCharge(0);
    setOrderStatus("pending");
    setPaymentStatus("due");
    setPaidAmount(0);
    setOrderShop("");
    setEditingOrderId(null);
  };

  const handleCustomerSelect = (name) => {
    const found = savedCustomers.find((c) => c.name === name);
    setCustomer(found
      ? { name: found.name, contact: found.contact || "", address: found.address || "" }
      : { ...emptyCustomer });
  };

  const handleCustomerField = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleProductSelect = (index, name) => {
    const found = savedProducts.find((p) => p.name === name);
    setProducts((prev) => {
      const next = [...prev];
      if (found) {
        next[index] = { name: found.name, qty: 1, price: found.price || 0, discount: found.discount || 0 };
      } else {
        next[index] = { ...defaultProduct };
      }
      return next;
    });
  };

  const handleProductField = (index, field, value) => {
    setProducts((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addProduct = () => setProducts((prev) => [...prev, { ...defaultProduct }]);
  const removeProduct = (index) => setProducts((prev) => prev.filter((_, i) => i !== index));

  const statusOptions = ["pending", "in_process", "delivered_to_courier", "delivered"];
  const paymentOptions = ["due", "partial_paid", "paid"];

  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);

  const { showToast, showConfirm } = useUI();

  const placeOrder = () => {
    if (!customer.name.trim()) return;
    const hasProduct = products.some((p) => p.name.trim());
    if (!hasProduct) return;

    const order = {
      id: editingOrderId || generateId(),
      createdAt: editingOrderId
        ? savedOrders.find((o) => o.id === editingOrderId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shop: orderShop || "",
      customer: { ...customer },
      products: products.filter((p) => p.name.trim()).map((p) => ({ ...p })),
      deliveryCharge: Number(deliveryCharge),
      itemsTotal,
      grandTotal,
      status: orderStatus,
      paymentStatus,
      paidAmount: Number(paidAmount),
      invoiceId: null,
    };

    let updated;
    if (editingOrderId) {
      updated = savedOrders.map((o) => (o.id === editingOrderId ? order : o));
    } else {
      updated = [...savedOrders, order];
    }

    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    resetForm();
    setView("list");
    showToast(editingOrderId ? "Order updated successfully" : "Order placed successfully");
  };

  const editOrder = (id) => {
    const order = savedOrders.find((o) => o.id === id);
    if (!order) return;
    setCustomer({ ...order.customer });
    setProducts(order.products.length > 0 ? order.products.map((p) => ({ ...p })) : [{ ...defaultProduct }]);
    setDeliveryCharge(order.deliveryCharge || 0);
    setOrderStatus(order.status || "pending");
    setPaymentStatus(order.paymentStatus || "due");
    setPaidAmount(order.paidAmount || 0);
    setOrderShop(order.shop || "");
    setEditingOrderId(id);
    setView("form");
  };

  const deleteOrder = async (id) => {
    const order = savedOrders.find((o) => o.id === id);
    const confirmed = await showConfirm(`Delete order for ${order?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    const updated = savedOrders.filter((o) => o.id !== id);
    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    if (editingOrderId === id) resetForm();
    showToast("Order deleted", "error");
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return ""; }
  };

  /* Filter orders by shop */
  const filteredOrders = shopFilter
    ? savedOrders.filter((o) => o.shop === shopFilter)
    : savedOrders;

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-heading">{view === "form" ? (editingOrderId ? "Edit Order" : "New Order") : "All Orders"}</h1>
        </div>
        <div className="ui-badge" style={{ cursor: "pointer" }} onClick={() => setView(view === "form" ? "list" : "form")}>
          {view === "form" ? <FiList /> : <FiPlusCircle />}
        </div>
      </div>

      {view === "form" && (
        <>
          {/* Shop selection */}
          <div className="ui-card">
            <h3 className="ui-card-title">Shop / Vendor</h3>
            <div className="ui-form-field">
              <div className="ui-select-wrapper">
                <select className="ui-select" value={orderShop} onChange={(e) => setOrderShop(e.target.value)}>
                  <option value="">Select shop (optional)</option>
                  {shops.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="ui-card">
            <h3 className="ui-card-title">Customer Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="ui-form-field">
                <label className="ui-form-label">Customer Name</label>
                <SearchableSelect value={customer.name} onChange={handleCustomerSelect}
                  options={savedCustomers.map((c) => c.name)} placeholder="Search customers..." />
              </div>
              <div className="ui-form-field">
                <label className="ui-form-label">Contact No</label>
                <input type="tel" className="ui-input" placeholder="Phone number" value={customer.contact}
                  onChange={(e) => handleCustomerField("contact", e.target.value)} />
              </div>
              <div className="ui-form-field">
                <label className="ui-form-label">Address</label>
                <textarea className="ui-textarea" placeholder="Delivery address" rows={2} value={customer.address}
                  onChange={(e) => handleCustomerField("address", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="ui-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <h3 className="ui-card-title" style={{ margin: 0 }}>Products</h3>
              <button className="ui-btn ui-btn-secondary" onClick={addProduct}
                style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}><FiPlus /> Add Product</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {products.map((item, idx) => (
                <div key={idx} style={{ borderRadius: "var(--radius-md)", padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                    <div className="ui-form-field" style={{ flex: 1 }}>
                      <label className="ui-form-label">Product</label>
                      <SearchableSelect value={item.name} onChange={(name) => handleProductSelect(idx, name)}
                        options={savedProducts.filter((p) => p.inStock !== false).map((p) => p.name)}
                        placeholder="Search products..." />
                    </div>
                    {products.length > 1 && (
                      <button onClick={() => removeProduct(idx)}
                        style={{ marginTop: "var(--space-5)", border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                        aria-label="Remove product"><FiTrash2 /></button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                    <div className="ui-form-field">
                      <label className="ui-form-label">Qty</label>
                      <input type="number" className="ui-input" min={1} value={item.qty}
                        onChange={(e) => handleProductField(idx, "qty", Math.max(1, Number(e.target.value)))} />
                    </div>
                    <div className="ui-form-field">
                      <label className="ui-form-label">Price (₹)</label>
                      <input type="number" className="ui-input" min={0} step={0.01} placeholder="0.00" value={item.price || ""}
                        onChange={(e) => handleProductField(idx, "price", Number(e.target.value) || 0)} />
                    </div>
                    <div className="ui-form-field">
                      <label className="ui-form-label">Discount (%)</label>
                      <input type="number" className="ui-input" min={0} max={100} placeholder="0" value={item.discount || ""}
                        onChange={(e) => handleProductField(idx, "discount", Number(e.target.value) || 0)} />
                    </div>
                    <div className="ui-form-field">
                      <label className="ui-form-label">Subtotal</label>
                      <div style={{ padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "1px solid var(--border)", fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>
                        ₹{calcSubtotal(item).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status & Payment */}
          <div className="ui-card">
            <h3 className="ui-card-title">Status</h3>
            <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
              <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="ui-form-label">Order Status</label>
                <div className="ui-select-wrapper">
                  <select className="ui-select" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                    {statusOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
              </div>
              <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                <label className="ui-form-label">Payment Status</label>
                <div className="ui-select-wrapper">
                  <select className="ui-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                    {paymentOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
              </div>
              {paymentStatus === "partial_paid" && (
                <div className="ui-form-field" style={{ flex: 1, minWidth: 100 }}>
                  <label className="ui-form-label">Paid Amount (₹)</label>
                  <input type="number" className="ui-input" min={0} step={0.01} value={paidAmount || ""}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)} />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="ui-card">
            <h3 className="ui-card-title">Order Summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {products.filter((p) => p.name).map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text)" }}>{item.name} × {item.qty}{item.discount > 0 && <span style={{ color: "var(--error)", fontSize: "0.8rem" }}> (-{item.discount}%)</span>}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-h)" }}>₹{calcSubtotal(item).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text)" }}>Items Total</span>
                <span style={{ fontWeight: 600, color: "var(--text-h)" }}>₹{itemsTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text)" }}>Delivery Charge</span>
                <div className="ui-form-field" style={{ width: 120, margin: 0 }}>
                  <input type="number" className="ui-input" min={0} step={0.01} placeholder="0.00" value={deliveryCharge || ""}
                    onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)} style={{ padding: "var(--space-2) var(--space-3)", textAlign: "right" }} />
                </div>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "1.1rem" }}>Grand Total</span>
                <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.3rem" }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="ui-btn ui-btn-primary" onClick={placeOrder} style={{ width: "100%", padding: "var(--space-4)" }}>
            {editingOrderId ? "Update Order" : "Place Order"}
          </button>
        </>
      )}

      {view === "list" && (
        <>
          {/* Shop filter */}
          {shops.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <FiSearch size={14} style={{ color: "var(--text-subtle)" }} />
              <div className="ui-select-wrapper" style={{ flex: 1 }}>
                <select className="ui-select" value={shopFilter} onChange={(e) => setShopFilter(e.target.value)}
                  style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
                  <option value="">All Shops</option>
                  {shops.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
              No orders yet. Place your first order.
            </p>
          ) : (
            <div className="ui-card">
              <h3 className="ui-card-title">All Orders ({filteredOrders.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {[...filteredOrders].reverse().map((order) => (
                  <div key={order.id}
                    style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                    onClick={() => editOrder(order.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{order.customer.name}</span>
                        <span style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 500, background: "var(--accent-soft)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                          ₹{order.grandTotal.toFixed(2)}
                        </span>
                      </div>
                      {order.shop && (
                        <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                          <FiStore size={12} /> {order.shop}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginTop: "var(--space-1)" }}>
                        <span style={{ fontSize: "0.7rem", color: "#fff", background: order.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "1px 8px", borderRadius: "var(--radius-full)", fontWeight: 500 }}>
                          {order.status?.replace(/_/g, " ") || "pending"}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "#fff", background: order.paymentStatus === "paid" ? "green" : order.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "1px 8px", borderRadius: "var(--radius-full)", fontWeight: 500 }}>
                          {order.paymentStatus?.replace(/_/g, " ") || "due"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                        {order.products.length} item{order.products.length > 1 ? "s" : ""}
                        {order.createdAt && <> · {formatDate(order.createdAt)}</>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button onClick={(e) => { e.stopPropagation(); editOrder(order.id); }}
                        style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}
                        aria-label="Edit order"><FiEdit2 /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                        style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}
                        aria-label="Delete order"><FiTrash2 /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
