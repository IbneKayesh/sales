import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_ROUTES, appConfigById } from "@/routes/appConfig";

const WindowManagerContext = createContext();

// ── Generate initial window states from appConfig ────────────────────────
const initialWindowsList = APP_ROUTES.map((route) => {
  const win = route.defaultWindow || { width: 700, height: 500, x: 100, y: 60 };
  return {
    id: route.id,
    title: route.title,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: win.x,
    y: win.y,
    width: win.width,
    height: win.height,
    zIndex: 10,
  };
});

export const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState(initialWindowsList);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [recents, setRecents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve the route URL from appConfig, fallback to /id
  const resolveUrl = useCallback((id) => {
    const route = appConfigById[id];
    return route?.url || `/${id}`;
  }, []);

  const addToRecents = useCallback((id) => {
    setRecents((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const openWindow = (id) => {
    addToRecents(id);
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id
          ? { ...win, isOpen: true, isMinimized: false, zIndex: nextZ }
          : win,
      ),
    );
    setActiveWindowId(id);
    setTimeout(() => navigate(resolveUrl(id)), 0);
  };

  const closeWindow = (id) => {
    setWindows((prev) => {
      const updated = prev.map((win) =>
        win.id === id ? { ...win, isOpen: false } : win,
      );
      const openRemaining = updated.filter(
        (win) => win.isOpen && !win.isMinimized,
      );

      if (openRemaining.length > 0) {
        const sorted = [...openRemaining].sort((a, b) => b.zIndex - a.zIndex);
        const nextActiveId = sorted[0].id;
        setActiveWindowId(nextActiveId);
        setTimeout(() => navigate(resolveUrl(nextActiveId)), 0);
      } else {
        setActiveWindowId(null);
        setTimeout(() => navigate("/"), 0);
      }

      return updated;
    });
  };

  const minimizeWindow = (id) => {
    setWindows((prev) => {
      const updated = prev.map((win) =>
        win.id === id ? { ...win, isMinimized: true } : win,
      );
      const openRemaining = updated.filter(
        (win) => win.isOpen && !win.isMinimized,
      );

      if (openRemaining.length > 0) {
        const sorted = [...openRemaining].sort((a, b) => b.zIndex - a.zIndex);
        const nextActiveId = sorted[0].id;
        setActiveWindowId(nextActiveId);
        setTimeout(() => navigate(resolveUrl(nextActiveId)), 0);
      } else {
        setActiveWindowId(null);
        setTimeout(() => navigate("/"), 0);
      }

      return updated;
    });
  };

  const restoreWindow = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, isMinimized: false, zIndex: nextZ } : win,
      ),
    );
    setActiveWindowId(id);
    setTimeout(() => navigate(resolveUrl(id)), 0);
  };

  const focusWindow = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, zIndex: nextZ } : win)),
    );
    setActiveWindowId(id);
    setTimeout(() => navigate(resolveUrl(id)), 0);
  };

  const toggleMaximize = (id) => {
    setWindows((prev) =>
      prev.map((win) =>
        win.id === id ? { ...win, isMaximized: !win.isMaximized } : win,
      ),
    );
  };

  const updateWindowPosition = (id, x, y) => {
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, x, y } : win)),
    );
  };

  useEffect(() => {
    const path = location.pathname.substring(1);
    if (path && appConfigById[path]) {
      addToRecents(path);
      setMaxZIndex((currentZ) => {
        const nextZ = currentZ + 1;
        setWindows((prev) => {
          const matched = prev.find((w) => w.id === path);
          if (matched && (!matched.isOpen || matched.isMinimized)) {
            setActiveWindowId(path);
            return prev.map((win) =>
              win.id === path
                ? { ...win, isOpen: true, isMinimized: false, zIndex: nextZ }
                : win,
            );
          }
          return prev;
        });
        return nextZ;
      });
    }
  }, [location.pathname, addToRecents]);

  const closeAllWindows = useCallback(() => {
    setWindows((prev) => prev.map((win) => ({ ...win, isOpen: false, isMinimized: false })));
    setActiveWindowId(null);
    setMaxZIndex(10);
    setTimeout(() => navigate('/'), 0);
  }, [navigate]);

  const minimizeAllWindows = useCallback(() => {
    setWindows((prev) => {
      const updated = prev.map((win) =>
        win.isOpen ? { ...win, isMinimized: true } : win
      );
      setActiveWindowId(null);
      setTimeout(() => navigate('/'), 0);
      return updated;
    });
  }, [navigate]);

  const restoreAllWindows = useCallback(() => {
    setWindows((prev) => {
      const hasMinimized = prev.some((w) => w.isMinimized);
      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);
      const updated = prev.map((win) =>
        win.isOpen && win.isMinimized
          ? { ...win, isMinimized: false, zIndex: nextZ }
          : win
      );
      const openWindows = updated.filter((w) => w.isOpen && !w.isMinimized);
      if (openWindows.length > 0) {
        const sorted = [...openWindows].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
        setTimeout(() => navigate(resolveUrl(sorted[0].id)), 0);
      }
      return updated;
    });
  }, [maxZIndex, navigate]);

  const resetWindows = () => {
    setWindows(initialWindowsList);
    setActiveWindowId(null);
    setMaxZIndex(10);
    setRecents([]);
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        recents,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        toggleMaximize,
        updateWindowPosition,
        closeAllWindows,
        minimizeAllWindows,
        restoreAllWindows,
        resetWindows,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within a WindowManagerProvider",
    );
  }
  return context;
};
