import { useState, useEffect, useRef, useCallback } from 'react';

import { NavLink } from 'react-router-dom';
import { getNavBarApps } from '@/routes/appConfig';
import './RunningApps.css';
const RunningApps = () => {
  const apps = getNavBarApps();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setMenuOpen(false), []);

  const toggle = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  // Close on Escape or click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { close(); triggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuOpen, close]);

  return (
    <div className="wrapper" ref={containerRef}>
      {/* Desktop nav — visible on wide screens */}
      <nav className="nav" aria-label="Running Applications">
        {apps.map((app) => (
          <NavLink
            key={app.id}
            to={app.url}
            className={({ isActive }) =>
              `appItem ${isActive ? 'appItemActive' : ''}`
            }
            end={app.url === '/'}
          >
            <span className="indicator" />
            <span className="appName">{app.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile toggle button */}
      <button
        ref={triggerRef}
        className={`toggleBtn ${menuOpen ? 'toggleBtnOpen' : ''}`}
        onClick={toggle}
        aria-label="Toggle navigation apps"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="dropdown" role="menu" aria-label="Navigation apps">
          {apps.map((app) => (
            <NavLink
              key={app.id}
              to={app.url}
              className={({ isActive }) =>
                `dropdownItem ${isActive ? 'dropdownItemActive' : ''}`
              }
              end={app.url === '/'}
              onClick={close}
            >
              <span className="dropdownIndicator" />
              <span className="dropdownLabel">{app.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default RunningApps;
