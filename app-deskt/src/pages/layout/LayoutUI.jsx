import { useState, useEffect } from "react";
import "./LayoutUI.css";
import TaskbarUI from "./TaskbarUI";
import DesktopUI from "./DesktopUI";
import AppSuiteUI from "./AppSuiteUI";
import FormsUI from "./FormsUI";
import TaskViewFlyout from "./taskbar/TaskViewFlyout";
import WindowFlyout from "./taskbar/WindowFlyout";
import ProfileFlyout from "./taskbar/ProfileFlyout";
import NotificationFlyout from "./taskbar/NotificationFlyout";
import { getStorageLoginData, setStorageLoginData } from "@/utils/storage";

const setupDesktopFormItem = {
  id: "setup-desktop",
  name: "Setup Desktop",
  icon: "desktop.png",
  forms: "SetupDesktopPage",
  module: "system-setup-desktop",
  size: "small",
  actions: [],
  leftbar: [],
  path: "System > Setup > Desktop",
  parent: "none",
};

const profileFormItem = {
  id: "profile-user",
  name: "User Profile",
  icon: "👤",
  forms: "ProfilePage",
  module: "profile",
  size: "small",
};

const notificationFormItem = {
  id: "notifications-all",
  name: "Notifications",
  icon: "🔔",
  forms: "NotificationPage",
  module: "notifications",
  size: "medium",
};

const initialNotifications = [
  {
    id: "notif-sales-approval",
    type: "info",
    title: "Approval waiting",
    message: "Sales invoice INV-1010 is waiting for approval.",
    isRead: false,
  },
  {
    id: "notif-stock-ready",
    type: "success",
    title: "Stock updated",
    message: "Thermal Roll stock was posted successfully.",
    isRead: false,
  },
  {
    id: "notif-low-stock",
    type: "error",
    title: "Low stock",
    message: "A4 Paper Box is below reorder level.",
    isRead: false,
  },
];

const LayoutUI = () => {
  const [showAppSuite, setShowAppSuite] = useState(false);
  const [showTaskViewFlyout, setShowTaskViewFlyout] = useState(false);
  const [showProfileFlyout, setShowProfileFlyout] = useState(false);
  const [showWindowFlyout, setShowWindowFlyout] = useState(false);
  const [showNotificationFlyout, setShowNotificationFlyout] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [notifUnreadCount, setNotifUnreadCount] = useState(5);
  const [windowList, setWindowList] = useState([]);
  const [recentForms, setRecentForms] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [desktopBackground, setDesktopBackground] = useState(null);
  const [topbarBackground, setTopbarBackground] =
    useState("var(--win11-panel)");
  const [zSeed, setZSeed] = useState(40);

  const nextZIndex = () => {
    const next = zSeed + 1;
    setZSeed(next);
    return 100 + next;
  };

  // Sync isFullscreen state with browser fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  // Load saved topbar background from localStorage
  useEffect(() => {
    const savedTopbar = localStorage.getItem("topbarBackground");
    if (savedTopbar) {
      setTopbarBackground(savedTopbar);
    }
  }, []);

  //load desktop icons, background from localStorage on mount
  useEffect(() => {
    const loginData = getStorageLoginData();
    if (loginData.desktop && loginData.desktop.icons) {
      setRecentForms(loginData.desktop.icons);
    } else {
      setRecentForms([]);
    }
    if (loginData.desktop && loginData.desktop.wallpaper) {
      setDesktopBackground(loginData.desktop.wallpaper);
    } else {
      setDesktopBackground("#33424e");
    }
  }, []);

  const handleSetDesktopBackground = (target, preset) => {
    console.log("Selected target:", target);
    console.log("Selected preset:", preset.value);

    if (target === "background") {
      setDesktopBackground(preset.value);
      setStorageLoginData({
        desktop: {
          ...getStorageLoginData().desktop,
          wallpaper: preset.value,
        },
      });
    } else if (target === "widget") {
    }
  };

  const handleAppSuiteToggle = () => {
    setShowAppSuite((value) => !value);
  };
  const handleShowTaskViewFlyout = () => {
    setShowTaskViewFlyout((value) => !value);
  };
  const handleProfileFlyout = () => {
    setShowProfileFlyout((value) => !value);
  };
  const handleNotificationFlyout = () => {
    setShowNotificationFlyout((value) => !value);
  };
  const handleShowWindowFlyout = () => {
    setShowWindowFlyout((value) => !value);
  };
  const handleShowDesktop = () => {
    handleMinimizeAll();
  };

  const handleOpenProfile = () => {
    handleOpenPageClick(profileFormItem);
    setShowProfileFlyout(false);
  };

  const handleSignOut = () => {
    // Reset app state and redirect to login
    setWindowList([]);
    setRecentForms([]);
    setShowProfileFlyout(false);
    // In a real app, this would clear auth tokens and navigate to /login
    window.location.href = "/login";
  };

  const handleRefreshDesktop = () => {
    // Refresh: close all flyouts and refresh the view
    setShowAppSuite(false);
    setShowTaskViewFlyout(false);
    setShowProfileFlyout(false);
    setShowWindowFlyout(false);
    setShowNotificationFlyout(false);
    // Trigger a page reload or state update
    window.location.reload();
  };

  const handleResetDesktop = () => {
    // Reset: clear all open windows and recent forms
    if (
      confirm(
        "Are you sure you want to reset the desktop? This will close all open windows.",
      )
    ) {
      setWindowList([]);
      setRecentForms([]);
      setShowAppSuite(false);
      setShowTaskViewFlyout(false);
      setShowProfileFlyout(false);
      setShowWindowFlyout(false);
      setShowNotificationFlyout(false);
      setDesktopBackground(defaultDesktopBackground);
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullScreen(true))
        .catch((err) => console.error("Error entering fullscreen:", err));
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullScreen(false))
          .catch((err) => console.error("Error exiting fullscreen:", err));
      }
    }
  };

  const handleOpenPageClick = (formItem) => {
    const zIndex = nextZIndex();
    setWindowList((prev) => {
      const exists = prev.some((item) => item.id === formItem.id);

      if (exists) {
        return prev.map((item) =>
          item.id === formItem.id
            ? { ...item, isMinimized: false, layout: null, zIndex }
            : item,
        );
      }

      return [
        ...prev,
        {
          ...formItem,
          isMinimized: false,
          isMaximized: formItem.size === "full",
          layout: null,
          zIndex,
        },
      ];
    });
    // setRecentForms((prev) =>
    //   [formItem, ...prev.filter((item) => item.id !== formItem.id)].slice(0, 20),
    // );

    setRecentForms((prev) => {
      const withoutCurrent = prev.filter((item) => item.id !== formItem.id);
      const updated = [formItem, ...withoutCurrent];

      setStorageLoginData({
        desktop: {
          ...getStorageLoginData().desktop,
          icons: updated.slice(0, 20),
        },
      });
      return updated.slice(0, 20);
    });

    setShowAppSuite(false);
  };

  const handleCloseFormClick = (formItem) => {
    setWindowList((prev) => prev.filter((item) => item.id !== formItem.id));
  };

  const handleMinimizeFormClick = (formItem) => {
    setWindowList((prev) =>
      prev.map((item) =>
        item.id === formItem.id ? { ...item, isMinimized: true } : item,
      ),
    );
  };

  const handleRestoreFormClick = (formItem) => {
    const zIndex = nextZIndex();
    setWindowList((prev) =>
      prev.map((item) =>
        item.id === formItem.id
          ? { ...item, isMinimized: false, layout: null, zIndex }
          : item,
      ),
    );
    setShowWindowFlyout(false);
    setShowTaskViewFlyout(false);
  };

  const handleFocusFormClick = (formItem) => {
    const zIndex = nextZIndex();
    setWindowList((prev) =>
      prev.map((item) =>
        item.id === formItem.id ? { ...item, zIndex } : item,
      ),
    );
  };

  const handleToggleMaximizeFormClick = (formItem) => {
    setWindowList((prev) =>
      prev.map((item) =>
        item.id === formItem.id
          ? {
              ...item,
              isMaximized: !item.isMaximized,
              isMinimized: false,
              layout: null,
            }
          : item,
      ),
    );
  };

  const handleMinimizeAll = () => {
    setWindowList((prev) =>
      prev.map((item) => ({ ...item, isMinimized: true })),
    );
  };

  const handleMaximizeAll = () => {
    const baseZ = nextZIndex();
    setWindowList((prev) =>
      prev.map((item, index) => ({
        ...item,
        isMaximized: true,
        isMinimized: false,
        layout: null,
        zIndex: baseZ + index,
      })),
    );
  };

  const handleCloseAll = () => {
    setWindowList([]);
    setShowWindowFlyout(false);
  };

  const handleTileWindows = () => {
    const visible = windowList.filter((item) => !item.isMinimized);
    const targets = visible.length ? visible : windowList;
    const total = targets.length;

    if (total <= 1) {
      setWindowList((prev) =>
        prev.map((item) =>
          targets.some((t) => t.id === item.id)
            ? { ...item, isMinimized: false, isMaximized: false, layout: null }
            : item,
        ),
      );
      setShowWindowFlyout(false);
      return;
    }

    // Windows 11-style tiling: arrange windows in a grid
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);

    setWindowList((prev) =>
      prev.map((item) => {
        const index = targets.findIndex((target) => target.id === item.id);
        if (index === -1) return item;

        const tileCol = index % cols;
        const tileRow = Math.floor(index / cols);

        return {
          ...item,
          isMinimized: false,
          isMaximized: false,
          layout: "tile",
          tileCol,
          tileRow,
          tileCols: cols,
          tileRows: rows,
          zIndex: 150 + index,
        };
      }),
    );

    setShowWindowFlyout(false);
  };

  const handleDockFormClick = (formItem, side) => {
    const zIndex = nextZIndex();
    setWindowList((prev) =>
      prev.map((item) =>
        item.id === formItem.id
          ? {
              ...item,
              isMaximized: false,
              isMinimized: false,
              layout: side === "left" ? "dock-left" : "dock-right",
              zIndex,
            }
          : item,
      ),
    );
  };

  const handleReadNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  useEffect(() => {
    setNotifUnreadCount(
      notifications.filter((notification) => !notification.isRead).length,
    );
  }, [notifications]);

  return (
    <div className="layoutRoot win11-root">
      <div className="desktopLayer">
        <DesktopUI
          recentForms={recentForms}
          onRestore={handleOpenPageClick}
          onOpenSetup={() => handleOpenPageClick(setupDesktopFormItem)}
          desktopBackground={desktopBackground}
          onRefreshDesktop={handleRefreshDesktop}
          onResetDesktop={handleResetDesktop}
        />
      </div>

      <div className="taskbarLayer">
        <TaskbarUI
          onAppSuiteToggle={handleAppSuiteToggle}
          onShowTaskViewFlyout={handleShowTaskViewFlyout}
          onProfileFlyout={handleProfileFlyout}
          onNotificationFlyout={handleNotificationFlyout}
          notifUnreadCount={notifUnreadCount}
          onShowWindowFlyout={handleShowWindowFlyout}
          onShowDesktop={handleShowDesktop}
          onFullScreen={handleFullScreen}
          isFullScreen={isFullScreen}
          windows={windowList}
          onRestoreWindow={handleRestoreFormClick}
        />
      </div>
      {showAppSuite && (
        <div className="modalLayer" onMouseDown={() => setShowAppSuite(false)}>
          <div onMouseDown={(event) => event.stopPropagation()}>
            <AppSuiteUI onOpenPageClick={handleOpenPageClick} />
          </div>
        </div>
      )}
      {showTaskViewFlyout && (
        <div
          className="modalLayer"
          onMouseDown={() => setShowTaskViewFlyout(false)}
        >
          <div onMouseDown={(event) => event.stopPropagation()}>
            <TaskViewFlyout
              windows={windowList}
              onRestore={handleRestoreFormClick}
            />
          </div>
        </div>
      )}
      {showProfileFlyout && (
        <div
          className="modalLayer"
          onMouseDown={() => setShowProfileFlyout(false)}
        >
          <div onMouseDown={(event) => event.stopPropagation()}>
            <ProfileFlyout
              onOpenProfile={handleOpenProfile}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      )}
      {showNotificationFlyout && (
        <div
          className="modalLayer"
          onMouseDown={() => setShowNotificationFlyout(false)}
        >
          <div onMouseDown={(event) => event.stopPropagation()}>
            <NotificationFlyout
              notifications={notifications}
              onRead={handleReadNotification}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onViewAll={() => {
                handleOpenPageClick(notificationFormItem);
                setShowNotificationFlyout(false);
              }}
            />
          </div>
        </div>
      )}
      {showWindowFlyout && (
        <div
          className="modalLayer"
          onMouseDown={() => setShowWindowFlyout(false)}
        >
          <div onMouseDown={(event) => event.stopPropagation()}>
            <WindowFlyout
              windows={windowList}
              onRestore={handleRestoreFormClick}
              onCloseAll={handleCloseAll}
              onMinimizeAll={handleMinimizeAll}
              onMaximizeAll={handleMaximizeAll}
              onTileWindows={handleTileWindows}
            />
          </div>
        </div>
      )}
      {windowList.map((item) => (
        <FormsUI
          key={item.id}
          formItem={item}
          onClose={handleCloseFormClick}
          onMinimize={handleMinimizeFormClick}
          onFocus={handleFocusFormClick}
          onToggleMaximize={handleToggleMaximizeFormClick}
          onDock={handleDockFormClick}
          desktopBackground={desktopBackground}
          onSetDesktopBackground={handleSetDesktopBackground}
          onSetTopbarBackground={setTopbarBackground}
          topbarBackground={topbarBackground}
          onSignOut={handleSignOut}
          notifications={notifications}
          onReadNotification={handleReadNotification}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          callFunction1={handleSetDesktopBackground}
          callFunction2={handleSetDesktopBackground}
        />
      ))}
    </div>
  );
};

export default LayoutUI;
