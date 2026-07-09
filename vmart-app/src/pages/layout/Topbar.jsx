import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar({ onMenu }) {
  const { user, role, logout } = useAuth();

  return (
    <header className="app-header">
      <button className="ui-btn-icon" onClick={onMenu}>
        <FiMenu />
      </button>

      <div className="topbar-center">
        <h2 className="app-logo-title">
          {user ? (
            <span className="topbar-user-row">
              <span className="topbar-user-name">{user.users_pname}</span>
              <span className="topbar-role-badge">
                {role == "SHOP" ? "Shop" : "Customer"}
              </span>
            </span>
          ) : (
            "Virtual Mart"
          )}
        </h2>
      </div>

      {user ? (
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
