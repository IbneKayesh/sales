import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stockData = [
  {
    id: 1,
    name: "Premium Blue Pen",
    stock: 45,
    min: 10,
    status: "Healthy",
    color: "#22C55E",
  },
  {
    id: 2,
    name: "A4 Paper Ream",
    stock: 8,
    min: 20,
    status: "Low",
    color: "#F97316",
  },
  {
    id: 3,
    name: "Desk Organizer",
    stock: 15,
    min: 5,
    status: "Healthy",
    color: "#22C55E",
  },
  {
    id: 4,
    name: "Wireless Mouse",
    stock: 0,
    min: 10,
    status: "Out of Stock",
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Stapler Heavy Duty",
    stock: 3,
    min: 10,
    status: "Low",
    color: "#F97316",
  },
  {
    id: 7,
    name: "Ink Cartridge",
    stock: 2,
    min: 5,
    status: "Low",
    color: "#F97316",
  },
];

const StockLevels = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filteredStock = stockData.filter((s) => {
    if (filter === "All") return true;
    if (filter === "Low") return s.status === "Low";
    if (filter === "Out") return s.status === "Out of Stock";
    return true;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Stock Monitoring</span>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Status Pills */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            overflowX: "auto",
            paddingBottom: "4px",
          }}
        >
          {["All", "Low", "Out"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: filter === f ? "var(--primary)" : "var(--surface)",
                color: filter === f ? "#fff" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f === "Out"
                ? "Out of Stock"
                : f === "Low"
                  ? "Low Stock"
                  : "All Products"}
            </button>
          ))}
        </div>

        {/* Summary Mini Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            className="card"
            style={{ padding: "12px", borderLeft: "4px solid #EF4444" }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: 800, color: "#EF4444" }}
            >
              1
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Out of Stock
            </div>
          </div>
          <div
            className="card"
            style={{ padding: "12px", borderLeft: "4px solid #F97316" }}
          >
            <div
              style={{ fontSize: "20px", fontWeight: 800, color: "#F97316" }}
            >
              3
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Low Stock Items
            </div>
          </div>
        </div>

        {/* Stock List */}
        <div>
          {filteredStock.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{ padding: "14px", marginBottom: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: `${item.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                    }}
                  >
                    {item.status === "Healthy" ? (
                      <CheckCircle size={20} />
                    ) : item.status === "Low" ? (
                      <AlertTriangle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--on-surface)",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Min Stock: {item.min}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: item.color,
                    }}
                  >
                    {item.stock}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: item.color,
                    }}
                  >
                    {item.status}
                  </div>
                </div>
              </div>

              {(item.status === "Low" || item.status === "Out of Stock") && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    Recommended Refill: {item.min * 2}
                  </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontWeight: 700,
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <RefreshCw size={14} /> Update
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockLevels;
