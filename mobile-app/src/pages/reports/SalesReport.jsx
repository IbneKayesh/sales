import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  TrendingUp,
  Filter,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalesReport = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Sales Analytics</span>
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
            justifyContent: "space-between",
            padding: "12px",
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Calendar size={18} color="var(--primary)" />
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                REPORT PERIOD
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>
                Feb 1, 2026 - Feb 20, 2026
              </div>
            </div>
          </div>
          <button
            style={{
              padding: "6px 12px",
              background: "var(--background)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Change
          </button>
        </div>

        {/* High Level Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div className="card" style={{ padding: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontWeight: 700,
              }}
            >
              TOTAL REVENUE
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "var(--primary)",
                marginTop: "4px",
              }}
            >
              $42,850.00
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#22C55E",
                fontWeight: 700,
                marginTop: "4px",
              }}
            >
              ↑ 12.5% vs last month
            </div>
          </div>
          <div className="card" style={{ padding: "16px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontWeight: 700,
              }}
            >
              TOTAL ORDERS
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 900,
                color: "var(--on-surface)",
                marginTop: "4px",
              }}
            >
              1,240
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#22C55E",
                fontWeight: 700,
                marginTop: "4px",
              }}
            >
              ↑ 8% vs last month
            </div>
          </div>
        </div>

        {/* Revenue Chart Section */}
        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              Weekly Revenue Trend
            </h3>
            <div style={{ display: "flex", gap: "6px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "10px",
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: "var(--primary)",
                  }}
                />{" "}
                Sales
              </div>
            </div>
          </div>

          <div
            style={{
              height: "150px",
              display: "flex",
              alignItems: "flex-end",
              gap: "12px",
              padding: "0 8px",
            }}
          >
            {[40, 65, 30, 85, 45, 75, 55].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${h}%`,
                    background: "var(--primary)",
                    borderRadius: "4px 4px 0 0",
                    opacity: i === 6 ? 1 : 0.6,
                  }}
                />
                <span
                  style={{ fontSize: "10px", color: "var(--text-secondary)" }}
                >
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category (Simple Pie representation) */}
        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 700 }}>
            Revenue by Category
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{ position: "relative", width: "100px", height: "100px" }}
            >
              <svg viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeDasharray="65 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="4"
                  strokeDasharray="25 100"
                  strokeDashoffset="-65"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: 800 }}>$42k</div>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: "var(--primary)",
                    }}
                  />{" "}
                  Stationery
                </span>
                <span style={{ fontWeight: 700 }}>65%</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: "#F97316",
                    }}
                  />{" "}
                  Office Gear
                </span>
                <span style={{ fontWeight: 700 }}>25%</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: "var(--border)",
                    }}
                  />{" "}
                  Others
                </span>
                <span style={{ fontWeight: 700 }}>10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div style={{ marginBottom: "80px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              Best Selling Products
            </h3>
            <span
              style={{
                fontSize: "12px",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              Detail <ArrowRight size={14} />
            </span>
          </div>
          {[
            {
              name: "Premium Blue Pen",
              sales: 420,
              revenue: 5250,
              trend: "↑ 12%",
            },
            { name: "A4 Paper Ream", sales: 850, revenue: 4420, trend: "↑ 5%" },
            {
              name: "Wireless Mouse",
              sales: 120,
              revenue: 5400,
              trend: "↓ 2%",
            },
          ].map((prd, i) => (
            <div
              key={i}
              className="card"
              style={{ padding: "12px", marginBottom: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>
                    {prd.name}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {prd.sales} units sold
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800 }}>
                    ${prd.revenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: prd.trend.includes("↑") ? "#22C55E" : "#EF4444",
                      fontWeight: 700,
                    }}
                  >
                    {prd.trend}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
