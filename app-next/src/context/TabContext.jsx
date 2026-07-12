import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pageTitles } from '../config/routes';

const TabContext = createContext(null);

// Tab icons mapped by path
const TAB_ICONS = {
  '/': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  '/sales': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  '/purchase': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  '/inventory': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>',
  '/reports': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
};

export function TabProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(() => {
    // Initialize with Dashboard tab always open
    return [{
      id: '/',
      path: '/',
      label: pageTitles['/'] || 'Dashboard',
      icon: TAB_ICONS['/'],
      closable: false,
    }];
  });

  // Active tab = current route
  const activeTab = location.pathname;

  // When route changes, ensure a tab exists for it
  useEffect(() => {
    const path = location.pathname;
    // Don't add tabs for login or other non-app routes
    if (path === '/login' || !pageTitles[path]) return;

    setTabs(prev => {
      const exists = prev.some(t => t.path === path);
      if (exists) return prev;
      return [...prev, {
        id: path,
        path,
        label: pageTitles[path] || path,
        icon: TAB_ICONS[path] || '',
        closable: path !== '/',
      }];
    });
  }, [location.pathname]);

  const closeTab = useCallback((path) => {
    // Can't close Dashboard
    if (path === '/') return;

    setTabs(prev => {
      const idx = prev.findIndex(t => t.path === path);
      if (idx === -1) return prev;

      const newTabs = prev.filter(t => t.path !== path);

      // If the closed tab was active, navigate to the next available tab
      if (activeTab === path) {
        // Try next tab, then previous tab
        const nextTab = newTabs[Math.min(idx, newTabs.length - 1)];
        if (nextTab) {
          navigate(nextTab.path);
        }
      }

      return newTabs;
    });
  }, [activeTab, navigate]);

  const closeOtherTabs = useCallback((exceptPath) => {
    setTabs(prev => {
      const keep = prev.filter(t => t.path === exceptPath || t.path === '/');
      return keep;
    });
    navigate(exceptPath);
  }, [navigate]);

  const closeAllTabs = useCallback(() => {
    setTabs([{
      id: '/',
      path: '/',
      label: pageTitles['/'] || 'Dashboard',
      icon: TAB_ICONS['/'],
      closable: false,
    }]);
    navigate('/');
  }, [navigate]);

  const value = useMemo(() => ({
    tabs,
    activeTab,
    closeTab,
    closeOtherTabs,
    closeAllTabs,
  }), [tabs, activeTab, closeTab, closeOtherTabs, closeAllTabs]);

  return (
    <TabContext.Provider value={value}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabs must be used within a TabProvider');
  return ctx;
}
