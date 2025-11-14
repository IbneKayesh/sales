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

  useEffect(() => {
    const data = getStorageData();
    setLeftbarCollapsed(data.leftbarCollapsed);
    setIsFullMode(data.fullMode);
  }, []);
  const menus = [
    {
      name: "Purchase",
      icon: "pi pi-shopping-cart",
      submenus: [
        { id: 1, name: "Purchase Request", url: "/home/prequest", icon: "pi pi-file" },
      ],
    },
    {
      name: "Sales",
      icon: "pi pi-shopping-bag",
      submenus: [
        { id: 2, name: "Sales Request", url: "/home/srequest", icon: "pi pi-file" },
      ],
    },
    {
      name: "Setup",
      icon: "pi pi-cog",
      submenus: [
        { id: 3, name: "Bank", url: "/home/setup/bank", icon: "pi pi-building" },
        { id: 4, name: "Bank Account", url: "/home/setup/bank-account", icon: "pi pi-user" },
        { id: 8, name: "Bank Transaction", url: "/home/setup/bank-transaction", icon: "pi pi-money-bill" },
        { id: 5, name: "Items", url: "/home/setup/items", icon: "pi pi-box" },
        { id: 6, name: "Units", url: "/home/setup/units", icon: "pi pi-tags" },
        { id: 7, name: "Contacts", url: "/home/setup/contacts", icon: "pi pi-users" },
      ],
    },
  ];

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
          menus={menus}
        />
      )}
      <div className="app-content">
        {!leftbarCollapsed  && (
          <Leftbar
            menus={menus}
          />
        )}
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
          menus={menus}
          leftbarCollapsed={leftbarCollapsed}
        />
      )}
    </div>
  );
};

export default Layout;
