import React, { useState } from "react";
import { Menu, Bell, User } from "lucide-react";

// Map of route paths to human-readable page titles
const PAGE_TITLES = {
  "/": "Dashboard",
  "/modules": "Modules",
  "/search": "Search",
  "/profile": "Profile",
  "/profile/change-password": "Change Password",
  "/settings": "Settings",
  "/invoice/list": "Invoices",
  "/invoice/entry": "New Invoice",
  "/sales/orders": "Orders",
  "/sales/payments": "Payment Collection",
  "/sales/customers": "Customers",
  "/products/list": "Products",
  "/products/add": "Add Product",
  "/products/categories": "Categories",
  "/products/stock": "Stock Levels",
  "/accounts/chart": "Chart of Accounts",
  "/accounts/transactions": "Transactions",
  "/accounts/expenses": "Expenses",
  "/accounts/payables": "Payables",
  "/reports/sales": "Sales Report",
  "/reports/stock": "Stock Report",
  "/reports/accounts": "Account Report",
  "/reports/daily": "Daily Summary",
};

const getPageTitle = (pathname) => {
  // Exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Dynamic route match e.g. /invoice/view/INV-1001
  if (pathname.startsWith("/invoice/view/")) return "Invoice Details";
  if (pathname.startsWith("/invoice/print/")) return "Print Receipt";
  return "Business Assistant";
};

const TopNav = () => {






 

  



  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-left">
          <button className="icon-btn" >
            <Menu size={24} />
          </button>
          <span className="view-title">{pageTitle}</span>
        </div>

        <div className="top-nav-right">
          <button className="icon-btn" >
            <Bell size={22} />
            <div className="badge"></div>
          </button>
          <button className="icon-btn">
            <User size={22} />
          </button>
        </div>
      </nav>
     
    </>
  );
};

export default TopNav;
