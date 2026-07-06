import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth, ROLES } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user, isAuthenticated, isCustomer, isShop, logout } = useAuth();

  return (
    <header className="app-header">
      <button className="ui-btn-icon" onClick={onMenu}><FiMenu /></button>

      <div style={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
        <h2 className="app-logo-title" style={{ fontSize: "0.95rem" }}>
          {isAuthenticated && user ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>
                {user.name}
              </span>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, opacity: 0.85, background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>
                {isShop ? "SHOP" : "CUSTOMER"}
              </span>
            </span>
          ) : (
            "Virtual Mart"
          )}
        </h2>
      </div>

      {isAuthenticated ? (
        <button className="ui-btn-icon" onClick={logout}><FiLogOut /></button>
      ) : (
        <button className="ui-btn-icon" onClick={onMenu} style={{ visibility: "hidden" }}><FiLogOut /></button>
      )}
    </header>
  );
}
