import React, { createContext, useContext, useState } from "react";
import {
  ShoppingCart,
  Package,
  BookOpen,
  BarChart2,
  FileText,
  ClipboardList,
  CreditCard,
  Users,
  Boxes,
  Tags,
  Warehouse,
  PlusCircle,
  LayoutGrid,
  DollarSign,
  Receipt,
  TrendingUp,
} from "lucide-react";

// ── Module definitions ─────────────────────────────────────
export const MODULES = [
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    color: "#0F766E",
    bg: "rgba(15,118,110,0.12)",
    description: "Invoices, Orders & Payments",
    menus: [
      { label: "Invoice List", icon: FileText, path: "/invoice/list" },
      { label: "Create Invoice", icon: PlusCircle, path: "/invoice/entry" },
      {
        label: "Orders",
        icon: ClipboardList,
        path: "/sales/orders",
      },
      {
        label: "Payment Collection",
        icon: CreditCard,
        path: "/sales/payments",
      },
      { label: "Outlets", icon: Users, path: "/crm/outlets" },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.12)",
    description: "Stock, Categories & Pricing",
    menus: [
      { label: "Product List", icon: Boxes, path: "/products/list" },
      { label: "Add Product", icon: PlusCircle, path: "/products/add" },
      { label: "Categories", icon: Tags, path: "/products/categories" },
      { label: "Stock Levels", icon: Warehouse, path: "/products/stock" },
    ],
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: BookOpen,
    color: "#DB2777",
    bg: "rgba(219,39,119,0.12)",
    description: "Ledger, Expenses & Payables",
    menus: [
      { label: "Chart of Accounts", icon: LayoutGrid, path: "/accounts/chart" },
      { label: "Transactions", icon: Receipt, path: "/accounts/transactions" },
      { label: "Expenses", icon: DollarSign, path: "/accounts/expenses" },
      { label: "Payables", icon: CreditCard, path: "/accounts/payables" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart2,
    color: "#D97706",
    bg: "rgba(217,119,6,0.12)",
    description: "Sales, Stock & Financial Reports",
    menus: [
      { label: "Sales Report", icon: TrendingUp, path: "/reports/sales" },
      { label: "Stock Report", icon: Boxes, path: "/reports/stock" },
      { label: "Account Report", icon: BookOpen, path: "/reports/accounts" },
      { label: "Daily Summary", icon: BarChart2, path: "/reports/daily" },
    ],
  },
];

// ── Context ────────────────────────────────────────────────
const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
  const [activeModule, setActiveModule] = useState(null);

  const selectModule = (moduleId) => {
    const mod = MODULES.find((m) => m.id === moduleId) || null;
    setActiveModule(mod);
  };

  return (
    <ModuleContext.Provider value={{ activeModule, selectModule, MODULES }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
