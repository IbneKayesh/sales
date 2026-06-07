import React, { useEffect } from 'react';

export default function WindowsOverview({ windows, onFocusWindow, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const statusLabel = (win) => {
    if (win.minimized) return 'Minimized';
    return 'Open';
  };

  return (
    <div className="overview-overlay" onClick={onClose}>
      <div className="overview-title">Quick View</div>

      {windows.length === 0 ? (
        <div className="overview-empty">No windows are currently open.</div>
      ) : (
        <div className="overview-grid" onClick={e => e.stopPropagation()}>
          {windows.map(win => (
            <div key={win.id} className="overview-card" onClick={() => { onFocusWindow(win.id); onClose(); }} title={`Click to focus: ${win.title}`}>
              <div className="overview-card-header">
                <span className="overview-card-icon">{win.icon || '📄'}</span>
                <span className="overview-card-title">{win.title}</span>
                {win.minimized && <span className="overview-min-badge">MIN</span>}
              </div>
              <div className="overview-card-preview"><span className="overview-preview-icon">{win.icon || '📄'}</span></div>
              <div className="overview-card-footer">{statusLabel(win)}</div>
            </div>
          ))}
        </div>
      )}

      <button className="overview-close-btn" onClick={onClose}>
        ✕ Close Quick View &nbsp;(Esc)
      </button>
    </div>
  );
}
