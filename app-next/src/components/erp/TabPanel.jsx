/**
 * Reusable tabbed card with tabs, view toggle (table/grid), and primary action button.
 * Used by all CRUD pages in the ERP.
 */
export default function TabPanel({
  tabs,
  activeTab,
  onTabChange,
  actions,
  viewMode,
  onViewModeChange,
  children,
}) {
  return (
    <div className="tab-card">
      <div className="tab-header">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.icon && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  dangerouslySetInnerHTML={{ __html: tab.icon }} />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-header-right">
          {viewMode !== undefined && onViewModeChange && (
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => onViewModeChange('table')}
                title="Table View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => onViewModeChange('grid')}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
              </button>
            </div>
          )}

          {actions}
        </div>
      </div>

      <div className="tab-content">
        {children}
      </div>
    </div>
  );
}
