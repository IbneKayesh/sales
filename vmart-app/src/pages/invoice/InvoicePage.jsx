import { useState, useEffect } from "react";
import { FiFileText, FiArrowLeft, FiPlus, FiTrash2, FiExternalLink, FiX, FiEdit2, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
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
  const { user, isCustomer, isShop } = useAuth();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(false);

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [items, setItems] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [invStatus, setInvStatus] = useState("draft");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);
  const [deliveryAgent, setDeliveryAgent] = useState("");
  const [linkedOrderId, setLinkedOrderId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    setDeliveryAgent("");
    setLinkedOrderId(null);
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (id) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    setCustomer({ ...inv.customer });
    setItems(inv.items.length > 0 ? inv.items.map((i) => ({ ...i })) : [{ ...defaultProduct }]);
    setDeliveryCharge(inv.deliveryCharge || 0);
    setInvStatus(inv.status || "draft");
    setPaymentStatus(inv.paymentStatus || "due");
    setPaidAmount(inv.paidAmount || 0);
    setDeliveryAgent(inv.deliveryAgent || "");
    setLinkedOrderId(inv.linkedOrderId || null);
    setEditingId(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  const loadFromOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setCustomer({ ...order.customer });
    setItems(order.products.map((p) => ({ name: p.name, qty: p.qty, price: p.price, discount: p.discount })));
    setDeliveryCharge(order.deliveryCharge || 0);
    setInvStatus("in_process");
    setDeliveryAgent("");
    setLinkedOrderId(orderId);
    setModal(true);
  };

  const saveInvoice = () => {
    if (!customer.name.trim()) return;
    if (!items.some((i) => i.name.trim())) return;

    const linkedOrder = linkedOrderId ? orders.find((o) => o.id === linkedOrderId) : null;
    const invoice = {
      id: editingId || generateId(),
      invoiceNumber: editingId
        ? invoices.find((i) => i.id === editingId)?.invoiceNumber || `INV-${generateId().slice(0, 8).toUpperCase()}`
        : `INV-${generateId().slice(0, 8).toUpperCase()}`,
      createdAt: editingId
        ? invoices.find((i) => i.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shop: linkedOrder?.shop || "",
      customer: { ...customer },
      items: items.filter((i) => i.name.trim()).map((i) => ({ ...i })),
      deliveryCharge: Number(deliveryCharge),
      deliveryAgent: deliveryAgent.trim(),
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

    closeModal();
    showToast(editingId ? "Invoice updated successfully" : "Invoice created successfully");
  };

  const deleteInvoice = async (id) => {
    const inv = invoices.find((i) => i.id === id);
    const confirmed = await showConfirm(`Delete invoice ${inv?.invoiceNumber || ""} for ${inv?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    const updated = invoices.filter((i) => i.id !== id);
    save(KEYS.INVOICES, updated);
    setInvoices(updated);
    if (editingId === id) closeModal();
    showToast("Invoice deleted", "error");
  };

  /* ── Detail view (early return) ── */
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
            <button className="ui-btn ui-btn-secondary" onClick={() => openEdit(selected.id)}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiEdit2 /></button>
            <button className="ui-btn ui-btn-secondary no-print" onClick={() => navigate(`/invoice/${selected.invoiceNumber}`)}
              style={{ height: 44, padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "0.82rem" }}><FiExternalLink /> Receipt</button>
            <button className="ui-btn ui-btn-primary" onClick={() => navigate(`/invoice/${selected.invoiceNumber}?print=true`)}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiExternalLink /></button>
          </div>
        </div>

        {/* Tracking timeline */}
        {(() => {
          const invStatuses = ["draft", "in_process", "delivered_to_courier", "delivered"];
          const stepLabels = ["Draft", "In Process", "With Courier", "Delivered"];
          const currentIdx = invStatuses.indexOf(selected.status || "draft");
          return (
          <div className="ui-card" style={{ padding: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "var(--space-3) 0" }}>
            {invStatuses.map((step, si) => {
              const isCompleted = si <= currentIdx;
              const isCurrent = si === currentIdx;
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{
                      width: isCurrent ? 14 : 10, height: isCurrent ? 14 : 10,
                      borderRadius: "50%",
                      background: isCompleted ? "var(--accent-primary)" : "var(--border)",
                      boxShadow: isCurrent ? "0 0 0 4px var(--accent-soft)" : "none",
                      transition: "all 0.2s ease",
                    }} />
                    <span style={{ fontSize: "0.7rem", color: isCompleted ? "var(--accent)" : "var(--text-subtle)", fontWeight: isCurrent ? 600 : 400, whiteSpace: "nowrap" }}>
                      {stepLabels[si]}
                    </span>
                  </div>
                  {si < invStatuses.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: si < currentIdx ? "var(--accent-primary)" : "var(--border)", margin: "0 4px", marginBottom: 20, borderRadius: 2 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        );
        })()}

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
                  <span style={{ textAlign: "center", color: item.discount > 0 ? "var(--error)" : "var(--text-subtle)", fontSize: "0.85rem" }}>{item.discount > 0 ? `${item.discount}%` : "\u2014"}</span>
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
              {selected.deliveryAgent && (
                <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--text)" }}>Delivered by</span><span style={{ color: "var(--text-h)" }}>{selected.deliveryAgent}</span>
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
      </section>
    );
  }

  /* ── List view (always visible) ── */
  const roleFilteredInvoices = isCustomer
    ? invoices.filter((inv) => inv.customer?.name === user?.name)
    : isShop
    ? invoices.filter((inv) => inv.shop === (user?.shopName || user?.name))
    : invoices;

  const searchedInvoices = roleFilteredInvoices.filter((inv) =>
    !searchQuery.trim() ||
    inv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Billing</p>
          <h1 className="page-heading">Invoices ({roleFilteredInvoices.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          {!isCustomer && (
            <button className="ui-btn ui-btn-primary" onClick={openAdd}
              style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
              <FiPlus /> New
            </button>
          )}
          <div className="ui-badge"><FiFileText /></div>
        </div>
      </div>

      {/* Create from order (SHOP only) */}
      {!isCustomer && orders.filter(o => !isShop || o.shop === (user?.shopName || user?.name)).length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Create from Order</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...orders].filter(o => !isShop || o.shop === (user?.shopName || user?.name)).reverse().slice(0, 10).map((order) => (
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
      {roleFilteredInvoices.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              <FiFileText />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>No invoices yet</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>
                {isCustomer ? "You don't have any invoices yet." : isShop ? "No invoices for your shop yet." : "Create one from an order or from scratch."}
              </p>
            </div>
          </div>
      ) : (
        <div className="ui-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
            <h3 className="ui-card-title" style={{ margin: 0 }}>All Invoices ({roleFilteredInvoices.length})</h3>
            <div className="ui-search" style={{ flex: 1, maxWidth: 280, minWidth: 160 }}>
              <FiSearch size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-subtle)", pointerEvents: "none" }} />
              <input type="search" id="invoice-search" name="invoice-search" className="ui-search-input" placeholder="Search by customer or invoice..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          {searchedInvoices.length === 0 ? (
            <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-4) 0", fontSize: "0.85rem" }}>
              No invoices match "{searchQuery}"
            </p>
          ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...searchedInvoices].reverse().map((inv) => (
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
                  {inv.deliveryAgent && (
                    <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      🚚 {inv.deliveryAgent}
                      {inv.deliveryCharge > 0 && <span>· ₹{Number(inv.deliveryCharge).toFixed(2)}</span>}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1rem" }}>₹{inv.grandTotal.toFixed(2)}</div>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/invoice/${inv.invoiceNumber}`); }}
                  style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <FiExternalLink size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteInvoice(inv.id); }}
                  style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-4)",
          animation: "modal-fade-in 0.2s ease",
        }} onClick={closeModal}>
          <div style={{
            background: "var(--bg-surface)", width: "100%", maxWidth: 520,
            borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--space-5)",
            maxHeight: "90vh", overflowY: "auto",
            animation: "modal-scale-in 0.25s ease",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>
                {editingId ? "Edit Invoice" : "New Invoice"}
              </h3>
              <button onClick={closeModal}
                style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Customer */}
              <div>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <SearchableSelect id="invoice-customer" value={customer.name} onChange={(name) => {
                    const found = customers.find((c) => c.name === name);
                    setCustomer(found ? { name: found.name, contact: found.contact || "", address: found.address || "" } : { ...emptyCustomer });
                  }} options={customers.map((c) => c.name)} placeholder="Search customers..." />
                  <input type="tel" id="invoice-contact" name="invoice-contact" className="ui-input" placeholder="Contact" value={customer.contact}
                    onChange={(e) => setCustomer((p) => ({ ...p, contact: e.target.value }))} />
                  <textarea id="invoice-address" name="invoice-address" className="ui-textarea" placeholder="Address" rows={2} value={customer.address}
                    onChange={(e) => setCustomer((p) => ({ ...p, address: e.target.value }))} />
                </div>
              </div>

              {/* Items */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Items</h4>
                  <button className="ui-btn ui-btn-secondary" onClick={() => setItems((p) => [...p, { ...defaultProduct }])}
                    style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}><FiPlus /> Add Item</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                        <div className="ui-form-field" style={{ flex: 1 }}>
                          <label className="ui-form-label" htmlFor={`invoice-item-${idx}`}>Item</label>
                          <SearchableSelect id={`invoice-item-${idx}`} value={item.name} onChange={(name) => {
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
                        <div className="ui-form-field"><label className="ui-form-label" htmlFor={`invoice-qty-${idx}`}>Qty</label>
                          <input type="number" id={`invoice-qty-${idx}`} name={`invoice-qty-${idx}`} className="ui-input" min={1} value={item.qty} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], qty: Math.max(1, Number(e.target.value)) }; return n; })} /></div>
                        <div className="ui-form-field"><label className="ui-form-label" htmlFor={`invoice-price-${idx}`}>Price</label>
                          <input type="number" id={`invoice-price-${idx}`} name={`invoice-price-${idx}`} className="ui-input" min={0} step={0.01} value={item.price || ""} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], price: Number(e.target.value) || 0 }; return n; })} /></div>
                        <div className="ui-form-field"><label className="ui-form-label" htmlFor={`invoice-discount-${idx}`}>Disc %</label>
                          <input type="number" id={`invoice-discount-${idx}`} name={`invoice-discount-${idx}`} className="ui-input" min={0} max={100} value={item.discount || ""} onChange={(e) => setItems((prev) => { const n = [...prev]; n[idx] = { ...n[idx], discount: Number(e.target.value) || 0 }; return n; })} /></div>
                      </div>
                      <div style={{ textAlign: "right", fontWeight: 600, color: "var(--accent)", marginTop: "var(--space-1)", fontSize: "0.9rem" }}>
                        ₹{calcSubtotal(item).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Payment */}
              <div>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status & Payment</h4>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="ui-form-label" htmlFor="invoice-status">Status</label>
                    <div className="ui-select-wrapper"><select id="invoice-status" name="invoice-status" className="ui-select" value={invStatus} onChange={(e) => setInvStatus(e.target.value)}>
                      {statusOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                    </select></div>
                  </div>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="ui-form-label" htmlFor="invoice-payment">Payment</label>
                    <div className="ui-select-wrapper"><select id="invoice-payment" name="invoice-payment" className="ui-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                      {paymentOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                    </select></div>
                  </div>
                  {paymentStatus === "partial_paid" && (
                    <div className="ui-form-field" style={{ flex: 1, minWidth: 100 }}>
                      <label className="ui-form-label" htmlFor="invoice-paid">Paid (₹)</label>
                      <input type="number" id="invoice-paid" name="invoice-paid" className="ui-input" min={0} step={0.01} value={paidAmount || ""}
                        onChange={(e) => setPaidAmount(Number(e.target.value) || 0)} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-3)" }}>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="ui-form-label" htmlFor="invoice-delivery-agent">Delivery Agent</label>
                    <input type="text" id="invoice-delivery-agent" name="invoice-delivery-agent" className="ui-input" placeholder="Delivery partner name" value={deliveryAgent}
                      onChange={(e) => setDeliveryAgent(e.target.value)} />
                  </div>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 100 }}>
                    <label className="ui-form-label" htmlFor="invoice-delivery-charge">Delivery Charge (₹)</label>
                    <input type="number" id="invoice-delivery-charge" name="invoice-delivery-charge" className="ui-input" min={0} step={0.01} value={deliveryCharge || ""}
                      onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)} />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span style={{ color: "var(--text-h)" }}>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={saveInvoice} disabled={!customer.name.trim()} style={{ flex: 1 }}>
                  {editingId ? "Update Invoice" : "Create Invoice"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
