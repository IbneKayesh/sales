import React, { useState } from "react";
import {
  Search,
  Filter,
  CreditCard,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

const payments = [
  {
    id: "PAY-101",
    customer: "John Smith",
    amount: 1275.0,
    date: "20/02/2026",
    method: "Bank Transfer",
    status: "Collected",
  },
  {
    id: "PAY-102",
    customer: "Sarah Miller",
    amount: 450.0,
    date: "19/02/2026",
    method: "Cash",
    status: "Pending",
  },
  {
    id: "PAY-103",
    customer: "Tech Solutions",
    amount: 2100.0,
    date: "19/02/2026",
    method: "Credit Card",
    status: "Collected",
  },
  {
    id: "PAY-104",
    customer: "City Supplies",
    amount: 890.0,
    date: "18/02/2026",
    method: "Check",
    status: "Pending",
  },
  {
    id: "PAY-105",
    customer: "Robert Brown",
    amount: 85.0,
    date: "17/02/2026",
    method: "Cash",
    status: "Collected",
  },
];

const PaymentList = () => {
  const [tab, setTab] = useState("Collected");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(
    (pay) =>
      pay.status === tab &&
      (pay.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pay.id.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="app-container">
      {/* Search Header */}
      <div
        style={{
          padding: "12px 16px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ position: "relative" }}>
          <Search
            size={18}
            color="var(--text-secondary)"
            style={{ position: "absolute", left: "12px", top: "10px" }}
          />
          <input
            type="text"
            placeholder="Search payments..."
            style={{ paddingLeft: "40px", marginBottom: "12px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            background: "var(--background)",
            padding: "4px",
            borderRadius: "10px",
          }}
        >
          {["Collected", "Pending"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                fontSize: "13px",
                fontWeight: 700,
                background: tab === t ? "var(--surface)" : "transparent",
                color: tab === t ? "var(--primary)" : "var(--text-secondary)",
                boxShadow: tab === t ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px" }}>
        {filteredPayments.length > 0 ? (
          filteredPayments.map((pay) => (
            <div
              key={pay.id}
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
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background:
                        pay.status === "Collected"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(249,115,22,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: pay.status === "Collected" ? "#22C55E" : "#F97316",
                    }}
                  >
                    {pay.status === "Collected" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Clock size={20} />
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
                      {pay.customer}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {pay.id} • {pay.method}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--on-surface)",
                    }}
                  >
                    ${pay.amount.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      marginTop: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "4px",
                    }}
                  >
                    <Calendar size={12} /> {pay.date}
                  </div>
                </div>
              </div>

              {pay.status === "Collected" && (
                <button
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid var(--primary)",
                    background: "transparent",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Print Receipt
                </button>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
            <p>No {tab.toLowerCase()} payments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;
