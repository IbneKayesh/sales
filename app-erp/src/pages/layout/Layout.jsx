import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Leftbar from "./Leftbar";
import FloatingMenu from "./FloatingMenu";
import { getStorageData, setStorageData } from "@/utils/storage";
import "./Layout.css";

const Layout = () => {
  const [leftbarCollapsed, setLeftbarCollapsed] = useState(false);
  const [isFullMode, setIsFullMode] = useState(false);
  const [userMenus, setUserMenus] = useState([]);

  useEffect(() => {
    const refreshMenus = () => {
      const data = getStorageData();
      const output = buildMenus(data.menus || []);
      setUserMenus(output);
    };

    const data = getStorageData();
    setLeftbarCollapsed(data.leftbarCollapsed);
    setIsFullMode(data.fullMode);
    refreshMenus();

    window.addEventListener("menusUpdated", refreshMenus);
    return () => window.removeEventListener("menusUpdated", refreshMenus);
  }, []);

  function buildMenus(menus) {

    const grouped = {};

    menus.forEach((item) => {
      //console.log("item",item)
      const groupKey = "Menu";// item.menus_gname;

      // Create group if it doesn't exist
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          menus_gname: "Menu",// item.menus_gname,
          menus_gicon: item.menus_gicon,
          submenus: [],
        };
      }

      // Push submenu
      grouped[groupKey].submenus.push({
        id: item.id,
        menus_mname: item.label,
        menus_mlink: item.link,
        menus_micon: item.menus_micon,
      });
    });

    // Convert object to array
    return Object.values(grouped);
  }

  return (
    <div className="app-page">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {!isFullMode && (
        <Topbar
          leftbarCollapsed={leftbarCollapsed}
          onToggleLeftbar={() => {
            const newCollapsed = !leftbarCollapsed;
            setLeftbarCollapsed(newCollapsed);
            setStorageData({ leftbarCollapsed: newCollapsed });
          }}
          onToggleFullMode={() => {
            const newFullMode = !isFullMode;
            setIsFullMode(newFullMode);
            setStorageData({ fullMode: newFullMode });
          }}
          menus={userMenus}
        />
      )}
      <div className="app-content">
        {!leftbarCollapsed && <Leftbar menus={userMenus} />}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      {isFullMode && (
        <FloatingMenu
          onShowTopBar={() => {
            setIsFullMode(false);
            setStorageData({ fullMode: false });
          }}
          onShowLeftBar={() => {
            const newCollapsed = !leftbarCollapsed;
            setLeftbarCollapsed(newCollapsed);
            setStorageData({ leftbarCollapsed: newCollapsed });
          }}
          menus={userMenus}
          leftbarCollapsed={leftbarCollapsed}
        />
      )}
    </div>
  );
};

export default Layout;
