import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WindowManagerContext = createContext();

const initialWindowsList = [
  {
    id: "files",
    title: "Finder",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 80,
    y: 80,
    width: 750,
    height: 480,
    zIndex: 10,
  },
  {
    id: "gallery",
    title: "System Gallery",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 140,
    y: 120,
    width: 800,
    height: 500,
    zIndex: 10,
  },
  {
    id: "settings",
    title: "System Settings",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 200,
    y: 60,
    width: 680,
    height: 460,
    zIndex: 10,
  },
  {
    id: "documents",
    title: "Documents",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 260,
    y: 150,
    width: 600,
    height: 400,
    zIndex: 10,
  },
  {
    id: "trash",
    title: "Trash",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 320,
    y: 180,
    width: 500,
    height: 350,
    zIndex: 10,
  },
  {
    id: "sales",
    title: "Sales",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 100,
    y: 60,
    width: 860,
    height: 540,
    zIndex: 10,
  },
];

export const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState(initialWindowsList);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();

  const openWindow = (id) => {
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
    setTimeout(() => navigate(`/${id}`), 0);
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
        setTimeout(() => navigate(`/${nextActiveId}`), 0);
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
        setTimeout(() => navigate(`/${nextActiveId}`), 0);
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
    setTimeout(() => navigate(`/${id}`), 0);
  };

  const focusWindow = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows((prev) =>
      prev.map((win) => (win.id === id ? { ...win, zIndex: nextZ } : win)),
    );
    setActiveWindowId(id);
    setTimeout(() => navigate(`/${id}`), 0);
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
    if (path && initialWindowsList.some((w) => w.id === path)) {
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
  }, [location.pathname]);

  const resetWindows = () => {
    setWindows(initialWindowsList);
    setActiveWindowId(null);
    setMaxZIndex(10);
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        toggleMaximize,
        updateWindowPosition,
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
