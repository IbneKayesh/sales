import React from "react";
import { Bell, Shield, Moon, CircleHelp, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import "./SettingsPage.css";

const SettingsPage = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="page-container settings-page">
      <div className="card settings-card">
        <div className="settings-section-header">Appearance</div>
        <div className="settings-row">
          <div className="settings-row-left">
            <div className={`settings-icon-box ${isDark ? "dark" : "light"}`}>
              {isDark ? <Moon size={18} color="var(--primary)" /> : <Sun size={18} color="var(--primary)" />}
            </div>
            <div>
              <div className="settings-row-title">{isDark ? "Dark Mode" : "Light Mode"}</div>
              <div className="settings-row-sub">Toggle app theme</div>
            </div>
          </div>
          <button type="button" onClick={toggleTheme} className={`settings-toggle ${isDark ? "on" : ""}`} aria-label="Toggle theme">
            <span className="settings-toggle-knob" />
          </button>
        </div>
      </div>

      <div className="card settings-card">
        <div className="settings-section-header">General</div>
        {[
          { icon: <Bell size={18} />, label: "Notifications", status: "On", color: "rgba(249,115,22,0.12)", iconColor: "#F97316" },
          { icon: <Shield size={18} />, label: "Privacy & Security", color: "rgba(239,68,68,0.12)", iconColor: "#EF4444" },
          { icon: <CircleHelp size={18} />, label: "Help & Support", color: "rgba(100,116,139,0.12)", iconColor: "#64748B" },
        ].map((item, idx, arr) => (
          <div key={item.label} className={`settings-row ${idx < arr.length - 1 ? "bordered" : ""}`}>
            <div className="settings-row-left">
              <div className="settings-icon-box" style={{ background: item.color, color: item.iconColor }}>
                {item.icon}
              </div>
              <span className="settings-row-title">{item.label}</span>
            </div>
            {item.status ? (
              <span className="settings-status-badge">{item.status}</span>
            ) : (
              <span className="settings-chevron">›</span>
            )}
          </div>
        ))}
      </div>

      <div className="card settings-card settings-info">
        <div className="settings-section-header">About</div>
        {[
          { label: "App Version", value: "1.0.0" },
          { label: "Environment", value: "Demo" },
          { label: "Data Mode", value: "Local Storage", valueColor: "var(--primary)" },
          { label: "Theme", value: isDark ? "Dark" : "Light" },
        ].map((row, idx, arr) => (
          <div key={row.label} className={`settings-info-row ${idx < arr.length - 1 ? "bordered" : ""}`}>
            <span className="settings-info-label">{row.label}</span>
            <span className="settings-info-value" style={row.valueColor ? { color: row.valueColor } : undefined}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
