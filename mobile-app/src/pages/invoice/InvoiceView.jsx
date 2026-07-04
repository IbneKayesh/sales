import { Printer, ArrowLeft, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = {
    id: id || "INV-1001",
    date: "2024-02-19 14:30",
    customer: "John Smith",
    items: [
      { name: "Electronics Pro", qty: 1, price: 1200 },
      { name: "Wireless Mouse", qty: 2, price: 45 },
      { name: "HDMI Cable", qty: 1, price: 15 },
    ],
    status: "Paid",
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Invoice Details</span>
      </div>

      <div style={{ padding: "12px" }}>
        {/* Invoice ID & Status */}
        <div className="card" style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--primary)",
                }}
              >
                {invoice.id}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                {invoice.date}
              </div>
            </div>
            <span
              style={{
                background: "#e8f5e9",
                color: "#2e7d32",
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              {invoice.status}
            </span>
          </div>

          {/* Customer */}
          <div
            style={{
              background: "var(--background)",
              borderRadius: "10px",
              padding: "10px 14px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                marginBottom: "4px",
              }}
            >
              Customer
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--on-surface)",
              }}
            >
              {invoice.customer}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "8px",
                padding: "6px 0",
                borderBottom: "2px solid var(--border)",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
              }}
            >
              <span>Item</span>
              <span style={{ textAlign: "center" }}>Qty</span>
              <span style={{ textAlign: "right" }}>Amount</span>
            </div>
            {invoice.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "13px",
                  color: "var(--on-surface)",
                }}
              >
                <span>{item.name}</span>
                <span style={{ textAlign: "center", color: "var(--text-secondary)" }}>
                  {item.qty}
                </span>
                <span style={{ textAlign: "right", fontWeight: 600 }}>
                  ${(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            style={{
              background: "var(--background)",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginBottom: "10px",
              }}
            >
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "16px",
                fontWeight: 800,
                color: "var(--primary)",
                paddingTop: "8px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button
            className="btn-primary"
            style={{ flex: 1, gap: "8px" }}
            onClick={() => navigate(`/invoice/print/${invoice.id}`)}
          >
            <Printer size={18} /> Print POS
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1, gap: "8px" }}
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: `Invoice ${invoice.id}`,
                    text: `Check out this invoice for ${invoice.customer}`,
                    url: window.location.href,
                  })
                  .catch(console.error);
              } else {
                alert(
                  "Sharing is not supported on this browser. You can copy the URL instead.",
                );
              }
            }}
          >
            <Share2 size={18} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
