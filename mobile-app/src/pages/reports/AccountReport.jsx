import React, { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Landmark,
  PieChart,
  Download,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountReport = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Financial Report</span>
        <button
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "var(--primary)",
          }}
        >
          <Download size={20} />
        </button>
      </div>

      <div style={{ padding: "12px 16px" }}>
        {/* Date Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            marginBottom: "16px",
          }}
        >
          <Calendar size={18} color="var(--primary)" />
          <span style={{ fontSize: "14px", fontWeight: 700 }}>
            February 2026
          </span>
        </div>

        {/* P&L Main Card */}
        <div
          className="card"
          style={{
            padding: "24px",
            marginBottom: "16px",
            background:
              "linear-gradient(135deg, var(--primary) 0%, #064E40 100%)",
            color: "#fff",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "12px",
                opacity: 0.8,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Net Profit
            </div>
            <div
              style={{ fontSize: "36px", fontWeight: 900, marginTop: "8px" }}
            >
              $18,450.30
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(34,197,94,0.2)",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 700,
                marginTop: "12px",
                color: "#4ADE80",
              }}
            >
              <TrendingUp size={14} /> +15.2% vs last month
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>Gross Income</div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>
                $42,850.00
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>
                Total Expenses
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>
                $24,399.70
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700 }}>
            Expense Allocation
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                label: "Cost of Goods",
                amount: 15200,
                pct: 62,
                color: "#EF4444",
              },
              {
                label: "Operating Costs",
                amount: 6400,
                pct: 26,
                color: "#F97316",
              },
              {
                label: "Taxes & Utilities",
                amount: 2799,
                pct: 12,
                color: "#7C3AED",
              },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  <span>{item.label}</span>
                  <span>
                    ${item.amount.toLocaleString()} ({item.pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    background: "var(--background)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.pct}%`,
                      height: "100%",
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trend Bar Chart */}
        <div className="card" style={{ padding: "16px", marginBottom: "80px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700 }}>
            Income Growth (6 mo)
          </h3>
          <div
            style={{
              height: "120px",
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              padding: "0 10px",
            }}
          >
            {[30, 45, 40, 60, 75, 90].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    background: "var(--primary)",
                    borderRadius: "4px",
                    opacity: i === 5 ? 1 : 0.4,
                  }}
                />
                <span
                  style={{ fontSize: "9px", color: "var(--text-secondary)" }}
                >
                  {["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountReport;
