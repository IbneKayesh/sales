import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";

const InvoicePrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Same mock data
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

  const total =
    invoice.items.reduce((acc, item) => acc + item.qty * item.price, 0) * 1.05;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container">
      <header className="header header-with-back no-print">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>POS Receipt</h1>
      </header>

      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <div className="pos-receipt">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: 0 }}>MOBILE STORE</h2>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>
              123 Tech Avenue, Silicon Valley
            </p>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>
              Tel: +1 234 567 890
            </p>
          </div>

          <div
            style={{
              borderTop: "1px dashed #000",
              paddingTop: "10px",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Invoice: {invoice.id}</span>
              <span>{invoice.date}</span>
            </div>
            <div>Cust: {invoice.customer}</div>
          </div>

          <table
            style={{
              width: "100%",
              fontSize: "12px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px dashed #000" }}>
                <th style={{ textAlign: "left", padding: "5px 0" }}>Item</th>
                <th style={{ textAlign: "right", padding: "5px 0" }}>Qty</th>
                <th style={{ textAlign: "right", padding: "5px 0" }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "5px 0" }}>{item.name}</td>
                  <td style={{ textAlign: "right" }}>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>
                    {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              borderTop: "1px dashed #000",
              marginTop: "10px",
              paddingTop: "10px",
              textAlign: "right",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "16px" }}>
              TOTAL: ${total.toFixed(2)}
            </div>
          </div>

          <div
            style={{ textAlign: "center", marginTop: "30px", fontSize: "10px" }}
          >
            <p>Thank you for your business!</p>
            <p>Visit us again</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }} className="no-print">
        <button
          className="btn-primary"
          onClick={handlePrint}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Printer size={20} /> Print Now
        </button>
      </div>

      <style>{`
        .pos-receipt {
          width: 80mm;
          background: #fff;
          padding: 15px;
          color: #000;
          font-family: 'Courier New', Courier, monospace;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          margin: 0 auto;
        }

        @media print {
          @page {
            margin: 0;
            size: 80mm auto; /* Standard 3-inch thermal paper */
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

          .app-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 80mm !important;
            display: block !important;
          }

          .pos-receipt {
            box-shadow: none !important;
            width: 80mm !important;
            padding: 4mm !important; /* Small margin for thermal heads */
            margin: 0 !important;
            border: none !important;
          }

          /* Ensure high contrast for thermal print heads */
          * {
            color: #000 !important;
            background: transparent !important;
            font-weight: bold;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrint;
