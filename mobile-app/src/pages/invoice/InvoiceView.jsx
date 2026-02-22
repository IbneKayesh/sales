import { Printer, ArrowLeft, Share2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data fetching
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
    <div className="app-container">
      <header className="header header-with-back">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Invoice Details</h1>
      </header>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "var(--primary)" }}>{invoice.id}</h2>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
              {invoice.date}
            </p>
          </div>
          <span
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {invoice.status}
          </span>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ color: "#888", fontSize: "12px" }}>CUSTOMER</label>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>
            {invoice.customer}
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>
                    ${(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "24px", textAlign: "right" }}>
          <div style={{ color: "#666", fontSize: "14px", marginBottom: "4px" }}>
            Subtotal: ${subtotal.toFixed(2)}
          </div>
          <div style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
            Tax (5%): ${tax.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "var(--primary)",
            }}
          >
            Total: ${total.toFixed(2)}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button
            className="btn-primary"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onClick={() => navigate(`/invoice/print/${invoice.id}`)}
          >
            <Printer size={20} /> Print POS
          </button>
          <button
            className="btn-primary btn-secondary"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: 0,
            }}
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
            <Share2 size={20} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
