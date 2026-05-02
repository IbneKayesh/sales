import React, { useState } from "react";
import "./Topbar.css";
import LoggedUser from "./LoggedUser";

const Topbar = ({ sidebarCollapsed, onToggleLeftbar }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

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
      </div>

      <div className="topbar-right">
        <div className="topbar-actions">
          <button className="topbar-btn action" title="Calculator">
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
  );
};

export default Topbar;
