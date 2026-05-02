import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className={`app-layout ${!sidebarVisible ? "sidebar-collapsed" : ""}`}>
        <Topbar 
        sidebarCollapsed={!sidebarVisible}
        onToggleLeftbar={() => setSidebarVisible((prev) => !prev)} 
      />
      <div className="app-container">
        <Sidebar collapsed={!sidebarVisible} />
        <div className="main-wrapper">
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
