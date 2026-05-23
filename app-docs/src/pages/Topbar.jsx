const NAV_ITEMS = [
  {
    id: "features",
    label: "Features",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="9"
          y="3"
          width="6"
          height="4"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 12h6M9 16h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "tables",
    label: "Tables",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 9h18M3 15h18M9 3v18M15 3v18"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];

const Topbar = ({ onSelectTab, activeTab }) => {
  return (
    <header className="topbar">
      <div className="topbar-container">
        <button
          type="button"
          className="topbar-brand"
          onClick={() => onSelectTab("features")}
          aria-label="App Docs home — go to Features"
        >
          <span className="topbar-logo-mark" aria-hidden="true">
            AD
          </span>
          <span className="topbar-brand-text">
            <span className="app-title">App Docs</span>
            <span className="app-tagline">Task &amp; Schema Management</span>
          </span>
        </button>

        <nav className="topbar-nav" aria-label="Main">
          <div className="topbar-nav-track" role="tablist">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`nav-button${isActive ? " active" : ""}`}
                  onClick={() => onSelectTab(item.id)}
                >
                  <span className="nav-button-icon">{item.icon}</span>
                  <span className="nav-button-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Topbar;
