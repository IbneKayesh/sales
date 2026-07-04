import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Save, Printer, Plus, Trash2, Share2 } from "lucide-react";
import { useShop } from "@/context/ShopContext";

const STATUS_ORDER = ["PENDING", "DELIVERED", "PAID", "COMPLETED"];
const DELIVERY_STATUS = ["PENDING", "DISPATCHED", "DELIVERED", "RETURNED"];

const STATUS_BADGE = {
  PENDING:   { bg: "#fffbeb", color: "#d97706" },
  DELIVERED: { bg: "#eff6ff", color: "#2563eb" },
  PAID:      { bg: "#f0fdf4", color: "#16a34a" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
  DISPATCHED:{ bg: "#fef3c7", color: "#b45309" },
  RETURNED:  { bg: "#fee2e2", color: "#b91c1c" },
};

const InvoiceView = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { getInvoiceById, updateStatus, recordPayment, updateInvoiceItems, products } = useShop();

  const invoice = getInvoiceById(id);

  const [showStatusMenu,  setShowStatusMenu]  = useState(false);
  const [showDelStatusMenu,setShowDelStatusMenu] = useState(false);
  const [paymentAmount,   setPaymentAmount]   = useState("");
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [editingItems,    setEditingItems]    = useState(false);
  
  const [editedItems,     setEditedItems]     = useState([]);
  const [editDeliveryMan, setEditDeliveryMan] = useState("");
  const [editDelCharge,   setEditDelCharge]   = useState(0);
  const [editDiscount,    setEditDiscount]    = useState(0);

  if (!invoice) {
    return (
      <div className="page-container" style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "48px" }}>❓</div>
        <h3>Invoice not found</h3>
        <button onClick={() => navigate("/invoice/list")} className="btn-primary" style={{ marginTop: "12px" }}>Back to Invoices</button>
      </div>
    );
  }

  const badge = STATUS_BADGE[invoice.status] || { bg: "#f1f5f9", color: "#64748b" };
  const delBadge = STATUS_BADGE[invoice.deliveryStatus] || { bg: "#f1f5f9", color: "#64748b" };

  const handleUpdateStatus = (newStatus) => {
    updateStatus(invoice.id, newStatus);
    setShowStatusMenu(false);
  };

  const handleUpdateDelStatus = (newStatus) => {
    updateInvoiceItems(invoice.id, invoice.items, invoice.deliveryCharge, invoice.discount, invoice.deliveryMan, newStatus);
    setShowDelStatusMenu(false);
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) { alert("Please enter a valid amount"); return; }
    recordPayment(invoice.id, amount);
    setPaymentAmount("");
    setShowPaymentInput(false);
  };

  const startEditing = () => {
    setEditedItems(invoice.items.map((i) => ({ ...i, id: i.productId || Math.random(), discount: i.discount || 0 })));
    setEditDeliveryMan(invoice.deliveryMan || "");
    setEditDelCharge(invoice.deliveryCharge || 0);
    setEditDiscount(invoice.discount || 0);
    setEditingItems(true);
  };

  const saveEditedItems = () => {
    updateInvoiceItems(invoice.id, editedItems, editDelCharge, editDiscount, editDeliveryMan, invoice.deliveryStatus);
    setEditingItems(false);
  };

  const editItem = (id, field, value) =>
    setEditedItems((prev) => prev.map((i) => i.id === id ? { ...i, [field]: value } : i));

  const removeEditItem = (id) =>
    setEditedItems((prev) => prev.filter((i) => i.id !== id));

  const addEditItem = () =>
    setEditedItems((prev) => [...prev, { id: Date.now(), productId: null, name: "", qty: 1, price: 0, discount: 0 }]);

  const handleShare = async () => {
    const shareData = {
      title: `Invoice ${invoice.invoiceNo}`,
      text: `Invoice ${invoice.invoiceNo} from Virtual Mart.\nTotal: ৳${invoice.total}\nDue: ৳${invoice.due}\nThank you!`,
      url: window.location.href, // Or a public URL if available
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + shareData.url)}`;
        window.open(whatsappUrl, "_blank");
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  return (
    <div className="app-container" style={{ paddingBottom: "80px" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
        <button onClick={() => navigate("/invoice/list")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--primary)" }}>{invoice.invoiceNo}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{invoice.date}</div>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "10px", background: badge.bg, color: badge.color }}>
          {invoice.status}
        </span>
      </div>

      <div style={{ padding: "12px" }}>
        {/* Customer info */}
        <div className="card" style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 700 }}>CUSTOMER</div>
          <div style={{ fontSize: "15px", fontWeight: 800 }}>{invoice.customerName}</div>
          {invoice.customerMobile && (
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>📱 {invoice.customerMobile}</div>
          )}
          {invoice.orderId && (
            <div style={{ fontSize: "11px", color: "var(--primary)", marginTop: "4px" }}>Order: {invoice.orderId}</div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="card" style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>DELIVERY</div>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowDelStatusMenu(!showDelStatusMenu)}
                style={{ background: delBadge.bg, color: delBadge.color, border: "none", padding: "4px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                {invoice.deliveryStatus} <ChevronDown size={12} />
              </button>
              {showDelStatusMenu && (
                <div style={{ position: "absolute", right: 0, top: "24px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: "120px", overflow: "hidden" }}>
                  {DELIVERY_STATUS.map(s => (
                    <div key={s} onClick={() => handleUpdateDelStatus(s)} style={{ padding: "8px 12px", fontSize: "11px", fontWeight: 700, cursor: "pointer", borderBottom: "1px solid var(--border)", background: s === invoice.deliveryStatus ? "var(--background)" : "transparent" }}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {editingItems ? (
            <div style={{ marginTop: "8px" }}>
              <input type="text" value={editDeliveryMan} onChange={(e) => setEditDeliveryMan(e.target.value)}
                placeholder="Delivery Man Name" style={{ width: "100%", padding: "8px", fontSize: "12px", border: "1px solid var(--border)", borderRadius: "6px" }} />
            </div>
          ) : (
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {invoice.deliveryMan ? `🚚 ${invoice.deliveryMan}` : "Not Assigned"}
            </div>
          )}
        </div>

        {/* Items */}
        <div className="card" style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)" }}>ITEMS</div>
            {!editingItems && (
              <button onClick={startEditing}
                style={{ fontSize: "12px", color: "var(--primary)", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>
                ✏️ Edit Invoice
              </button>
            )}
          </div>

          {editingItems ? (
            <>
              {editedItems.map((item) => (
                <div key={item.id} style={{ padding: "8px", background: "var(--background)", borderRadius: "8px", marginBottom: "6px", border: "1px solid var(--border)" }}>
                  {products.length > 0 && (
                    <select onChange={(e) => {
                      const p = products.find((pr) => pr.id === parseInt(e.target.value));
                      if (p) { editItem(item.id, "name", p.name); editItem(item.id, "price", p.price); editItem(item.id, "discount", p.discount || 0); }
                    }} defaultValue=""
                      style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid var(--border)", background: "var(--background)", marginBottom: "6px", fontSize: "12px" }}>
                      <option value="">— Pick product —</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.icon} {p.name} ৳{p.price}</option>)}
                    </select>
                  )}
                  <input type="text" value={item.name} placeholder="Item name"
                    onChange={(e) => editItem(item.id, "name", e.target.value)}
                    style={{ marginBottom: "6px" }} />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "10px" }}>Qty</label>
                      <input type="number" value={item.qty} min="1"
                        onChange={(e) => editItem(item.id, "qty", parseFloat(e.target.value) || 1)} />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label style={{ fontSize: "10px" }}>Price ৳</label>
                      <input type="number" value={item.price}
                        onChange={(e) => editItem(item.id, "price", parseFloat(e.target.value) || 0)} />
                    </div>
                    <div style={{ flex: 1.5 }}>
                      <label style={{ fontSize: "10px", color: "var(--primary)" }}>Dis. ৳</label>
                      <input type="number" value={item.discount || ""} placeholder="0"
                        onChange={(e) => editItem(item.id, "discount", parseFloat(e.target.value) || 0)} />
                    </div>
                    <button onClick={() => removeEditItem(item.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", paddingTop: "16px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addEditItem}
                style={{ width: "100%", padding: "8px", border: "1px dashed var(--border)", borderRadius: "8px", background: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: "13px", marginBottom: "12px" }}>
                <Plus size={14} style={{ marginRight: "4px" }} /> Add Item
              </button>

              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", fontWeight: 700 }}>Del. Charge ৳</label>
                  <input type="number" value={editDelCharge} onChange={(e) => setEditDelCharge(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "8px", border: "1px solid var(--border)", borderRadius: "6px" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", fontWeight: 700 }}>Total Dis. ৳</label>
                  <input type="number" value={editDiscount} onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)} style={{ width: "100%", padding: "8px", border: "1px solid var(--border)", borderRadius: "6px" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setEditingItems(false)}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer" }}>Cancel</button>
                <button onClick={saveEditedItems}
                  style={{ flex: 2, padding: "8px", borderRadius: "8px", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </>
          ) : (
            invoice.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    ৳{item.price} {item.discount > 0 && <span style={{color: "var(--primary)"}}>(−৳{item.discount})</span>} × {item.qty}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "14px" }}>৳{(item.price - (item.discount || 0)) * item.qty}</div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="card" style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
            <span>Subtotal</span><span>৳{invoice.subtotal}</span>
          </div>
          {invoice.deliveryCharge > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
              <span>Delivery</span><span>+৳{invoice.deliveryCharge}</span>
            </div>
          )}
          {invoice.discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#16a34a" }}>
              <span>Invoice Discount</span><span>−৳{invoice.discount}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "var(--primary)", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
            <span>Total</span><span>৳{invoice.total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "13px", color: "#16a34a" }}>
            <span>Paid</span><span>৳{invoice.paid}</span>
          </div>
          {invoice.due > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "14px", fontWeight: 800, color: "#d97706" }}>
              <span>Due</span><span>৳{invoice.due}</span>
            </div>
          )}
        </div>

        {/* Record payment */}
        {invoice.due > 0 && (
          <div className="card" style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>RECORD PAYMENT</div>
            {showPaymentInput ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="number" placeholder={`Amount (max ৳${invoice.due})`} value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)} style={{ flex: 1 }} />
                <button onClick={handleRecordPayment}
                  style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                  Save
                </button>
                <button onClick={() => setShowPaymentInput(false)}
                  style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 10px", cursor: "pointer" }}>✕</button>
              </div>
            ) : (
              <button onClick={() => setShowPaymentInput(true)}
                style={{ width: "100%", padding: "10px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "10px", color: "#16a34a", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
                💰 Record Payment (Due: ৳{invoice.due})
              </button>
            )}
          </div>
        )}

        {/* Update status */}
        <div className="card" style={{ marginBottom: "10px", position: "relative" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>PAYMENT STATUS</div>
          <button onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{ width: "100%", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "10px", border: "1px solid var(--border)", background: badge.bg, color: badge.color, fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
            <span>{invoice.status}</span>
            <ChevronDown size={16} />
          </button>
          {showStatusMenu && (
            <div style={{ position: "absolute", left: "16px", right: "16px", top: "100%", marginTop: "4px", background: "var(--surface)", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
              {STATUS_ORDER.map((s) => {
                const b = STATUS_BADGE[s];
                return (
                  <button key={s} onClick={() => handleUpdateStatus(s)}
                    style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", background: invoice.status === s ? b.bg : "transparent", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", fontSize: "13px", fontWeight: invoice.status === s ? 800 : 600, color: b.color }}>
                    <span>{invoice.status === s ? "✓" : "○"}</span> {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button onClick={() => navigate(`/invoice/print/${invoice.id}`)}
            style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "13px", color: "var(--on-surface)" }}>
            <Printer size={16} /> Print
          </button>
          <button onClick={handleShare}
            style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--primary)", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", fontSize: "13px", color: "#fff" }}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
