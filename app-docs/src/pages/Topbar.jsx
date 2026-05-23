// Topbar.jsx
import React from "react";

const Topbar = ({ onSelectTab, activeTab }) => {
  return (
    <header className="topbar">
      <div className="topbar-container">
        <div className="topbar-logo">
          <h1 className="app-title">App Docs</h1>
        </div>
        <nav className="topbar-nav">
          <button
            className={`nav-button ${activeTab === "features" ? "active" : ""}`}
            onClick={(e) => onSelectTab("features")}
          >
            Features
          </button>
          <button
            className={`nav-button ${activeTab === "tables" ? "active" : ""}`}
            onClick={(e) => onSelectTab("tables")}
          >
            Tables
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;
