import { useModule } from "@/context/ModuleContext";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Settings,
  LayoutGrid,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import React from "react";

const Sidebar = ({ isOpen, handleUrlNav }) => {
  if (!isOpen) return null;
  const { user } = useAuth();
  const { activeModule, selectModule } = useModule();

  const handleModuleNav = (path) => {
    handleUrlNav(path);
  };

  return (
    <div className={`lite-sidebar ${isOpen ? "open" : ""}`}>
      <div className="lite-sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            className="lite-avatar"
            style={{ background: "rgba(255,255,255,0.2)", fontSize: "20px" }}
          >
            👤
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "16px" }}>
              {user?.emply_ename}
            </div>
            <div style={{ fontSize: "11px", opacity: 0.8, marginTop: "2px" }}>
              {activeModule
                ? `📦 ${activeModule.label} Module`
                : "Premium Account"}
            </div>
          </div>
        </div>
      </div>

      <div className="lite-sidebar-content">
        {/* Core nav */}
        <div className="lite-sidebar-item" onClick={() => handleUrlNav("/")}>
          <Home size={20} color="var(--primary)" />
          <span>Home</span>
        </div>

        {/* Module picker */}
        <div
          className="lite-sidebar-item"
          onClick={() => handleUrlNav("/modules")}
        >
          <LayoutGrid size={20} color="#7C3AED" />
          <span>Modules</span>
        </div>

        {/* Dynamic Module Menu */}
        {activeModule && (
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--background)",
                borderRadius: "8px",
                margin: "8px 12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: activeModule.color,
                  }}
                />
                <span
                  className="label-small"
                  style={{ fontSize: "10px", color: activeModule.color }}
                >
                  {activeModule.label.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => selectModule(null)}
                className="lite-header-btn-primary"
                style={{ fontSize: "11px" }}
              >
                Clear
              </button>
            </div>

            {activeModule.menus.map((menu) => {
              const MenuIcon = menu.icon;
              return (
                <div
                  key={menu.label}
                  className="lite-sidebar-item"
                  onClick={() => handleModuleNav(menu.path)}
                  style={{ paddingLeft: "24px" }}
                >
                  <MenuIcon size={18} color={activeModule.color} />
                  <span>{menu.label}</span>
                  <ChevronRight
                    size={14}
                    color="var(--border)"
                    style={{ marginLeft: "auto" }}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="divider-line" />

        <div
          className="lite-sidebar-item"
          onClick={() => handleUrlNav("/settings")}
        >
          <Settings size={20} color="var(--text-secondary)" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
