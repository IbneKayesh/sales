import "./AppSuiteUI.css";
import { useState, useRef, useEffect } from "react";

const AppSuiteUI = ({ onOpenPageClick }) => {
  const appsuite = [
    {
      id: "sales",
      name: "Sales",
      icon: "📊",
      forms: "",
      size: "none",
      child: [
        {
          id: "sales-invoice",
          name: "Sales Invoice",
          icon: "📄",
          forms: "SalesInvoicePage",
          size: "none",
        },
        {
          id: "sales-report",
          name: "Sales Report",
          icon: "📈",
          forms: "SalesReportPage",
          size: "none",
        },
      ],
    },
    {
      id: "purchase",
      name: "Purchase",
      icon: "🛒",
      forms: "",
      size: "none",
      child: [
        {
          id: "purchase-invoice",
          name: "Purchase Invoice",
          icon: "📄",
          forms: "PurchaseInvoicePage",
          size: "none",
        },
        {
          id: "purchase-report",
          name: "Purchase Report",
          icon: "📈",
          forms: "PurchaseReportPage",
          size: "none",
        },
      ],
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: "📦",
      forms: "",
      size: "none",
      child: [
        {
          id: "inventory-report",
          name: "Inventory Report",
          icon: "📈",
          forms: "InventoryReportPage",
          size: "none",
        },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      icon: "📈",
      forms: "",
      size: "none",
      child: [
        {
          id: "setup-sales",
          name: "Sales",
          icon: "📄",
          forms: "NoPage",
          size: "none",
        },
        {
          id: "setup-purchase",
          name: "Purchase",
          icon: "📈",
          forms: "NoPage",
          size: "none",
        },
      ],
    },
  ];

  const [items, setItems] = useState(appsuite);
  const [history, setHistory] = useState([]);
  const containerRef = useRef(null);

  const handleAppSuiteItemClick = (item) => {
    if (item.child && item.child.length > 0) {
      setHistory((prev) => [...prev, items]);
      setItems(item.child);
    }

    if (item.forms) {
      onOpenPageClick(item);
    }
  };

  const handleBackClick = () => {
    if (history.length > 0) {
      const prevItems = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setItems(prevItems);
    }
  };

  return (
    <div className="app-suite">
      <div className="app-suite-header">App Suite</div>
      <div className="app-suite-search">
        <button
          className="btn-default"
          onClick={handleBackClick}
          disabled={history.length === 0}
        >
          Back
        </button>
        <input className="input-default" placeholder="search apps" />
      </div>
      <div className="app-suite-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="app-suite-item"
            onClick={() => handleAppSuiteItemClick(item)}
          >
            <span className="app-suite-icon">{item.icon}</span>
            <span className="app-suite-name">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppSuiteUI;
