import React, { useState, useEffect } from "react";

const accentOptions = [
  { id: "blue", name: "Windows Blue", color: "#0078d4" },
  { id: "green", name: "Emerald", color: "#107c41" },
  { id: "orange", name: "Flame Orange", color: "#d83b01" },
  { id: "purple", name: "Royal Purple", color: "#8764b8" },
  { id: "red", name: "Crimson", color: "#e81123" },
];

export default function LoggedUserUI({ user, onLogout, onClose }) {
  const [selectedAccent, setSelectedAccent] = useState(() => {
    return localStorage.getItem("theme-accent") || "blue";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedAccent);
    localStorage.setItem("theme-accent", selectedAccent);
  }, [selectedAccent]);

  const handleAccentChange = (accentId) => {
    setSelectedAccent(accentId);
  };

  return (
    <>
      <div className="flyout-backdrop" onClick={onClose} />

      <div className="profile-flyout acrylic-container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.avatarText || user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{user.name}</span>
            <span className="profile-role">{user.role || "Administrator"}</span>
          </div>
        </div>

        <div className="profile-body">
          <button
            className="profile-item-btn"
            onClick={() => alert("Profile settings are under development!")}
          >
            ⚙️ Profile Settings
          </button>

          <button className="profile-item-btn">🔐 Change Password</button>

          <div className="accent-selector">
            {accentOptions.map((accent) => (
              <button
                key={accent.id}
                className={`accent-option ${selectedAccent === accent.id ? "active" : ""}`}
                onClick={() => handleAccentChange(accent.id)}
                title={accent.name}
              >
                <span
                  className="accent-swatch"
                  style={{ backgroundColor: accent.color }}
                />
                <span className="accent-name">{accent.name}</span>
              </button>
            ))}
          </div>

          <button className="profile-item-btn logout" onClick={onLogout}>
            🔒 Lock
          </button>
          <button className="profile-item-btn logout" onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
