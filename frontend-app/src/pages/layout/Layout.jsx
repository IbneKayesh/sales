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
      const groupKey = item.menus_gname;

      // Create group if it doesn't exist
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          menus_gname: item.menus_gname,
          menus_gicon: item.menus_gicon,
          submenus: [],
        };
      }

      // Push submenu
      grouped[groupKey].submenus.push({
        id: item.id,
        menus_mname: item.menus_mname,
        menus_mlink: item.menus_mlink,
        menus_micon: item.menus_micon,
      });
    });

    // Convert object to array
    return Object.values(grouped);
  }

  const menus = [
    {
      name: "Sales",
      icon: "pi pi-shopping-bag",
      submenus: [
        {
          id: "sl1",
          name: "Invoice",
          url: "/home/sales/sinvoice",
          icon: "pi pi-file-edit",
        },
        {
          id: "sl2",
          name: "Module",
          url: "/home/module",
          icon: "pi pi-file-edit",
        },
      ],
    },
    {
      name: "Purchase",
      icon: "pi pi-shopping-cart",
      submenus: [
        {
          id: "pr1",
          name: "Booking",
          url: "/home/purchase/pbooking",
          icon: "pi pi-check-square",
        },
        {
          id: "pr2",
          name: "Receipt",
          url: "/home/purchase/preceipt",
          icon: "pi pi-receipt",
        },
        {
          id: "pr3",
          name: "Invoice",
          url: "/home/purchase/pinvoice",
          icon: "pi pi-file-edit",
        },
        {
          id: "pr4",
          name: "Return",
          url: "/home/purchase/preturn",
          icon: "pi pi-replay",
        },
      ],
    },
    {
      name: "Accounts",
      icon: "pi pi-money-bill",
      submenus: [
        {
          id: "ac1",
          name: "Accounts",
          url: "/home/accounts/accounts",
          icon: "pi pi-building-columns",
        },
        {
          id: "ac2",
          name: "Heads",
          url: "/home/accounts/heads",
          icon: "pi pi-objects-column",
        },
        {
          id: "ac3",
          name: "Ledger",
          url: "/home/accounts/ledger",
          icon: "pi pi-arrow-right-arrow-left",
        },
        {
          id: "ac4",
          name: "Payables",
          url: "/home/accounts/payables",
          icon: "pi pi-money-bill",
        },
        {
          id: "ac5",
          name: "Receivables",
          url: "/home/accounts/receivables",
          icon: "pi pi-money-bill",
        },
        {
          id: "ac6",
          name: "Expenses",
          url: "/home/accounts/expenses",
          icon: "pi pi-money-bill",
        },
      ],
    },
    {
      name: "Inventory",
      icon: "pi pi-box",
      submenus: [
        {
          id: "in1",
          name: "Product",
          url: "/home/inventory/products",
          icon: "pi pi-box",
        },
        {
          id: "in2",
          name: "Unit",
          url: "/home/inventory/unit",
          icon: "pi pi-tags",
        },
        {
          id: "in3",
          name: "Category",
          url: "/home/inventory/category",
          icon: "pi pi-list-check",
        },
        {
          id: "in4",
          name: "Tracking Stock",
          url: "/home/inventory/stockreports",
          icon: "pi pi-file",
        },
        {
          id: "in5",
          name: "Stock Transfer",
          url: "/home/inventory/itransfer",
          icon: "pi pi-arrow-right-arrow-left",
        },
      ],
    },
    {
      name: "CRM",
      icon: "pi pi-address-book",
      submenus: [
        {
          id: "crm1",
          name: "Contact",
          url: "/home/crm/contact",
          icon: "pi pi-id-card",
        },
        {
          id: "crm2",
          name: "Routes",
          url: "/home/crm/field-route",
          icon: "pi pi-directions",
        },
      ],
    },
    {
      name: "HRMS",
      icon: "pi pi-users",
      submenus: [
        {
          id: "hrm1",
          name: "Employee",
          url: "/home/hrms/employees",
          icon: "pi pi-user",
        },
      ],
    },
    {
      name: "Setup",
      icon: "pi pi-cog",
      submenus: [
        {
          id: "st1",
          name: "Business",
          url: "/home/setup/business",
          icon: "pi pi-shop",
        },
        {
          id: "st2",
          name: "Users",
          url: "/home/setup/users",
          icon: "pi pi-users",
        },
        {
          id: "st3",
          name: "Change Password",
          url: "/home/setup/users/password",
          icon: "pi pi-unlock",
        },
        {
          id: "st4",
          name: "Closing",
          url: "/home/setup/closing-process",
          icon: "pi pi-sparkles",
        },
        {
          id: "st5",
          name: "Database",
          url: "/home/setup/database",
          icon: "pi pi-database",
        },
        {
          id: "st6",
          name: "Settings",
          url: "/home/setup/settings",
          icon: "pi pi-sliders-v",
        },
      ],
    },
    {
      name: "Support",
      icon: "pi pi-info-circle",
      submenus: [
        {
          id: "sp1",
          name: "Grains",
          url: "/home/support/grains",
          icon: "pi pi-credit-card",
        },
        {
          id: "sp2",
          name: "Notes",
          url: "/home/support/notes",
          icon: "pi pi-pencil",
        },
        {
          id: "sp3",
          name: "Tickets",
          url: "/home/support/tickets",
          icon: "pi pi-ticket",
        },
        {
          id: "sp4",
          name: "Sessions",
          url: "/home/support/sessions",
          icon: "pi pi-users",
        },
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
          menus={menus}
          leftbarCollapsed={leftbarCollapsed}
        />
      )}
    </div>
  );
};

export default Layout;
