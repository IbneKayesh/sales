// Topbar.jsx
import React from "react";
import "./Topbar.css";

const Topbar = ({ onSelectTab }) => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <button
          className="topbar-button"
          onClick={(e) => onSelectTab("features")}
        >
          Features
        </button>
        <button
          className="topbar-button"
          onClick={(e) => onSelectTab("tables")}
        >
          Table
        </button>
      </div>
    </div>
  );
};

export default Topbar;
