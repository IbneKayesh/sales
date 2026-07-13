import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DesktopContext = createContext();

export const wallpapers = [
  { id: 'default', name: 'Default Landscape', value: "url('/src/assets/wallpaper.png')" },
  { id: 'cosmic', name: 'Cosmic Aurora', value: 'linear-gradient(135deg, #0d0f19 0%, #1e1b4b 50%, #311042 100%)' },
  { id: 'deepspace', name: 'Deep Space', value: 'linear-gradient(135deg, #081121 0%, #0c2340 50%, #1d4ed8 100%)' },
  { id: 'emerald', name: 'Emerald Forest', value: 'linear-gradient(135deg, #02231c 0%, #064e3b 50%, #0f766e 100%)' },
  { id: 'crimson', name: 'Crimson Twilight', value: 'linear-gradient(135deg, #2b0b14 0%, #581c2f 50%, #b91c1c 100%)' },
];

const DEFAULT_APP_IDS = ['files', 'gallery', 'settings', 'documents', 'trash', 'sales'];

const getDefaultPositions = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const x = Math.max(60, width - 100);
  return {
    files:     { x, y: 20 },
    gallery:   { x, y: 120 },
    settings:  { x, y: 220 },
    documents: { x, y: 320 },
    trash:     { x, y: 420 },
    sales:     { x, y: 520 },
  };
};

// Per-user localStorage key helpers
const key = (userId, suffix) => `desktopData_${userId}_${suffix}`;

const readLS = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const writeLS = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
};

export const DesktopProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? 'guest';

  // ── Wallpaper ─────────────────────────────────────────────────────────
  const [activeWallpaper, setActiveWallpaperState] = useState(() =>
    readLS(key(userId, 'wallpaper'), 'default')
  );

  // ── Prefs ──────────────────────────────────────────────────────────────
  const [showIcons, setShowIconsState] = useState(() =>
    readLS(key(userId, 'showIcons'), true)
  );
  const [showRecentApps, setShowRecentAppsState] = useState(() =>
    readLS(key(userId, 'showRecentApps'), true)
  );

  // ── Recent apps ────────────────────────────────────────────────────────
  const [recentApps, setRecentApps] = useState(() =>
    readLS(key(userId, 'recentApps'), [])
  );

  // ── Positions ──────────────────────────────────────────────────────────
  const [positions, setPositions] = useState(() =>
    readLS(key(userId, 'positions'), getDefaultPositions())
  );

  // When the logged-in user changes, reload all their desktop data
  useEffect(() => {
    const uid = currentUser?.id ?? 'guest';
    setActiveWallpaperState(readLS(key(uid, 'wallpaper'), 'default'));
    setShowIconsState(readLS(key(uid, 'showIcons'), true));
    setShowRecentAppsState(readLS(key(uid, 'showRecentApps'), true));
    setRecentApps(readLS(key(uid, 'recentApps'), []));
    setPositions(readLS(key(uid, 'positions'), getDefaultPositions()));
  }, [currentUser?.id]);

  // Persist each piece to the per-user key whenever it changes
  useEffect(() => {
    writeLS(key(userId, 'wallpaper'), activeWallpaper);
    const wp = wallpapers.find((w) => w.id === activeWallpaper) || wallpapers[0];
    document.documentElement.style.setProperty('--desktop-wallpaper', wp.value);
  }, [activeWallpaper, userId]);

  useEffect(() => { writeLS(key(userId, 'showIcons'), showIcons); }, [showIcons, userId]);
  useEffect(() => { writeLS(key(userId, 'showRecentApps'), showRecentApps); }, [showRecentApps, userId]);
  useEffect(() => { writeLS(key(userId, 'recentApps'), recentApps); }, [recentApps, userId]);
  useEffect(() => { writeLS(key(userId, 'positions'), positions); }, [positions, userId]);

  // Resize clamping
  useEffect(() => {
    const handleResize = () => {
      setPositions((prev) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        let changed = false;
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          const pos = { ...updated[id] };
          if (pos.x > w - 80) { pos.x = w - 100; changed = true; }
          if (pos.y > h - 80) { pos.y = Math.max(20, h - 100); changed = true; }
          if (changed) updated[id] = pos;
        });
        return changed ? updated : prev;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wrapped setters that also persist
  const setActiveWallpaper = useCallback((id) => setActiveWallpaperState(id), []);
  const setShowIcons = useCallback((v) => setShowIconsState(v), []);
  const setShowRecentApps = useCallback((v) => setShowRecentAppsState(v), []);

  const addRecentApp = useCallback((appId) => {
    setRecentApps((prev) => {
      if (prev.includes(appId)) return prev;
      const updated = [...prev, appId];
      setPositions((prevPos) => {
        if (prevPos[appId]) return prevPos;
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        return {
          ...prevPos,
          [appId]: { x: Math.max(60, w - 200), y: 20 + updated.length * 100 },
        };
      });
      return updated;
    });
  }, []);

  const removeRecentApp = useCallback((appId) => {
    setRecentApps((prev) => prev.filter((id) => id !== appId));
    setPositions((prev) => {
      const updated = { ...prev };
      delete updated[appId];
      return updated;
    });
  }, []);

  const clearRecentApps = useCallback(() => {
    setRecentApps([]);
    setPositions((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (!DEFAULT_APP_IDS.includes(k)) delete updated[k];
      });
      return updated;
    });
  }, []);

  const updatePosition = useCallback((id, pos) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }, []);

  const resetPositions = useCallback(() => setPositions(getDefaultPositions()), []);

  const resetLayout = useCallback(() => {
    setActiveWallpaperState('default');
    setShowIconsState(true);
    setShowRecentAppsState(true);
    setRecentApps([]);
    setPositions(getDefaultPositions());
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        wallpapers,
        activeWallpaper,
        setActiveWallpaper,
        showIcons,
        setShowIcons,
        showRecentApps,
        setShowRecentApps,
        recentApps,
        addRecentApp,
        removeRecentApp,
        clearRecentApps,
        positions,
        updatePosition,
        resetPositions,
        resetLayout,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error('useDesktop must be used within a DesktopProvider');
  return ctx;
};
