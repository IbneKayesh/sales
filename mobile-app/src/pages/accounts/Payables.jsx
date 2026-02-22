import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const payables = [
  {
    id: "P-881",
    supplier: "Paper Co. Ltd",
    amount: 1250.0,
    due: "22/02/2026",
    status: "Due Soon",
    color: "#F97316",
    days: 2,
  },
  {
    id: "P-879",
    supplier: "Tech Wholesalers",
    amount: 3100.5,
    due: "15/02/2026",
    status: "Overdue",
    color: "#EF4444",
    days: -5,
  },
  {
    id: "P-882",
    supplier: "City Utilities",
    amount: 145.2,
    due: "28/02/2026",
    status: "Pending",
    color: "var(--primary)",
    days: 8,
  },
  {
    id: "P-883",
    supplier: "Office Depot",
    amount: 430.0,
    due: "05/03/2026",
    status: "Pending",
    color: "var(--primary)",
    days: 13,
  },
  {
    id: "P-878",
    supplier: "Furniture Plus",
    amount: 2200.0,
    date: "10/02/2026",
    status: "Paid",
    color: "#22C55E",
    days: -10,
  },
];

const Payables = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = payables.filter(
    (p) =>
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Accounts Payable</span>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search
            size={18}
            color="var(--text-secondary)"
            style={{ position: "absolute", left: "12px", top: "10px" }}
          />
          <input
            type="text"
            placeholder="Search suppliers..."
            style={{ paddingLeft: "40px", marginBottom: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Summary Card */}
        <div
          className="card"
          style={{
            padding: "16px",
            marginBottom: "16px",
            borderLeft: "4px solid #EF4444",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                Total Outstanding
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#EF4444",
                  marginTop: "4px",
                }}
              >
                $4,925.70
              </div>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "12px",
                color: "#EF4444",
                fontWeight: 700,
              }}
            >
              $3,100.50 Overdue
            </div>
          </div>
        </div>

        {/* Payables List */}
        <div>
          {filtered.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{ padding: "14px", marginBottom: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--on-surface)",
                    }}
                  >
                    {p.supplier}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "2px",
                    }}
                  >
                    {p.id} • Due: {p.due || "Paid"}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        background: `${p.color}15`,
                        color: p.color,
                      }}
                    >
                      {p.status}
                    </span>
                    {p.status !== "Paid" && (
                      <span
                        style={{
                          fontSize: "10px",
                          color:
                            p.days < 0 ? "#EF4444" : "var(--text-secondary)",
                          fontWeight: 600,
                        }}
                      >
                        {p.days < 0
                          ? `${Math.abs(p.days)} days overdue`
                          : `In ${p.days} days`}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color:
                        p.status === "Paid" ? "#22C55E" : "var(--on-surface)",
                    }}
                  >
                    ${p.amount.toFixed(2)}
                  </div>
                  {p.status !== "Paid" && (
                    <button
                      style={{
                        marginTop: "12px",
                        padding: "6px 16px",
                        borderRadius: "8px",
                        border: "none",
                        background: "var(--primary)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payables;
