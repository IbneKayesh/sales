import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";

const InvoicePrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = {
    id: id || "INV-1001",
    date: "19/02/2026 14:30",
    customer: "John Smith",
    items: [
      { name: "Electronics Pro", qty: 1, price: 1200 },
      { name: "Wireless Mouse", qty: 2, price: 45 },
      { name: "HDMI Cable", qty: 1, price: 15 },
    ],
  };

  const subtotal = invoice.items.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header no-print">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">POS Receipt</span>
      </div>

      {/* Receipt Body */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 12px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div className="pos-receipt">
          {/* Store Header */}
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: "16px",
                letterSpacing: "2px",
                marginBottom: "4px",
              }}
            >
              MOBILE STORE
            </div>
            <div style={{ fontSize: "11px", color: "#555" }}>
              123 Tech Avenue, Silicon Valley
            </div>
            <div style={{ fontSize: "11px", color: "#555" }}>
              Tel: +1 234 567 890
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px dashed #999",
              margin: "10px 0",
            }}
          />

          {/* Invoice Meta */}
          <div style={{ fontSize: "11px", marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}
            >
              <span style={{ fontWeight: 700 }}>Invoice:</span>
              <span>{invoice.id}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3px",
              }}
            >
              <span style={{ fontWeight: 700 }}>Date:</span>
              <span>{invoice.date}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700 }}>Customer:</span>
              <span>{invoice.customer}</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px dashed #999", margin: "10px 0" }} />

          {/* Items */}
          <table
            style={{
              width: "100%",
              fontSize: "11px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px dashed #999",
                }}
              >
                <th style={{ textAlign: "left", padding: "4px 0" }}>Item</th>
                <th style={{ textAlign: "center", padding: "4px 0" }}>Qty</th>
                <th style={{ textAlign: "right", padding: "4px 0" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "5px 0" }}>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>
                    {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ borderTop: "1px dashed #999", marginTop: "10px", paddingTop: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                marginBottom: "3px",
              }}
            >
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                marginBottom: "6px",
              }}
            >
              <span>Tax (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 900,
                fontSize: "14px",
                borderTop: "1px dashed #999",
                paddingTop: "6px",
              }}
            >
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "10px",
              color: "#777",
            }}
          >
            <div>Thank you for your business!</div>
            <div>Visit us again</div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div
        className="no-print"
        style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}
      >
        <button
          className="btn-primary"
          onClick={handlePrint}
          style={{ gap: "8px" }}
        >
          <Printer size={18} /> Print Now
        </button>
      </div>

      <style>{`
        .pos-receipt {
          width: 80mm;
          max-width: 100%;
          background: #fff;
          padding: 16px;
          color: #000;
          font-family: 'Courier New', Courier, monospace;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          border-radius: 8px;
        }

        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          .no-print {
            display: none !important;
          }
          body, html {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
          }
          #root {
            max-width: 80mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          .page-container {
            padding: 0 !important;
            margin: 0 !important;
          }
          .pos-receipt {
            box-shadow: none !important;
            width: 80mm !important;
            padding: 4mm !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          * {
            color: #000 !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrint;
