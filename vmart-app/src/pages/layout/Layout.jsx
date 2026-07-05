import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getStorageLoginData, setStorageLoginData } from "@/utils/storage";

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(getStorageLoginData().sidebar === "visible");

  const toggleSidebar = () => {
    setSidebarVisible((prev) => {
      const newState = !prev;
      setStorageLoginData({ sidebar: newState ? "visible" : "hidden" });
      return newState;
    });
  };

  return (
    <div className={`app-layout ${!sidebarVisible ? "sidebar-collapsed" : ""}`}>
      <Topbar 
        sidebarCollapsed={!sidebarVisible}
        onToggleLeftbar={toggleSidebar} 
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
