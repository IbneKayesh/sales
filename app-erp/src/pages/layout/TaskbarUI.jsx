import React, { useState, useEffect, useRef } from 'react';

export default function TaskbarUI({
  windows,
  activeWindowId,
  onToggleMinimize,
  onFocus,
  user,
  onProfileClick,
  onStartClick,
  onCloseAll,
  onMinimizeAll,
  onMaximizeAll,
  onTileAll,
  isFullscreen,
  onToggleFullscreen,
  showDesktopActive,
  onToggleShowDesktop,
  onToggleOverview,
  unreadNotifCount,
  onToggleNotifications,
}) {
  const [time, setTime] = useState(new Date());
  const [showWinMenu, setShowWinMenu] = useState(false);
  const winMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showWinMenu) return;
    const handler = (e) => {
      if (winMenuRef.current && !winMenuRef.current.contains(e.target)) {
        setShowWinMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showWinMenu]);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });

  const handleItemClick = (win) => {
    if (win.id === activeWindowId && !win.minimized) {
      onToggleMinimize(win.id);
    } else {
      if (win.minimized) onToggleMinimize(win.id);
      onFocus(win.id);
    }
  };

  const runWinAction = (fn) => {
    setShowWinMenu(false);
    fn();
  };

  const taskbarItemsRef = useRef(null);
  const [isTaskbarOverflowing, setIsTaskbarOverflowing] = useState(false);

  useEffect(() => {
    const el = taskbarItemsRef.current;
    if (!el) return;

    const compute = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 1;
      setIsTaskbarOverflowing(hasOverflow);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    const onScroll = () => compute();
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', onScroll);
    };
  }, [windows.length]);

  return (
    <div className={`taskbar-container ${isTaskbarOverflowing ? 'overflow-taskbar' : ''}`}>
      <div className="taskbar-left">
        <button className="start-btn" onClick={onStartClick} title="Start Menu" style={{ color: 'var(--accent-light)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.5 1.5H10.8V10.8H1.5V1.5Z" fill="currentColor"/>
            <path d="M13.2 1.5H22.5V10.8H13.2V1.5Z" fill="currentColor"/>
            <path d="M1.5 13.2H10.8V22.5H1.5V13.2Z" fill="currentColor"/>
            <path d="M13.2 13.2H22.5V22.5H13.2V13.2Z" fill="currentColor"/>
          </svg>
        </button>

        <button className="start-btn taskbar-overview-btn" onClick={onToggleOverview} title="Windows Overview (Quick View)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        </button>

        <button
          className="taskbar-scroll-arrow taskbar-scroll-arrow-left"
          type="button"
          aria-label="Scroll taskbar left"
          title="Scroll left"
          onClick={() => {
            const el = document.querySelector('.taskbar-items-container');
            if (el) el.scrollBy({ left: -260, behavior: 'smooth' });
          }}
        >
          ◀
        </button>

        <div className="taskbar-items-container" ref={taskbarItemsRef}>
          {windows.map((win) => {
            const isActive = win.id === activeWindowId && !win.minimized;
            return (
              <div
                key={win.id}
                className={`taskbar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleItemClick(win)}
                title={win.title}
              >
                <div className="taskbar-window-icon">{win.icon || '📁'}</div>
                <span className="taskbar-text">{win.title}</span>
                <div className="taskbar-item-indicator" />
              </div>
            );
          })}
        </div>

        <button
          className="taskbar-scroll-arrow taskbar-scroll-arrow-right"
          type="button"
          aria-label="Scroll taskbar right"
          title="Scroll right"
          onClick={() => {
            const el = document.querySelector('.taskbar-items-container');
            if (el) el.scrollBy({ left: 260, behavior: 'smooth' });
          }}
        >
          ▶
        </button>

      </div>

      <div className="taskbar-right">
        <div className="system-tray-widgets mobile-hide-taskbar">
          <div className="system-clock">
            <span className="system-clock-time">{formattedTime}</span>
            <span className="system-clock-date">{formattedDate}</span>
          </div>
        </div>


        <button className="notif-bell-btn" onClick={onToggleNotifications} title="System Notifications">
          🔔
          {unreadNotifCount > 0 && (
            <span className="notif-badge">{unreadNotifCount}</span>
          )}
        </button>

        <button title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} onClick={onToggleFullscreen} className="fullscreen-toggle-btn mobile-hide-taskbar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">

            {isFullscreen ? (
              <path d="M4 14h6v6m0-6L3 21m17-7h-6v6m0-6l7 7M4 10h6V4m0 6L3 3m17 7h-6V4m0 6l7-7" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            )}
          </svg>
        </button>

        <div ref={winMenuRef} className="win-menu-container mobile-hide-taskbar">

          <button className={`win-menu-trigger ${showWinMenu ? 'active' : ''}`} onClick={() => setShowWinMenu(v => !v)} title="Window Management">
            ⧓
          </button>

          {showWinMenu && (
            <div className="win-menu-popup">
              {[
                { label: '✕  Close All Windows', icon: '✕', action: onCloseAll, danger: true },
                { label: 'Minimize All', icon: '−', action: onMinimizeAll },
                { label: 'Maximize All', icon: '□', action: onMaximizeAll },
                { label: 'Tile Windows Side-by-Side', icon: '⧓', action: onTileAll },
              ].map((item, i) => (
                <button key={i} onClick={() => runWinAction(item.action)} className={`win-menu-item ${item.danger ? 'danger' : ''}`}>
                  <span>{item.icon}</span>
                  <span>{item.label.replace(item.icon, '').trim()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="profile-avatar-btn" onClick={onProfileClick} title={`Profile: ${user.name}`}>
          {user.avatarText || user.name.slice(0, 2).toUpperCase()}
        </button>

        <button className={`show-desktop-btn ${showDesktopActive ? 'active' : ''}`} onClick={onToggleShowDesktop} title={showDesktopActive ? 'Restore Windows' : 'Show Desktop'} />
      </div>
    </div>
  );
}