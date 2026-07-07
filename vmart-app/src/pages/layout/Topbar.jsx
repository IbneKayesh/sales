import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth, ROLES } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar({ onMenu }) {
  const { user, isAuthenticated, isCustomer, isShop, logout } = useAuth();

  return (
    <header className="app-header">
      <button className="ui-btn-icon" onClick={onMenu}>
        <FiMenu />
      </button>

      <div className="topbar-center">
        <h2 className="app-logo-title">
          {isAuthenticated && user ? (
            <span className="topbar-user-row">
              <span className="topbar-user-name">{user.name}</span>
              <span className="topbar-role-badge">
                {isShop ? "SHOP" : "CUSTOMER"}
              </span>
            </span>
          ) : (
            "Virtual Mart"
          )}
        </h2>
      </div>

      {isAuthenticated ? (
        <button className="ui-btn-icon" onClick={logout}>
          <FiLogOut />
        </button>
      ) : (
        <button className="ui-btn-icon ui-btn-icon--hidden" onClick={onMenu}>
          <FiLogOut />
        </button>
      )}
    </header>
  );
}