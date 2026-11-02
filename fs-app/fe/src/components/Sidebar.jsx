const NAV = [
  {
    section: "Main",
    items: [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
    ],
  },
  {
    section: "Sales",
    items: [
      { id: "customers", icon: "👥", label: "Customers" },
      { id: "items",     icon: "📦", label: "Items" },
      { id: "orders",    icon: "🛒", label: "Orders" },
      { id: "invoices",  icon: "🧾", label: "Invoices" },
    ],
  },
  {
    section: "Developer & Data",
    items: [
      { id: "custom-json", icon: "⚙️", label: "Custom JSON Docs" },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate, counts = {} }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">💼</div>
        <div>
          <div className="brand-name">SalesBase</div>
          <div className="brand-sub">Business Manager</div>
        </div>
      </div>

      {/* Navigation */}
      {NAV.map((group) => (
        <div key={group.section} className="nav-section">
          <div className="nav-section-label">{group.section}</div>
          {group.items.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`nav-item${activePage === item.id ? " active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {counts[item.id] != null && (
                <span className="nav-count">{counts[item.id]}</span>
              )}
            </button>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">FileBase v1 · File-system DB</div>
    </aside>
  );
}
