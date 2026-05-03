import React, { useState } from "react";
import "./Topbar.css";
import LoggedUser from "./LoggedUser";
import { useAuth } from "@/hooks/useAuth.jsx";
import Calculator from "@/components/common/Calculator";

const Topbar = ({ sidebarCollapsed, onToggleLeftbar }) => {
  const { business } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          {sidebarCollapsed && (
            <div className="topbar-logo">
              <div className="topbar-logo-icon">
                <i className="pi pi-th-large"></i>
              </div>
              <span className="title-gradient">EAAC</span>
            </div>
          )}
          <button
            className="topbar-btn"
            onClick={onToggleLeftbar}
            title="Toggle Menu"
          >
            <i
              className={`pi ${sidebarCollapsed ? "pi-folder" : "pi-folder-open"}`}
              aria-label="Toggle sidebar"
            ></i>
          </button>
          <button
            className="topbar-btn"
            onClick={toggleFullScreen}
            title="Toggle Fullscreen"
          >
            <i
              className={`pi ${isFullScreen ? "pi-window-minimize" : "pi-window-maximize"}`}
            ></i>
          </button>
          <span className="title-gradient font-bold">{business.bsins_bname}</span>
        </div>

        <div className="topbar-right">
          <div className="topbar-actions">
            <button
              className={`topbar-btn action${showCalculator ? " active" : ""}`}
              title="Calculator"
              onClick={() => setShowCalculator((prev) => !prev)}
            >
              <i className="pi pi-calculator"></i>
            </button>
            <button className="topbar-btn action" title="Notifications">
              <i className="pi pi-bell"></i>
              <span className="notification-badge"></span>
            </button>
          </div>
          <div className="topbar-divider"></div>
          <div className="topbar-user-section">
            <LoggedUser />
          </div>
        </div>
      </div>

      <Calculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </>
  );
};

export default Topbar;
