import { useState, useEffect } from "react";
import { FiFileText, FiPrinter, FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const statusOptions = ["draft", "in_process", "delivered_to_courier", "delivered"];
const paymentOptions = ["due", "partial_paid", "paid"];

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };
const emptyCustomer = { name: "", contact: "", address: "" };

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
}

const calcSubtotal = (item) => {
  const t = item.qty * item.price;
  const d = item.discount > 0 ? (t * item.discount) / 100 : 0;
  return t - d;
};

export default function InvoicePage() {
  const { showToast, showConfirm } = useUI();
  const [view, setView] = useState("list"); // list | form | detail
  const [selectedId, setSelectedId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [items, setItems] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [invStatus, setInvStatus] = useState("draft");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);
  const [linkedOrderId, setLinkedOrderId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setInvoices(load(KEYS.INVOICES));
    setOrders(load(KEYS.ORDERS));
    setCustomers(load(KEYS.CUSTOMERS));
    setProducts(load(KEYS.PRODUCTS));
  }, []);

  const calcItemTotal = (item) => calcSubtotal(item);
  const itemsTotal = items.reduce((s, i) => s + calcItemTotal(i), 0);
  const grandTotal = itemsTotal + Number(deliveryCharge);

  const resetForm = () => {
    setCustomer({ ...emptyCustomer });
    setItems([{ ...defaultProduct }]);
    setDeliveryCharge(0);
    setInvStatus("draft");
    setPaymentStatus("due");
    setPaidAmount(0);
    setLinkedOrderId(null);
    setEditingId(null);
  };

  const loadFromOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setCustomer({ ...order.customer });
    setItems(order.products.map((p) => ({ name: p.name, qty: p.qty, price: p.price, discount: p.discount })));
    setDeliveryCharge(order.deliveryCharge || 0);
    setInvStatus("in_process");
    setLinkedOrderId(orderId);
    setView("form");
  };

  const saveInvoice = () => {
    if (!customer.name.trim()) return;
    if (!items.some((i) => i.name.trim())) return;

    const invoice = {
      id: editingId || generateId(),
      invoiceNumber: editingId
        ? invoices.find((i) => i.id === editingId)?.invoiceNumber || `INV-${generateId().slice(0, 8).toUpperCase()}`
        : `INV-${generateId().slice(0, 8).toUpperCase()}`,
      createdAt: editingId
        ? invoices.find((i) => i.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: { ...customer },
      items: items.filter((i) => i.name.trim()).map((i) => ({ ...i })),
      deliveryCharge: Number(deliveryCharge),
      itemsTotal,
      grandTotal,
      status: invStatus,
      paymentStatus,
      paidAmount: Number(paidAmount),
      linkedOrderId,
    };

    let updated;
    if (editingId) {
      updated = invoices.map((i) => (i.id === editingId ? invoice : i));
    } else {
      updated = [...invoices, invoice];
    }
    save(KEYS.INVOICES, updated);
    setInvoices(updated);

    if (linkedOrderId) {
      const updatedOrders = orders.map((o) =>
        o.id === linkedOrderId
          ? { ...o, status: invStatus, paymentStatus, paidAmount: Number(paidAmount), invoiceId: invoice.id }
          : o
      );
      save(KEYS.ORDERS, updatedOrders);
      setOrders(updatedOrders);
    }

    resetForm();
    setView("list");
    showToast(editingId ? "Invoice updated successfully" : "Invoice created successfully");
  };

  const editInvoice = (id) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    setCustomer({ ...inv.customer });
    setItems(inv.items.length > 0 ? inv.items.map((i) => ({ ...i })) : [{ ...defaultProduct }]);
    setDeliveryCharge(inv.deliveryCharge || 0);
    setInvStatus(inv.status || "draft");
    setPaymentStatus(inv.paymentStatus || "due");
    setPaidAmount(inv.paidAmount || 0);
    setLinkedOrderId(inv.linkedOrderId || null);
    setEditingId(id);
    setView("form");
  };

  const deleteInvoice = async (id) => {
    const inv = invoices.find((i) => i.id === id);
    const confirmed = await showConfirm(`Delete invoice ${inv?.invoiceNumber || ""} for ${inv?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    const updated = invoices.filter((i) => i.id !== id);
    save(KEYS.INVOICES, updated);
    setInvoices(updated);
    if (editingId === id) resetForm();
    showToast("Invoice deleted", "error");
  };

  const handlePrint = () => window.print();

  /* ── Detail view ── */
  const selected = invoices.find((i) => i.id === selectedId);

  if (selectedId && selected) {
    return (
      <section className="page-section">
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">{selected.invoiceNumber}</p>
            <h1 className="page-heading" style={{ fontSize: "1.2rem" }}>{selected.customer.name}</h1>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button className="ui-btn ui-btn-secondary" onClick={() => setSelectedId(null)}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiArrowLeft /></button>
            <button className="ui-btn ui-btn-primary" onClick={handlePrint}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiPrinter /></button>
          </div>
        </div>

        <div className="invoice" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{ background: "radial-gradient(circle at center, var(--accent-primary), var(--accent-primary-end))", color: "var(--text-inverse)", padding: "var(--space-5) var(--space-4)", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: "inherit" }}>VIRTUAL MART</h2>
            <p style={{ margin: "var(--space-1) 0 0", fontSize: "0.8rem", opacity: 0.85 }}>{selected.invoiceNumber}</p>
          </div>
          <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {/* Status badges */}
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", color: "#fff", background: selected.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "2px 10px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
                {selected.status?.replace(/_/g, " ") || "draft"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "#fff", background: selected.paymentStatus === "paid" ? "green" : selected.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "2px 10px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
                {selected.paymentStatus?.replace(/_/g, " ") || "due"}
              </span>
              {selected.paymentStatus === "partial_paid" && (
                <span style={{ fontSize: "0.75rem", color: "var(--text)", padding: "2px 10px", fontWeight: 500 }}>
                  Paid: ₹{selected.paidAmount?.toFixed(2)} / ₹{selected.grandTotal.toFixed(2)}
                </span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: 500, textTransform: "uppercase" }}>Bill To</div>
                <div style={{ fontWeight: 600, color: "var(--text-h)", marginTop: "var(--space-1)" }}>{selected.customer.name}</div>
                {selected.customer.contact && <div style={{ fontSize: "0.85rem", color: "var(--text)" }}>{selected.customer.contact}</div>}
                {selected.customer.address && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>{selected.customer.address}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: 500, textTransform: "uppercase" }}>Date</div>
                <div style={{ fontWeight: 600, color: "var(--text-h)", marginTop: "var(--space-1)" }}>{formatDate(selected.createdAt)}</div>
              </div>
            </div>
            {/* Items */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase" }}>
                <span>Item</span><span style={{ textAlign: "center" }}>Qty</span><span style={{ textAlign: "right" }}>Price</span><span style={{ textAlign: "center" }}>Disc</span><span style={{ textAlign: "right" }}>Total</span>
              </div>
              {selected.items.map((item, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: "var(--space-2)", padding: "var(--space-3)", borderBottom: idx < selected.items.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.9rem", alignItems: "center" }}>
                  <span style={{ color: "var(--text-h)" }}>{item.name}</span>
                  <span style={{ textAlign: "center", color: "var(--text)" }}>{item.qty}</span>
                  <span style={{ textAlign: "right", color: "var(--text)" }}>₹{item.price.toFixed(2)}</span>
                  <span style={{ textAlign: "center", color: item.discount > 0 ? "var(--error)" : "var(--text-subtle)", fontSize: "0.85rem" }}>{item.discount > 0 ? `${item.discount}%` : "—"}</span>
                  <span style={{ textAlign: "right", fontWeight: 600, color: "var(--text-h)" }}>₹{calcSubtotal(item).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-end" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text)" }}>Subtotal</span><span style={{ color: "var(--text-h)" }}>₹{selected.itemsTotal.toFixed(2)}</span>
              </div>
              {selected.deliveryCharge > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "0.9rem" }}>
                  <span style={{ color: "var(--text)" }}>Delivery</span><span style={{ color: "var(--text-h)" }}>₹{Number(selected.deliveryCharge).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "1.1rem", fontWeight: 700, borderTop: "1px solid var(--border)", paddingTop: "var(--space-2)" }}>
                <span style={{ color: "var(--text-h)" }}>Total</span><span style={{ color: "var(--accent)" }}>₹{selected.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "var(--space-3) var(--space-4)", textAlign: "center", fontSize: "0.75rem", color: "var(--text-subtle)", borderTop: "1px solid var(--border)" }}>
            Thank you for your business!
          </div>
        </div>
        <style>{`@media print { body { background: #fff !important; } .app-header, .nav-bar, .drawer-overlay, .drawer-panel, .ui-btn { display: none !important; } .app-main { padding: 0 !important; overflow: visible !important; } .app-shell { box-shadow: none !important; border-radius: 0 !important; max-height: none !important; overflow: visible !important; } .invoice { border: none !important; border-radius: 0 !important; } }`}</style>
      </section>
    );
  }

  /* ── Form view ── */
  if (view === "form") {
    return (
      <section className="page-section">
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">Billing</p>
            <h1 className="page-heading">{editingId ? "Edit Invoice" : "New Invoice"}</h1>
          </div>
          <button className="ui-btn ui-btn-secondary" onClick={() => { resetForm(); setView("list"); }}
            style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiArrowLeft /></button>
        </div>

        {/* Customer */}
        <div className="ui-card">
          <h3 className="ui-card-title">Customer</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <SearchableSelect value={customer.name} onChange={(name) => {
              const found = customers.find((c) => c.name === name);
              setCustomer(found ? { name: found.name, contact: found.contact || "", address: found.address || "" } : { ...emptyCustomer });
            }} options={customers.map((c) => c.name)} placeholder="Search customers..." />
            <input type="tel" className="ui-input" placeholder="Contact" value={customer.contact}
              onChange={(e) => setCustomer((p) => ({ ...p, contact: e.target.value }))} />
            <textarea className="ui-textarea" placeholder="Address" rows={2} value={customer.address}
              onChange={(e) => setCustomer((p) => ({ ...p, address: e.target.value }))} />
          </div>
        </div>

        {/* Items */}
        <div className="ui-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
            <h3 className="ui-card-title" style={{ margin: 0 }}>Items</h3>
            <button className="ui-btn ui-btn-secondary" onClick={() => setItems((p) => [...p, { ...defaultProduct }])}
              style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}><FiPlus /> Add Item</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                  <div className="ui-form-field" style={{ flex: 1 }}>
                    <label className="ui-form-label">Item</label>
                    <SearchableSelect value={item.name} onChange={(name) => {
                      const found = products.find((p) => p.name === name);
                      setItems((prev) => { const n = [...prev]; n[idx] = found ? { name: found.name, qty: 1, price: found.price || 0, discount: found.discount || 0 } : { ...defaultProduct }; return n; });
                    }} options={products.filter((p) => p.inStock !== false).map((p) => p.name)} placeholder="Search products..." />
                  </div>
                  {items.length > 1 && (
                    <button onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                      style={{ marginTop: "var(--space-5)", border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}><FiTrash2 /></button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                  <div className="ui-form-field"><label className="ui-form-label">Qty</label>
                    <input type="number" className="ui-input" min={1} value={item.qty} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], qty: Math.max(1, Number(e.target.value)) }; return n; })} /></div>
                  <div className="ui-form-field"><label className="ui-form-label">Price</label>
                    <input type="number" className="ui-input" min={0} step={0.01} value={item.price || ""} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], price: Number(e.target.value) || 0 }; return n; })} /></div>
                  <div className="ui-form-field"><label className="ui-form-label">Disc %</label>
                    <input type="number" className="ui-input" min={0} max={100} value={item.discount || ""} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], discount: Number(e.target.value) || 0 }; return n; })} /></div>
                </div>
                <div style={{ textAlign: "right", fontWeight: 600, color: "var(--accent)", marginTop: "var(--space-1)", fontSize: "0.9rem" }}>
                  ₹{calcSubtotal(item).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="ui-card">
          <h3 className="ui-card-title">Status & Payment</h3>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
              <label className="ui-form-label">Status</label>
              <div className="ui-select-wrapper"><select className="ui-select" value={invStatus} onChange={(e) => setInvStatus(e.target.value)}>
                {statusOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
              </select></div>
            </div>
            <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
              <label className="ui-form-label">Payment</label>
              <div className="ui-select-wrapper"><select className="ui-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                {paymentOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
              </select></div>
            </div>
            {paymentStatus === "partial_paid" && (
              <div className="ui-form-field" style={{ flex: 1, minWidth: 100 }}>
                <label className="ui-form-label">Paid (₹)</label>
                <input type="number" className="ui-input" min={0} step={0.01} value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)} />
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-3)", fontWeight: 700, fontSize: "1.1rem" }}>
            <span style={{ color: "var(--text-h)" }}>Total</span>
            <span style={{ color: "var(--accent)" }}>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <button className="ui-btn ui-btn-primary" onClick={saveInvoice} style={{ width: "100%", padding: "var(--space-4)" }}>
          {editingId ? "Update Invoice" : "Create Invoice"}
        </button>
      </section>
    );
  }

  /* ── List view ── */
  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Billing</p>
          <h1 className="page-heading">Invoices ({invoices.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-secondary" onClick={() => setView("form")}
            style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}><FiPlus /> New</button>
          <div className="ui-badge"><FiFileText /></div>
        </div>
      </div>

      {/* Create from order */}
      {orders.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Create from Order</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...orders].reverse().slice(0, 10).map((order) => (
              <div key={order.id} onClick={() => loadFromOrder(order.id)}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>{order.customer.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>₹{order.grandTotal.toFixed(2)} · {order.products.length} items</div>
                </div>
                <span className="ui-tag">Create Invoice</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No invoices yet. Create one from an order or from scratch.
        </p>
      ) : (
        <div className="ui-card">
          <h3 className="ui-card-title">All Invoices</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...invoices].reverse().map((inv) => (
              <div key={inv.id}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer" }}
                onClick={() => setSelectedId(inv.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.9rem" }}>{inv.customer.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)", fontFamily: "monospace" }}>{inv.invoiceNumber}</span>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                    <span style={{ fontSize: "0.7rem", color: "#fff", background: inv.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                      {inv.status?.replace(/_/g, " ") || "draft"}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#fff", background: inv.paymentStatus === "paid" ? "green" : inv.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                      {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                    </span>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1rem" }}>₹{inv.grandTotal.toFixed(2)}</div>
                <button onClick={(e) => { e.stopPropagation(); editInvoice(inv.id); }}
                  style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <FiPrinter size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteInvoice(inv.id); }}
                  style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
