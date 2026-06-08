import { useState } from "react";
import "./LeftbarKit.css";

const navItems = [
  { id: "favorite", label: "Favorite", hint: "Pinned forms" },
  { id: "quick-access", label: "Quick Access", hint: "Frequent actions" },
  { id: "app-suite", label: "App Suite", hint: "Browse modules" },
  { id: "sales", label: "Sales", hint: "Invoices and reports" },
  { id: "purchase", label: "Purchase", hint: "Orders and bills" },
  { id: "inventory", label: "Inventory", hint: "Stock and warehouses" },
];

const LeftbarKit = ({ activeModule }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className={`form-leftbar ${isCollapsed ? "collapsed" : ""}`}
      aria-label="Form navigation"
    >
      <button
        className="leftbar-toggle"
        onClick={toggleCollapse}
        type="button"
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        {isCollapsed ? "→" : "←"}
      </button>

      {!isCollapsed && (
        <>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`form-leftbar-button ${
                activeModule === item.id ? "active" : ""
              }`}
              type="button"
              title={item.hint}
            >
              <span>{item.label}</span>
              <small>{item.hint}</small>
            </button>
          ))}
        </>
      )}
    </nav>
  );
};

export default LeftbarKit;
