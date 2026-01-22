import { useView } from "../hooks/useView";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "primereact/menu";
import React, { useRef } from "react";
import "./mobile.css";

const Layout = ({ children }) => {
  const { toggleView } = useView();
  const { user, business, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const navItems = [
    { label: "Home", icon: "pi pi-home", path: "/home" },
    { label: "Menus", icon: "pi pi-th-large", path: "/menus" },
    { label: "Activity", icon: "pi pi-bolt", path: "/sample" },
  ];

  const userMenuItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => navigate("/home/auth/profile"),
    },
    {
      label: "Security",
      icon: "pi pi-shield",
      command: () => navigate("/home/auth/password"),
    },
    { separator: true },
    {
      label: "Logout",
      icon: "pi pi-power-off",
      template: (item, options) => {
        return (
          <button
            onClick={logout}
            className={options.className}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              color: "#ef4444",
              border: "none",
              background: "none",
            }}
          >
            <i className={item.icon}></i>
            <span style={{ fontWeight: "600" }}>{item.label}</span>
          </button>
        );
      },
    },
  ];

  const currentPath = location.pathname;

  return (
    <div className="mobile-layout">
      <div className="mobile-container">
        {/* Header */}
        <header className="mobile-header">
          <div className="business-info">
            <span className="business-name">
              {business?.bsins_bname || "Sales App"}
            </span>
            <span className="user-welcome">
              Hello, {user?.users_oname?.split(" ")[0] || "User"}
            </span>
          </div>

          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <button
              onClick={toggleView}
              className="glass-btn"
              title="Switch to Web View"
            >
              <i className="pi pi-desktop" style={{ fontSize: "1rem" }}></i>
            </button>
            <div
              className="user-avatar"
              onClick={(e) => menuRef.current.toggle(e)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--mobile-primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                fontSize: "0.9rem",
                boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)",
                cursor: "pointer",
              }}
            >
              {user?.users_oname?.[0] || "U"}
            </div>
            <Menu
              model={userMenuItems}
              popup
              ref={menuRef}
              id="user_menu"
              style={{
                marginTop: "0.5rem",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                border: "1px solid #f1f5f9",
              }}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="mobile-content">{children}</main>

        {/* Custom Bottom Navigation */}
        <nav className="mobile-nav-bar">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/home" && currentPath === "/");
            return (
              <div
                key={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {isActive && (
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "var(--mobile-primary)",
                      marginTop: "2px",
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
