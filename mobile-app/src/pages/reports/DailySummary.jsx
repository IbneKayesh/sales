import React, { useState } from "react";
import {
  ArrowLeft,
  Clock,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DailySummary = () => {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="app-container">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-header-title">Daily Snapshot</span>
      </div>

      <div
        style={{
          padding: "0 16px 16px",
          background: "var(--primary)",
          color: "#fff",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          paddingTop: "8px",
        }}
      >
        <p style={{ fontSize: "12px", opacity: 0.8, marginBottom: "4px" }}>
          {today}
        </p>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 900 }}>
          Today's Performance
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.7,
                textTransform: "uppercase",
              }}
            >
              Sales Total
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800 }}>$1,275.40</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#4ADE80",
                marginTop: "4px",
              }}
            >
              <ArrowUpRight size={14} /> +8% vs yest.
            </div>
          </div>
          <div
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.2)",
              paddingLeft: "16px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                opacity: 0.7,
                textTransform: "uppercase",
              }}
            >
              Orders
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800 }}>42</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                color: "#4ADE80",
                marginTop: "4px",
              }}
            >
              <ArrowUpRight size={14} /> +3 new clients
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Hourly Trend Section */}
        <div className="card" style={{ padding: "16px", marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "14px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={16} color="var(--primary)" /> Hourly Activity
            </h3>
          </div>
          <div
            style={{
              height: "80px",
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
            }}
          >
            {[10, 20, 60, 95, 80, 40, 30, 15, 5, 0].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: "var(--primary)",
                  borderRadius: "2px",
                  opacity: h > 70 ? 1 : 0.4,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "9px",
              color: "var(--text-secondary)",
              marginTop: "8px",
            }}
          >
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
          </div>
        </div>

        {/* Collection Status */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div className="card" style={{ padding: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  background: "rgba(34,197,94,0.1)",
                  borderRadius: "8px",
                  color: "#22C55E",
                }}
              >
                <DollarSign size={14} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>Cash In</span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>$840.40</div>
          </div>
          <div className="card" style={{ padding: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  padding: "6px",
                  background: "rgba(124,58,237,0.1)",
                  borderRadius: "8px",
                  color: "#7C3AED",
                }}
              >
                <Activity size={14} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>Credit</span>
            </div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>$435.00</div>
          </div>
        </div>

        {/* Top Product Today */}
        <div
          className="card"
          style={{
            padding: "16px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--background)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              🏷️
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                TOP ITEM TODAY
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800 }}>
                A4 Paper Ream
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: 800 }}>18 Units</div>
            <div
              style={{ fontSize: "10px", color: "#22C55E", fontWeight: 700 }}
            >
              Trending Up
            </div>
          </div>
        </div>

        {/* Action Link to Full Reports */}
        <button
          onClick={() => navigate("/modules")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "1px dashed var(--border)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "var(--primary)",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "80px",
          }}
        >
          View Detailed Analytics <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default DailySummary;
