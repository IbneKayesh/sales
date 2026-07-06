import { useState, useEffect } from "react";
import { FiDollarSign, FiCheckCircle, FiSearch, FiX } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";
import { load, save, KEYS } from "../../utils/storage";

export default function InvoiceCollectionPage() {
  const { showToast } = useUI();
  const { user, isCustomer, isShop } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [payModal, setPayModal] = useState(null); // invoice id
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    setInvoices(load(KEYS.INVOICES));
  }, []);

  /* Filter invoices by role */
  const roleFiltered = isCustomer
    ? invoices.filter((inv) => inv.customer?.name === user?.name)
    : isShop
    ? invoices.filter((inv) => inv.shop === (user?.shopName || user?.name))
    : invoices;

  /* Invoices with outstanding dues */
  const dueInvoices = roleFiltered.filter((inv) =>
    inv.paymentStatus !== "paid" &&
    (inv.customer.name.toLowerCase().includes(search.toLowerCase()) || inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalDue = dueInvoices.reduce((s, inv) => {
    const paid = inv.paymentStatus === "partial_paid" ? (inv.paidAmount || 0) : 0;
    return s + (inv.grandTotal - paid);
  }, 0);

  const recordPayment = (id) => {
    setInvoices((prev) => {
      const next = prev.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = inv.paymentStatus === "partial_paid"
          ? (inv.paidAmount || 0) + Number(payAmount)
          : Number(payAmount);
        const newStatus = newPaid >= inv.grandTotal ? "paid" : "partial_paid";
        return { ...inv, paymentStatus: newStatus, paidAmount: newPaid };
      });
      save(KEYS.INVOICES, next);
      return next;
    });
    setPayModal(null);
    setPayAmount(0);
    showToast("Payment recorded successfully");
  };

  const getDue = (inv) => {
    const paid = inv.paymentStatus === "partial_paid" ? (inv.paidAmount || 0) : 0;
    return inv.grandTotal - paid;
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Collections</p>
          <h1 className="page-heading">Invoice Collections</h1>
        </div>
        <div className="ui-badge"><FiDollarSign /></div>
      </div>

      {/* Summary card */}
      <div className="ui-card" style={{ background: "var(--accent-soft)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500 }}>Total Outstanding</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", marginTop: "var(--space-1)" }}>
              ₹{totalDue.toFixed(2)}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>Due Invoices</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-h)", marginTop: "var(--space-1)" }}>
              {dueInvoices.length}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="ui-search">
        <input type="search" id="invoice-collection-search" name="invoice-collection-search" className="ui-search-input" placeholder="Search by customer or invoice..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Due invoices */}
      {dueInvoices.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: search ? "var(--error-bg)" : "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: search ? "var(--error)" : "var(--accent)" }}>
              {search ? "🔍" : "🎉"}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>
                {search ? "No matching invoices" : "All invoices are paid!"}
              </h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>
                {search ? `No invoices match "${search}"` : "Nothing due right now."}
              </p>
            </div>
          </div>
      ) : (
        <div className="ui-card">
          <h3 className="ui-card-title">Due Invoices ({dueInvoices.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {dueInvoices.map((inv) => {
              const due = getDue(inv);
              return (
                <div key={inv.id}
                  style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{inv.customer.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", fontFamily: "monospace" }}>{inv.invoiceNumber}</div>
                      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
                        <span style={{ fontSize: "0.7rem", color: "#fff", background: inv.paymentStatus === "partial_paid" ? "orange" : "var(--error)", padding: "1px 8px", borderRadius: "var(--radius-full)" }}>
                          {inv.paymentStatus?.replace(/_/g, " ") || "due"}
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-subtle)" }}>
                          {inv.items?.length || 0} items
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.1rem" }}>₹{due.toFixed(2)}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>due</div>
                    </div>
                  </div>

                  {inv.paymentStatus === "partial_paid" && (
                    <div style={{ marginTop: "var(--space-2)", fontSize: "0.8rem", color: "var(--text-subtle)" }}>
                      Paid: ₹{(inv.paidAmount || 0).toFixed(2)} of ₹{inv.grandTotal.toFixed(2)}
                    </div>
                  )}

                  <button className="ui-btn ui-btn-primary" onClick={() => { setPayModal(inv.id); setPayAmount(due); }}
                    style={{ width: "100%", marginTop: "var(--space-2)", fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)" }}>
                    <FiCheckCircle /> Collect Payment
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment modal */}
      {payModal && (() => {
        const inv = invoices.find((i) => i.id === payModal);
        if (!inv) return null;
        const maxDue = getDue(inv);
        return (
          <div style={{
            position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "var(--space-4)",
            animation: "modal-fade-in 0.2s ease",
          }} onClick={() => setPayModal(null)}>
            <div style={{
              background: "var(--bg-surface)", width: "100%", maxWidth: 420,
              borderRadius: "var(--radius-2xl)",
              padding: "var(--space-6) var(--space-5)",
              animation: "modal-scale-in 0.25s ease",
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>Record Payment</h3>
                <button onClick={() => setPayModal(null)}
                  style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                  <FiX />
                </button>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", margin: 0 }}>
                {inv.customer.name} · {inv.invoiceNumber}
              </p>

              <div className="ui-form-field" style={{ marginTop: "var(--space-4)" }}>
                <label className="ui-form-label" htmlFor="collection-amount">Amount (Max: ₹{maxDue.toFixed(2)})</label>
                <input type="number" id="collection-amount" name="collection-amount" className="ui-input" min={0} step={0.01} max={maxDue}
                  value={payAmount} onChange={(e) => setPayAmount(Math.min(maxDue, Math.max(0, Number(e.target.value) || 0)))} />
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={() => setPayModal(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={() => recordPayment(payModal)}
                  style={{ flex: 1 }} disabled={payAmount <= 0}>
                  {payAmount >= maxDue ? "Pay Full ✓" : "Record Payment"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}
