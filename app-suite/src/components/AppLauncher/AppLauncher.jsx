import { useEffect, useRef, useState, useCallback } from 'react';

import { useWindowManager } from '@/context/WindowManagerContext';
import { useAuth } from '@/context/AuthContext';
import { APP_ROUTES, appConfigById, getLauncherApps, getChildApps, getAppIcon } from '@/routes/appConfig';
import { IconBackArrow, IconSearch, IconSearch as IconSearchX, IconLogout } from '@/assets/icons';
import './AppLauncher.css';
// ── Map category to launcher card style ───────────────────────────────────
const getCardStyle = (route) => {
  const map = {
    dashboard: 'cardHome',
    system: {
      files: 'cardFiles',
      gallery: 'cardGallery',
      settings: 'cardSettings',
      documents: 'cardDocuments',
      trash: 'cardTrash',
    },
    sales: 'cardSales',
    modules: {
      inventory: 'cardInventory',
      purchase: 'cardPurchase',
      hr: 'cardHR',
      crm: 'cardCRM',
    },
    user: {
      profile: 'cardProfile',
      notifications: 'cardNotifications',
    },
  };

  const entry = route.parentId ? map[appConfigById[route.parentId]?.category] : map[route.category];
  if (typeof entry === 'string') return entry || 'cardDefault';
  if (entry && typeof entry === 'object') return entry[route.id] || 'cardDefault';
  return 'cardDefault';
};

// ── AppLauncher Component ──────────────────────────────────────────────────
const AppLauncher = ({ isOpen, closeLauncher }) => {
  const { openWindow } = useWindowManager();
  const { logout } = useAuth();
  const launcherRef = useRef(null);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get top-level launcher items
  const launcherApps = getLauncherApps().filter((r) => r.parentId === null);

  // Build items with children for sub-views
  const appItems = launcherApps.map((app) => {
    const children = getChildApps(app.id).filter((child) => child.showInLauncher);
    const Icon = getAppIcon(app.id);
    return {
      ...app,
      icon: Icon ? <Icon /> : null,
      children: children.length > 0 ? children.map((child) => {
        const ChildIcon = getAppIcon(child.id);
        return {
          ...child,
          icon: ChildIcon ? <ChildIcon /> : null,
        };
      }) : undefined,
    };
  });

  // Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setActiveGroupId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeGroupId) {
          setActiveGroupId(null);
        } else {
          closeLauncher();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLauncher, activeGroupId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target)) {
        if (!e.target.closest('[aria-label="Open App Launcher"]')) {
          closeLauncher();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeLauncher]);

  const handleLaunch = useCallback((id) => {
    openWindow(id);
    closeLauncher();
  }, [openWindow, closeLauncher]);

  const openGroup = useCallback((id) => {
    setActiveGroupId(id);
  }, []);

  const goBack = useCallback(() => {
    setActiveGroupId(null);
  }, []);

  // Find the active group
  const activeGroup = activeGroupId ? appItems.find((a) => a.id === activeGroupId) : null;
  const isInSubView = !!activeGroup;

  // ── Filter items based on search ──────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const displayedItems = (() => {
    const source = isInSubView ? activeGroup.children || [] : appItems;
    if (!q) return source;
    return source.filter((item) => {
      const matches = item.label.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      if (!isInSubView && item.children) {
        return matches || item.children.some(
          (c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
      }
      return matches;
    });
  })();

  return (
    <div className="overlay">
      <div className="launcher" ref={launcherRef} role="dialog" aria-modal="true" aria-label="Application Launcher">
        {/* ── Header with back button ──────────────────────────────────── */}
        <div className="header">
          {isInSubView && (
            <button className="backBtn" onClick={goBack} aria-label="Back to all apps">
              <IconBackArrow className="backIcon" />
            </button>
          )}
          <div className="headerInfo">
            <h2 className="headerTitle">
              {isInSubView ? activeGroup.label : 'Apps'}
            </h2>
            <span className="headerCount">
              {displayedItems.length} {displayedItems.length === 1 ? 'app' : 'apps'}
            </span>
          </div>
          <div className="searchContainer">
            <IconSearch className="searchIcon" />
            <input
              type="text"
              placeholder="Search..."
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* ── Icon Grid ────────────────────────────────────────────────── */}
        <div className="iconGrid">
          {displayedItems.length === 0 ? (
            <div className="emptyState">
              <IconSearchX className="emptyIcon" />
              <p>No apps found</p>
            </div>
          ) : (
            displayedItems.map((item) => {
              const isGroup = !isInSubView && item.children;
              return (
                <button
                  key={item.id}
                  className={`iconCard ${item.classStyle || getCardStyle(item) || 'cardDefault'}`}
                  onClick={() => (isGroup ? openGroup(item.id) : handleLaunch(item.id))}
                  title={item.description}
                >
                  <div className="iconCircle">
                    {item.icon}
                  </div>
                  <span className="iconLabel">{item.label}</span>
                  {isGroup && item.children && (
                    <span className="childCountBadge">{item.children.length}</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="footer">
          <span className="footerHint">
            Press <kbd className="kbd">Esc</kbd> to {isInSubView ? 'go back' : 'close'}
          </span>
          <div className="footerRight">
            {isInSubView && (
              <button className="footerBackBtn" onClick={goBack}>
                <IconBackArrow className="backIcon" />
                Back
              </button>
            )}
            <button className="logoutBtn" onClick={logout} title="End session">
              <IconLogout className="logoutIcon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
