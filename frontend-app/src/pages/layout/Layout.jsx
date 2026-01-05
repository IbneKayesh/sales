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
        { id: "sl1", name: "Sales", url: "/home/sales", icon: "pi pi-file" },
      ],
    },    {
      name: "Purchase",
      icon: "pi pi-shopping-cart",
      submenus: [
        { id: "pr1", name: "Booking", url: "/home/purchase/purchase-booking", icon: "pi pi-file" },
        { id: "pr2", name: "Invoice", url: "/home/purchase/purchase-invoice", icon: "pi pi-file" },
        { id: "pr3", name: "Order", url: "/home/purchase/purchase-order", icon: "pi pi-file" },
        { id: "pr4", name: "Return", url: "/home/purchase/purchase-return", icon: "pi pi-file" },
      ],
    },
    {
      name: "Accounts",
      icon: "pi pi-money-bill",
      submenus: [
        { id: "ac1", name: "Banks", url: "/home/accounts/banks", icon: "pi pi-building-columns" },
        { id: "ac2", name: "Ledger", url: "/home/accounts/ledger", icon: "pi pi-arrow-right-arrow-left" },
        { id: "ac3", name: "Expenses", url: "/home/accounts/expenses", icon: "pi pi-receipt" },
        { id: "ac4", name: "Payables", url: "/home/accounts/payables", icon: "pi pi-money-bill" },
        { id: "ac5", name: "Receivables", url: "/home/accounts/receivables", icon: "pi pi-money-bill" },
        { id: "ac6", name: "VAT", url: "/home/accounts/vat", icon: "pi pi-percentage" },
      ],
    },
    {
      name: "Inventory",
      icon: "pi pi-box",
      submenus: [
        { id: "in1", name: "Unit", url: "/home/inventory/unit", icon: "pi pi-tags" },
        { id: "in2", name: "Category", url: "/home/inventory/category", icon: "pi pi-list-check" },
        { id: "in3", name: "Product", url: "/home/inventory/product", icon: "pi pi-box" },
      ],
    },
    {
      name: "Setup",
      icon: "pi pi-cog",
      submenus: [        
        { id: "st1", name: "Shops", url: "/home/setup/shops", icon: "pi pi-shop" },
        { id: "st2", name: "Users", url: "/home/setup/users", icon: "pi pi-users" },
        { id: "st3", name: "Contact", url: "/home/setup/contact", icon: "pi pi-address-book" },
        { id: "st4", name: "Closing", url: "/home/setup/closing-process", icon: "pi pi-sparkles" },
        { id: "st5", name: "Change Password", url: "/home/setup/change-password", icon: "pi pi-unlock" },
        { id: "st6", name: "Backup", url: "/home/setup/backup", icon: "pi pi-save" },
        { id: "st7", name: "Settings", url: "/home/setup/settings", icon: "pi pi-cog" },
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
