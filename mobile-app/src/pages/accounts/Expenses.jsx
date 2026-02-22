import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  Wallet,
  Car,
  Zap,
  Coffee,
  ChevronRight,
  PieChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const expenses = [
  {
    id: 1,
    desc: "Office Rent - Feb",
    amount: 1200.0,
    cat: "Rent",
    method: "Bank Transfer",
    date: "19/02/2026",
    color: "#7C3AED",
    icon: <Wallet size={18} />,
  }, // Note: Using predefined icons
  {
    id: 2,
    desc: "Business Lunch",
    amount: 45.5,
    cat: "Food",
    method: "Cash",
    date: "18/02/2026",
    color: "#F97316",
    icon: <Coffee size={18} />,
  },
  {
    id: 3,
    desc: "Fuel for Delivery Truck",
    amount: 85.0,
    cat: "Travel",
    method: "Fuel Card",
    date: "17/02/2026",
    color: "#DB2777",
    icon: <Car size={18} />,
  },
  {
    id: 4,
    desc: "Electricity Bill",
    amount: 145.2,
    cat: "Utilities",
    method: "Direct Debit",
    date: "15/02/2026",
    color: "#0F766E",
    icon: <Zap size={18} />,
  },
];

const BriefcaseIcon = (props) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const Expenses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Expense Manager</span>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Monthly Summary */}
        <div
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
            borderRadius: "16px",
            padding: "20px",
            color: "#fff",
            marginBottom: "20px",
            boxShadow: "0 8px 16px rgba(239,68,68,0.2)",
          }}
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
                  fontSize: "12px",
                  opacity: 0.8,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                This Month
              </div>
              <div
                style={{ fontSize: "28px", fontWeight: 900, marginTop: "4px" }}
              >
                $6,240.70
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "8px",
                borderRadius: "10px",
              }}
            >
              <PieChart size={24} />
            </div>
          </div>
          <div
            style={{
              marginTop: "16px",
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.2)",
            }}
          >
            <div
              style={{
                width: "65%",
                height: "100%",
                borderRadius: "3px",
                background: "#fff",
              }}
            />
          </div>
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              opacity: 0.8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>65% of monthly budget</span>
            <span>$3,759.30 left</span>
          </div>
        </div>

        {/* Expense List */}
        <div>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "12px",
              color: "var(--on-background)",
            }}
          >
            Recent Expenses
          </h3>
          {expenses.map((exp) => (
            <div
              key={exp.id}
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
                      borderRadius: "12px",
                      background: `${exp.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: exp.color,
                    }}
                  >
                    {exp.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "var(--on-surface)",
                      }}
                    >
                      {exp.desc}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                        marginTop: "2px",
                      }}
                    >
                      {exp.cat} • {exp.method}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#EF4444",
                    }}
                  >
                    -${exp.amount.toFixed(2)}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {exp.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        style={{
          position: "fixed",
          bottom: "85px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "28px",
          background: "#EF4444",
          color: "#fff",
          border: "none",
          boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
        }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Expenses;
