import { useState } from "react";
import "../inventory/InventoryPage.css";

const ProfilePage = ({ onSignOut }) => {
  const [userInfo] = useState({
    name: "Administrator",
    email: "admin@erp-system.local",
    role: "System Administrator",
    organization: "Sales Department",
    lastLogin: new Date().toLocaleString(),
  });

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  return (
    <div className="page-container">
      <div className="page-section">
        <h2>User Profile</h2>
      </div>

      <div className="page-section">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--win11-accent), var(--win11-teal-soft))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "700",
              color: "#ffffff",
            }}
          >
            {userInfo.name.charAt(0)}
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0" }}>{userInfo.name}</h3>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "12px",
                color: "var(--win11-muted)",
              }}
            >
              {userInfo.role}
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "12px",
                color: "var(--win11-muted)",
              }}
            >
              {userInfo.organization}
            </p>
          </div>
        </div>
      </div>

      <div className="page-section">
        <h3>Account Information</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "12px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--win11-muted)",
                margin: "0 0 4px 0",
              }}
            >
              Email
            </p>
            <p style={{ margin: "0", fontSize: "13px", fontWeight: "500" }}>
              {userInfo.email}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--win11-muted)",
                margin: "0 0 4px 0",
              }}
            >
              Last Login
            </p>
            <p style={{ margin: "0", fontSize: "13px", fontWeight: "500" }}>
              {userInfo.lastLogin}
            </p>
          </div>
        </div>
      </div>

      <div className="page-section">
        <h3>Settings</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "12px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: "13px" }}>Enable notifications</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: "13px" }}>Keep session active</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" />
            <span style={{ fontSize: "13px" }}>Dark mode</span>
          </label>
        </div>
      </div>

      <div className="page-section">
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "1px solid var(--win11-border)",
            background: "var(--win11-danger)",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "var(--win11-danger-dark)";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "var(--win11-danger)";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
