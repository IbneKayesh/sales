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
      name: "Sales",
      icon: "pi pi-shopping-bag",
      submenus: [
        { id: "sl1", name: "Sales Request", url: "/home/srequest", icon: "pi pi-file" },
      ],
    },    {
      name: "Purchase",
      icon: "pi pi-shopping-cart",
      submenus: [
        { id: "pr1", name: "Purchase Request", url: "/home/prequest", icon: "pi pi-file" },
      ],
    },
    {
      name: "Accounts",
      icon: "pi pi-money-bill",
      submenus: [
        { id: "ac1", name: "Bank Account", url: "/home/accounts/bank-account", icon: "pi pi-user" },
        { id: "ac2", name: "Bank Transaction", url: "/home/accounts/bank-transaction", icon: "pi pi-money-bill" },
        { id: "ac3", name: "Supplier Payments", url: "/home/accounts/supplier-payments", icon: "pi pi-receipt" },
      ],
    },
    {
      name: "Inventory",
      icon: "pi pi-box",
      submenus: [
        { id: "in1", name: "Items", url: "/home/inventory/items", icon: "pi pi-box" },
        { id: "in2", name: "Units", url: "/home/inventory/units", icon: "pi pi-tags" },
        { id: "in3", name: "Category", url: "/home/inventory/category", icon: "pi pi-list-check" },
      ],
    },
    {
      name: "Setup",
      icon: "pi pi-cog",
      submenus: [
        { id: "st1", name: "Closing", url: "/home/setup/closing-process", icon: "pi pi-sparkles" },
        { id: "st2", name: "Contacts", url: "/home/setup/contacts", icon: "pi pi-address-book" },
        { id: "st3", name: "Users", url: "/home/setup/users", icon: "pi pi-users" },
        { id: "st4", name: "Change Password", url: "/home/setup/change-password", icon: "pi pi-unlock" },
        { id: "st5", name: "Backup", url: "/home/setup/backup", icon: "pi pi-save" },
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
