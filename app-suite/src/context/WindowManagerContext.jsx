import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WindowManagerContext = createContext();

const initialWindowsList = [
  {
    id: "home",
    title: "Home",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 80,
    y: 60,
    width: 800,
    height: 540,
    zIndex: 10,
  },
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
  {
    id: "sales.orders",
    title: "Orders",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 120,
    y: 70,
    width: 800,
    height: 500,
    zIndex: 10,
  },
  {
    id: "sales.invoices",
    title: "Invoices",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 140,
    y: 80,
    width: 800,
    height: 500,
    zIndex: 10,
  },
  {
    id: "sales.delivery",
    title: "Delivery",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 160,
    y: 90,
    width: 720,
    height: 520,
    zIndex: 10,
  },
  {
    id: "sales.reports",
    title: "Reports",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 180,
    y: 100,
    width: 740,
    height: 480,
    zIndex: 10,
  },
  {
    id: "purchase",
    title: "Purchase",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 100,
    y: 80,
    width: 800,
    height: 500,
    zIndex: 10,
  },
  {
    id: "hr",
    title: "HR",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 140,
    y: 100,
    width: 780,
    height: 480,
    zIndex: 10,
  },
  {
    id: "crm",
    title: "CRM",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 180,
    y: 120,
    width: 820,
    height: 520,
    zIndex: 10,
  },
  {
    id: "inventory",
    title: "Inventory",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 120,
    y: 60,
    width: 800,
    height: 520,
    zIndex: 10,
  },
  {
    id: "profile",
    title: "Profile Settings",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 140,
    y: 80,
    width: 720,
    height: 540,
    zIndex: 10,
  },
  {
    id: "notifications",
    title: "Notifications",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    x: 120,
    y: 70,
    width: 700,
    height: 520,
    zIndex: 10,
  },
];

export const WindowManagerProvider = ({ children }) => {
  const [windows, setWindows] = useState(initialWindowsList);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [recents, setRecents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

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
      // Focus the topmost restored window
      const openWindows = updated.filter((w) => w.isOpen && !w.isMinimized);
      if (openWindows.length > 0) {
        const sorted = [...openWindows].sort((a, b) => b.zIndex - a.zIndex);
        setActiveWindowId(sorted[0].id);
        setTimeout(() => navigate(`/${sorted[0].id}`), 0);
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
