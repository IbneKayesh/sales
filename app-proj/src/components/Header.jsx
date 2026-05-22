import { useEffect, useState } from 'react';

export default function Header({ activeTab, setActiveTab, dbStatus, error, onRetry }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="logo-icon">PG</div>
          <div>
            <h1 className="app-title">Schema Modeler</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-xs theme-toggle-btn"
            style={{
              padding: '6px 10px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              gap: 4
            }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          <div className="db-badge">
            <span className={`status-dot ${dbStatus.status === 'connected' ? 'connected' : 'disconnected'}`} />
            {dbStatus.status === 'connected'
              ? `${dbStatus.counts.projects || 0}P / ${dbStatus.counts.modules}M / ${dbStatus.counts.tables}T / ${dbStatus.counts.columns}C / ${dbStatus.counts.features}F`
              : 'Postgres Offline'}
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button className="btn btn-secondary btn-xs" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      <nav className="nav-tabs">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'erd', label: 'ERD View' },
          { id: 'projects', label: 'Projects Grid' },
          { id: 'designer', label: 'Tables Grid' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}
