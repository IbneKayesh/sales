import React, { useState } from "react";
import {
  ArrowLeft,
  Box,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Download,
  Search,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StockReport = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Inventory Report</span>
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
        {/* Total Value Hero */}
        <div
          className="card"
          style={{
            padding: "20px",
            marginBottom: "16px",
            background: "var(--surface)",
            borderLeft: "4px solid var(--primary)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              opacity: 0.05,
            }}
          >
            <Box size={100} color="var(--primary)" />
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Total Inventory Value
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 900,
              color: "var(--on-surface)",
              marginTop: "4px",
            }}
          >
            $124,500.20
          </div>
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#22C55E",
                fontWeight: 700,
              }}
            >
              <TrendingUp size={14} /> 245 Items In
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "#EF4444",
                fontWeight: 700,
              }}
            >
              <TrendingDown size={14} /> 112 Items Out
            </div>
          </div>
        </div>

        {/* Stock Health Chart Placeholder */}
        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              Stock Distribution
            </h3>
          </div>
          <div
            style={{
              height: "12px",
              width: "100%",
              background: "var(--background)",
              borderRadius: "6px",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{ width: "70%", height: "100%", background: "#22C55E" }}
              title="Healthy"
            />
            <div
              style={{ width: "20%", height: "100%", background: "#F97316" }}
              title="Low"
            />
            <div
              style={{ width: "10%", height: "100%", background: "#EF4444" }}
              title="Out of Stock"
            />
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
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
                  background: "#22C55E",
                }}
              />{" "}
              70% Healthy
            </div>
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
                  background: "#F97316",
                }}
              />{" "}
              20% Low
            </div>
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
                  background: "#EF4444",
                }}
              />{" "}
              10% Empty
            </div>
          </div>
        </div>

        {/* Movement Ledger */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700 }}>
              Internal Movement
            </h3>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
              Last 7 Days
            </span>
          </div>

          {[
            {
              prd: "Premium Blue Pen",
              type: "Restock",
              qty: "+50",
              date: "20/02/2026",
              user: "Admin",
              color: "#22C55E",
            },
            {
              prd: "Wireless Mouse",
              type: "Sales",
              qty: "-12",
              date: "19/02/2026",
              user: "SM",
              color: "#EF4444",
            },
            {
              prd: "A4 Paper Ream",
              type: "Sales",
              qty: "-45",
              date: "18/02/2026",
              user: "Admin",
              color: "#EF4444",
            },
            {
              prd: "Desk Organizer",
              type: "Restock",
              qty: "+10",
              date: "18/02/2026",
              user: "SM",
              color: "#22C55E",
            },
          ].map((move, i) => (
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
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: `${move.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: move.color,
                    }}
                  >
                    {move.type === "Restock" ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>
                      {move.prd}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {move.type} by {move.user}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: move.color,
                    }}
                  >
                    {move.qty}
                  </div>
                  <div
                    style={{ fontSize: "10px", color: "var(--text-secondary)" }}
                  >
                    {move.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast / Alerts */}
        <div style={{ marginTop: "16px", marginBottom: "80px" }}>
          <div
            className="card"
            style={{
              padding: "16px",
              background: "rgba(249,115,22,0.08)",
              border: "1px dashed #F97316",
            }}
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <AlertTriangle size={20} color="#F97316" />
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#F97316",
                  }}
                >
                  Depletion Warning
                </div>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  "A4 Paper Ream" is projected to run out in{" "}
                  <strong>3 days</strong> based on current sales velocity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReport;
