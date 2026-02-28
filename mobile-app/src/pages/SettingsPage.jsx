import React from "react";
import { Bell, Shield, Moon, CircleHelp, Sun, Smartphone } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="page-container">
      {/* Appearance */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            Appearance
          </span>
        </div>

        {/* Dark Mode Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: isDark
                  ? "rgba(37,99,235,0.15)"
                  : "rgba(15,118,110,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isDark ? (
                <Moon size={20} color="var(--primary)" />
              ) : (
                <Sun size={20} color="var(--primary)" />
              )}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--on-surface)",
                }}
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {isDark ? "Field Sales Friendly" : "Modern Teal"}
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={toggleTheme}
            style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              background: isDark ? "var(--primary)" : "#CBD5E1",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.3s",
              padding: 0,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: isDark ? 26 : 3,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--background)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            General
          </span>
        </div>
        {[
          {
            icon: <Bell size={20} />,
            label: "Notifications",
            status: "On",
            color: "rgba(249,115,22,0.12)",
            iconColor: "#F97316",
          },
          {
            icon: <Shield size={20} />,
            label: "Privacy & Security",
            color: "rgba(239,68,68,0.12)",
            iconColor: "#EF4444",
          },
          {
            icon: <CircleHelp size={20} />,
            label: "Help & Support",
            color: "rgba(100,116,139,0.12)",
            iconColor: "#64748B",
          },
        ].map((item, idx, arr) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom:
                idx === arr.length - 1 ? "none" : "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: item.iconColor }}>{item.icon}</span>
              </div>
              <span
                style={{
                  color: "var(--on-surface)",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>
            </div>
            {item.status ? (
              <span
                style={{
                  color: "var(--success)",
                  fontSize: "12px",
                  fontWeight: 600,
                  background: "rgba(34,197,94,0.12)",
                  padding: "2px 10px",
                  borderRadius: 12,
                }}
              >
                {item.status}
              </span>
            ) : (
              <span
                style={{ color: "var(--text-secondary)", fontSize: "18px" }}
              >
                ›
              </span>
            )}
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="card p-2">
        <div
          style={{
            padding: "12px 5px 8px",
            borderBottom: "1px solid var(--border)",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            System
          </span>
        </div>
        {[
          { label: "App Version", value: "1.0.0-stable" },
          { label: "Environment", value: "Production" },
          {
            label: "API Status",
            value: "Online",
            valueColor: "var(--success)",
          },
          { label: "Theme", value: isDark ? "Dark Mode" : "Light Mode" },
        ].map((row, idx, arr) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: idx === arr.length - 1 ? 0 : "10px",
              borderBottom:
                idx === arr.length - 1 ? "none" : "1px solid var(--border)",
              marginBottom: idx === arr.length - 1 ? 0 : "10px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {row.label}
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: row.valueColor || "var(--on-surface)",
              }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
