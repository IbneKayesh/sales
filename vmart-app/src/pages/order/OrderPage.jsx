import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiSearch, FiShoppingBag, FiArrowLeft, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { load, save, KEYS } from "../../utils/storage";

/* Helper: resolve invoice ID to invoice number */
function invoiceNumberFromId(invoiceId) {
  const invoices = load(KEYS.INVOICES);
  const inv = invoices.find((i) => i.id === invoiceId);
  return inv?.invoiceNumber || invoiceId;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };
const emptyCustomer = { name: "", contact: "", address: "" };

const statusOptions = ["pending", "in_process", "delivered_to_courier", "delivered"];
const paymentOptions = ["due", "partial_paid", "paid"];

export default function OrderPage() {
  const navigate = useNavigate();
  const { user, isCustomer, isShop } = useAuth();
  const { showToast, showConfirm } = useUI();
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("");

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [products, setProducts] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderShop, setOrderShop] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (id) => {
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
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetForm();
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

  const saveOrder = () => {
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

    /* Sync status to linked invoice */
    if (editingOrderId) {
      const existingOrder = savedOrders.find((o) => o.id === editingOrderId);
      if (existingOrder?.invoiceId) {
        const allInvoices = load(KEYS.INVOICES);
        const updatedInvoices = allInvoices.map((inv) =>
          inv.id === existingOrder.invoiceId
            ? { ...inv, status: orderStatus, paymentStatus, paidAmount: Number(paidAmount), updatedAt: new Date().toISOString() }
            : inv
        );
        save(KEYS.INVOICES, updatedInvoices);
      }
    }

    closeModal();
    showToast(editingOrderId ? "Order updated successfully" : "Order placed successfully");
  };

  const deleteOrder = async (id) => {
    const order = savedOrders.find((o) => o.id === id);
    const confirmed = await showConfirm(`Delete order for ${order?.customer?.name || "this customer"}?`);
    if (!confirmed) return;
    const updated = savedOrders.filter((o) => o.id !== id);
    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    if (editingOrderId === id) closeModal();
    showToast("Order deleted", "error");
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return ""; }
  };

  /* ── Detail view: inline status update ── */
  const [detailStatus, setDetailStatus] = useState("");

  const updateOrderStatus = () => {
    if (!selectedOrderId || !detailStatus) return;
    setSavedOrders((prev) => {
      const next = prev.map((o) =>
        o.id === selectedOrderId
          ? { ...o, status: detailStatus, updatedAt: new Date().toISOString() }
          : o
      );
      save(KEYS.ORDERS, next);

      /* Sync to linked invoice */
      const updatedOrder = next.find((o) => o.id === selectedOrderId);
      if (updatedOrder?.invoiceId) {
        const allInvoices = load(KEYS.INVOICES);
        const updatedInvoices = allInvoices.map((inv) =>
          inv.id === updatedOrder.invoiceId
            ? { ...inv, status: detailStatus, updatedAt: new Date().toISOString() }
            : inv
        );
        save(KEYS.INVOICES, updatedInvoices);
      }

      return next;
    });
    showToast(`Order status updated to "${detailStatus.replace(/_/g, " ")}"`);
  };

  /* ── Detail view (early return) ── */
  const selectedOrder = savedOrders.find((o) => o.id === selectedOrderId);

  if (selectedOrderId && selectedOrder) {
    /* Enlarged tracking timeline */
    const statuses = ["pending", "in_process", "delivered_to_courier", "delivered"];
    const stepLabels = ["Pending", "Processing", "With Courier", "Delivered"];
    const currentIdx = statuses.indexOf(selectedOrder.status || "pending");

    return (
      <section className="page-section">
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">Order Details</p>
            <h1 className="page-heading" style={{ fontSize: "1.2rem" }}>{selectedOrder.customer.name}</h1>
          </div>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button className="ui-btn ui-btn-secondary" onClick={() => setSelectedOrderId(null)}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiArrowLeft /></button>
            <button className="ui-btn ui-btn-secondary" onClick={() => openEdit(selectedOrder.id)}
              style={{ width: 44, height: 44, padding: 0, display: "grid", placeItems: "center" }}><FiEdit2 /></button>
            {selectedOrder.invoiceId && (
              <button className="ui-btn ui-btn-secondary" onClick={() => navigate(`/invoice/${invoiceNumberFromId(selectedOrder.invoiceId)}`)}
                style={{ height: 44, padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "0.82rem" }}><FiFileText /> Invoice</button>
            )}
          </div>
        </div>

        {/* Tracking timeline */}
        <div className="ui-card" style={{ padding: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "var(--space-3) 0" }}>
            {statuses.map((step, si) => {
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
                  {si < statuses.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: si < currentIdx ? "var(--accent-primary)" : "var(--border)", margin: "0 4px", marginBottom: 20, borderRadius: 2 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order info */}
        <div className="ui-card">
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</div>
              <div style={{ fontWeight: 600, color: "var(--text-h)", marginTop: "var(--space-1)" }}>{selectedOrder.customer.name}</div>
              {selectedOrder.customer.contact && <div style={{ fontSize: "0.85rem", color: "var(--text)", marginTop: "2px" }}>{selectedOrder.customer.contact}</div>}
              {selectedOrder.customer.address && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>{selectedOrder.customer.address}</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              {selectedOrder.shop && (
                <>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shop</div>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", marginTop: "var(--space-1)" }}>🏪 {selectedOrder.shop}</div>
                </>
              )}
            </div>
          </div>
          {/* Inline status update (shop only) */}
          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
            {isShop ? (
              <>
                <div className="ui-select-wrapper" style={{ flex: 1, minWidth: 160 }}>
                  <select className="ui-select" value={detailStatus || selectedOrder.status}
                    onChange={(e) => setDetailStatus(e.target.value)}
                    style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.85rem" }}>
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                    ))}
                  </select>
                </div>
                <button className="ui-btn ui-btn-primary" onClick={updateOrderStatus}
                  disabled={!detailStatus || detailStatus === selectedOrder.status}
                  style={{ padding: "var(--space-2) var(--space-3)", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                  Update
                </button>
              </>
            ) : (
              <span style={{ fontSize: "0.75rem", color: "#fff", background: selectedOrder.status === "delivered" ? "var(--accent-primary)" : "var(--text-subtle)", padding: "2px 10px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
                {selectedOrder.status?.replace(/_/g, " ") || "pending"}
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "#fff", background: selectedOrder.paymentStatus === "paid" ? "green" : selectedOrder.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "2px 10px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
              {selectedOrder.paymentStatus?.replace(/_/g, " ") || "due"}
            </span>
            {selectedOrder.paymentStatus === "partial_paid" && (
              <span style={{ fontSize: "0.75rem", color: "var(--text)", padding: "2px 10px", fontWeight: 500 }}>
                Paid: ₹{selectedOrder.paidAmount?.toFixed(2)} / ₹{selectedOrder.grandTotal.toFixed(2)}
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-2)" }}>
            {formatDate(selectedOrder.createdAt)}
          </div>
        </div>

        {/* Products */}
        <div className="ui-card">
          <h3 className="ui-card-title">Products ({selectedOrder.products.length})</h3>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 1fr 1fr", gap: "var(--space-2)", padding: "var(--space-2) var(--space-3)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", marginBottom: "var(--space-1)" }}>
              <span>Item</span><span style={{ textAlign: "center" }}>Qty</span><span style={{ textAlign: "center" }}>Disc</span><span style={{ textAlign: "right" }}>Total</span>
            </div>
            {selectedOrder.products.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 1fr 1fr", gap: "var(--space-2)", padding: "var(--space-3)", borderBottom: idx < selectedOrder.products.length - 1 ? "1px solid var(--border)" : "none", fontSize: "0.9rem", alignItems: "center" }}>
                <span style={{ color: "var(--text-h)" }}>{item.name}</span>
                <span style={{ textAlign: "center", color: "var(--text)" }}>{item.qty}</span>
                <span style={{ textAlign: "center", color: item.discount > 0 ? "var(--error)" : "var(--text-subtle)", fontSize: "0.85rem" }}>{item.discount > 0 ? `${item.discount}%` : "—"}</span>
                <span style={{ textAlign: "right", fontWeight: 600, color: "var(--text-h)" }}>₹{calcSubtotal(item).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--space-2)", paddingTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)", alignItems: "flex-end" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "0.9rem" }}>
              <span style={{ color: "var(--text)" }}>Subtotal</span>
              <span style={{ color: "var(--text-h)" }}>₹{selectedOrder.itemsTotal.toFixed(2)}</span>
            </div>
            {selectedOrder.deliveryCharge > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text)" }}>Delivery</span>
                <span style={{ color: "var(--text-h)" }}>₹{Number(selectedOrder.deliveryCharge).toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", width: "min(100%, 200px)", fontSize: "1.1rem", fontWeight: 700, borderTop: "1px solid var(--border)", paddingTop: "var(--space-2)" }}>
              <span style={{ color: "var(--text-h)" }}>Total</span>
              <span style={{ color: "var(--accent)" }}>₹{selectedOrder.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {selectedOrder.invoiceId && (
          <div className="ui-card" style={{ textAlign: "center", padding: "var(--space-4)" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", margin: 0 }}>
              This order has an invoice.
            </p>
            <button className="ui-btn ui-btn-primary" onClick={() => navigate(`/invoice/${invoiceNumberFromId(selectedOrder.invoiceId)}`)}
              style={{ marginTop: "var(--space-2)" }}>
              <FiFileText /> View Invoice
            </button>
          </div>
        )}

        <button className="ui-btn ui-btn-secondary" onClick={() => deleteOrder(selectedOrder.id)}
          style={{ width: "100%", padding: "var(--space-4)", color: "var(--error)" }}>
          <FiTrash2 /> Delete Order
        </button>
      </section>
    );
  }

  /* Filter orders by role */
  const roleFiltered = isCustomer
    ? savedOrders.filter((o) => o.customer?.name === user?.name)
    : isShop
    ? savedOrders.filter((o) => o.shop === (user?.shopName || ""))
    : savedOrders;

  /* Filter orders by shop */
  const filteredOrders = shopFilter
    ? roleFiltered.filter((o) => o.shop === shopFilter)
    : roleFiltered;

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-heading">All Orders ({filteredOrders.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-primary" onClick={openAdd}
            style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
            <FiPlus /> Add
          </button>
          <div className="ui-badge"><FiShoppingBag /></div>
        </div>
      </div>

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

      {filteredOrders.length === 0 ? (          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              <FiShoppingBag />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>No orders yet</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>
                {isCustomer
                  ? "Start shopping to place your first order."
                  : isShop
                  ? "No orders for your shop yet."
                  : "Tap 'Add' to create one."}
              </p>
            </div>
          </div>
      ) : (
        <div className="ui-card">
          <h3 className="ui-card-title">All Orders ({filteredOrders.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {[...filteredOrders].reverse().map((order) => (
              <div key={order.id}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                onClick={() => setSelectedOrderId(order.id)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{order.customer.name}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 500, background: "var(--accent-soft)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                      ₹{order.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  {order.shop && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                      <FiShoppingBag size={12} /> {order.shop}
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
                  {/* Order tracking timeline */}
              <div style={{ marginTop: "var(--space-2)", display: "flex", alignItems: "center", gap: 0 }}>
                {["pending", "in_process", "delivered_to_courier", "delivered"].map((step, si) => {
                  const stepLabels = ["Pending", "Processing", "With Courier", "Delivered"];
                  const statuses = ["pending", "in_process", "delivered_to_courier", "delivered"];
                  const currentIdx = statuses.indexOf(order.status || "pending");
                  const isCompleted = si <= currentIdx;
                  const isCurrent = si === currentIdx;
                  return (
                    <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
                        <div style={{
                          width: isCurrent ? 10 : 8, height: isCurrent ? 10 : 8,
                          borderRadius: "50%",
                          background: isCompleted ? "var(--accent-primary)" : "var(--border)",
                          boxShadow: isCurrent ? "0 0 0 3px var(--accent-soft)" : "none",
                          transition: "all 0.2s ease",
                        }} />
                        <span style={{ fontSize: "0.6rem", color: isCompleted ? "var(--accent)" : "var(--text-subtle)", fontWeight: isCurrent ? 600 : 400, whiteSpace: "nowrap" }}>
                          {stepLabels[si]}
                        </span>
                      </div>
                      {si < statuses.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: si < currentIdx ? "var(--accent-primary)" : "var(--border)", margin: "0 2px", marginBottom: 14 }} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                {order.products.length} item{order.products.length > 1 ? "s" : ""}
                {order.createdAt && <> · {formatDate(order.createdAt)}</>}
              </div>
            </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(order.id); }}
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
                {editingOrderId ? "Edit Order" : "New Order"}
              </h3>
              <button onClick={closeModal}
                style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {/* Shop */}
              <div>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shop / Vendor</h4>
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

              {/* Customer */}
              <div>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer Details</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div className="ui-form-field">
                    <label className="ui-form-label" htmlFor="order-customer-name">Customer Name</label>
                    <SearchableSelect id="order-customer" value={customer.name} onChange={handleCustomerSelect}
                      options={savedCustomers.map((c) => c.name)} placeholder="Search customers..." />
                  </div>
                  <div className="ui-form-field">
                    <label className="ui-form-label" htmlFor="order-contact">Contact No</label>
                    <input type="tel" id="order-contact" name="order-contact" className="ui-input" placeholder="Phone number" value={customer.contact}
                      onChange={(e) => handleCustomerField("contact", e.target.value)} />
                  </div>
                  <div className="ui-form-field">
                    <label className="ui-form-label" htmlFor="order-address">Address</label>
                    <textarea id="order-address" name="order-address" className="ui-textarea" placeholder="Delivery address" rows={2} value={customer.address}
                      onChange={(e) => handleCustomerField("address", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                  <h4 style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Products</h4>
                  <button className="ui-btn ui-btn-secondary" onClick={addProduct}
                    style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}><FiPlus /> Add Product</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  {products.map((item, idx) => (
                    <div key={idx} style={{ borderRadius: "var(--radius-md)", padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)", border: "1px solid var(--border)" }}>
                      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
                        <div className="ui-form-field" style={{ flex: 1 }}>
                          <label className="ui-form-label" htmlFor={`order-product-${idx}`}>Product</label>
                          <SearchableSelect id={`order-product-${idx}`} value={item.name} onChange={(name) => handleProductSelect(idx, name)}
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
                          <label className="ui-form-label" htmlFor={`order-qty-${idx}`}>Qty</label>
                          <input type="number" id={`order-qty-${idx}`} name={`order-qty-${idx}`} className="ui-input" min={1} value={item.qty}
                            onChange={(e) => handleProductField(idx, "qty", Math.max(1, Number(e.target.value)))} />
                        </div>
                        <div className="ui-form-field">
                          <label className="ui-form-label" htmlFor={`order-price-${idx}`}>Price (₹)</label>
                          <input type="number" id={`order-price-${idx}`} name={`order-price-${idx}`} className="ui-input" min={0} step={0.01} placeholder="0.00" value={item.price || ""}
                            onChange={(e) => handleProductField(idx, "price", Number(e.target.value) || 0)} />
                        </div>
                        <div className="ui-form-field">
                          <label className="ui-form-label" htmlFor={`order-discount-${idx}`}>Discount (%)</label>
                          <input type="number" id={`order-discount-${idx}`} name={`order-discount-${idx}`} className="ui-input" min={0} max={100} placeholder="0" value={item.discount || ""}
                            onChange={(e) => handleProductField(idx, "discount", Number(e.target.value) || 0)} />
                        </div>
                        <div className="ui-form-field">
                          <label className="ui-form-label" htmlFor={`order-subtotal-${idx}`}>Subtotal</label>
                          <div style={{ padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "1px solid var(--border)", fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>
                            ₹{calcSubtotal(item).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</h4>
                <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="ui-form-label" htmlFor="order-status">Order Status</label>
                    <div className="ui-select-wrapper">
                      <select id="order-status" name="order-status" className="ui-select" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                        {statusOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="ui-form-field" style={{ flex: 1, minWidth: 140 }}>
                    <label className="ui-form-label" htmlFor="order-payment-status">Payment Status</label>
                    <div className="ui-select-wrapper">
                      <select id="order-payment-status" name="order-payment-status" className="ui-select" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        {paymentOptions.map((s) => (<option key={s} value={s}>{s.replace(/_/g, " ")}</option>))}
                      </select>
                    </div>
                  </div>
                  {paymentStatus === "partial_paid" && (
                    <div className="ui-form-field" style={{ flex: 1, minWidth: 100 }}>
                      <label className="ui-form-label" htmlFor="order-paid-amount">Paid Amount (₹)</label>
                      <input type="number" id="order-paid-amount" name="order-paid-amount" className="ui-input" min={0} step={0.01} value={paidAmount || ""}
                        onChange={(e) => setPaidAmount(Number(e.target.value) || 0)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
                <h4 style={{ margin: "0 0 var(--space-3)", fontSize: "0.85rem", color: "var(--text-subtle)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Order Summary</h4>
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
                      <input type="number" id="order-delivery-charge" name="order-delivery-charge" className="ui-input" min={0} step={0.01} placeholder="0.00" value={deliveryCharge || ""}
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

              {/* Actions */}
              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={saveOrder} disabled={!customer.name.trim()} style={{ flex: 1 }}>
                  {editingOrderId ? "Update Order" : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
