import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Printer, Filter, ChevronRight } from "lucide-react";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Invoice Data
  const invoices = [
    {
      id: "INV-1001",
      customer: "John Smith",
      date: "19/02/2026",
      total: 1275.75,
      status: "Paid",
    },
    {
      id: "INV-1002",
      customer: "Sarah Miller",
      date: "18/02/2026",
      total: 450.0,
      status: "Pending",
    },
    {
      id: "INV-1003",
      customer: "Tech Solutions Inc",
      date: "17/02/2026",
      total: 2100.2,
      status: "Paid",
    },
    {
      id: "INV-1004",
      customer: "Robert Brown",
      date: "15/02/2026",
      total: 85.5,
      status: "Overdue",
    },
    {
      id: "INV-1005",
      customer: "Emily Davis",
      date: "14/02/2026",
      total: 320.0,
      status: "Paid",
    },
  ];

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#2e7d32";
      case "Pending":
        return "#ed6c02";
      case "Overdue":
        return "#d32f2f";
      default:
        return "#666";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "Paid":
        return "#f0fdf4";
      case "Pending":
        return "#fffbeb";
      case "Overdue":
        return "#fef2f2";
      default:
        return "var(--background)";
    }
  };

  return (
    <div className="app-container">
      <div
        style={{
          padding: "12px 16px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            margin: "0 0 12px 0",
            color: "var(--on-background)",
          }}
        >
          Invoices
        </h2>
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", left: "12px", top: "10px" }}
          />
          <input
            type="text"
            placeholder="Search invoice or customer..."
            style={{ paddingLeft: "40px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ padding: "4px" }}>
        {filteredInvoices.map((inv) => (
          <div
            key={inv.id}
            className="card"
            style={{
              padding: "10px",
              margin: "4px 8px",
              marginBottom: "8px",
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                onClick={() => navigate(`/invoice/view/${inv.id}`)}
                style={{ flex: 1, cursor: "pointer" }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    color: "var(--primary)",
                    fontSize: "16px",
                  }}
                >
                  {inv.id}
                </div>
                <div style={{ fontWeight: 500, marginTop: "2px" }}>
                  {inv.customer}
                </div>
                <div
                  style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}
                >
                  {inv.date}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ${inv.total.toFixed(2)}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "10px",
                    fontWeight: "bold",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    marginTop: "8px",
                    background: getStatusBg(inv.status),
                    color: getStatusColor(inv.status),
                  }}
                >
                  {inv.status}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => navigate(`/invoice/view/${inv.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--on-surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  opacity: 0.8,
                }}
              >
                <Eye size={16} /> View
              </button>
              <button
                onClick={() => navigate(`/invoice/print/${inv.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--on-surface)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  opacity: 0.8,
                }}
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-fab" onClick={() => navigate("/invoice/entry")}>
        <Plus size={24} />
      </button>
    </div>
  );
};

export default InvoiceList;
