import { useState, useEffect } from "react";
import { FiDollarSign, FiCheckCircle, FiSearch } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function InvoiceCollectionPage() {
  const { showToast } = useUI();
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [payModal, setPayModal] = useState(null); // invoice id
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    setInvoices(load(KEYS.INVOICES));
  }, []);

  /* Invoices with outstanding dues */
  const dueInvoices = invoices.filter((inv) =>
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
        <input type="search" className="ui-search-input" placeholder="Search by customer or invoice..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Due invoices */}
      {dueInvoices.length === 0 ? (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          {search ? "No matching invoices found." : "All invoices are paid! 🎉"}
        </p>
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
            display: "flex", alignItems: "flex-end", justifyContent: "center",
          }} onClick={() => setPayModal(null)}>
            <div style={{
              background: "var(--bg-surface)", width: "100%", maxWidth: 420,
              borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
              padding: "var(--space-6) var(--space-4)", zIndex: 101,
            }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>Record Payment</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-2)" }}>
                {inv.customer.name} · {inv.invoiceNumber}
              </p>

              <div className="ui-form-field" style={{ marginTop: "var(--space-4)" }}>
                <label className="ui-form-label">Amount (Max: ₹{maxDue.toFixed(2)})</label>
                <input type="number" className="ui-input" min={0} step={0.01} max={maxDue}
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
