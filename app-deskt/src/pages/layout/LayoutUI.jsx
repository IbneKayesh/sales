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

const setupFormItem = {
  id: "setup-desktop",
  name: "Desktop Setup",
  icon: "PS",
  forms: "SetupPage",
  module: "setup",
  size: "medium",
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

const defaultDesktopBackground =
  "radial-gradient(900px 520px at 18% 12%, var(--win11-body-glow-primary), var(--win11-transparent) 58%), radial-gradient(720px 420px at 78% 18%, var(--win11-body-glow-secondary), var(--win11-transparent) 62%), linear-gradient(135deg, var(--win11-bg), var(--win11-bg-deep))";

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
  const [desktopBackground, setDesktopBackground] = useState(
    defaultDesktopBackground,
  );
  const [topbarBackground, setTopbarBackground] = useState("var(--win11-panel)");
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

  // Load saved desktop background from localStorage
  useEffect(() => {
    const savedBackground = localStorage.getItem("desktopBackground");
    if (savedBackground) {
      setDesktopBackground(savedBackground);
    }
  }, []);

  // Load saved topbar background from localStorage
  useEffect(() => {
    const savedTopbar = localStorage.getItem("topbarBackground");
    if (savedTopbar) {
      setTopbarBackground(savedTopbar);
    }
  }, []);

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
    if (confirm("Are you sure you want to reset the desktop? This will close all open windows.")) {
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
    setRecentForms((prev) => [
      formItem,
      ...prev.filter((item) => item.id !== formItem.id),
    ].slice(0, 8));
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
    setWindowList((prev) =>
      prev.map((item) => {
        const index = targets.findIndex((target) => target.id === item.id);
        if (index === -1) return item;

        return {
          ...item,
          isMinimized: false,
          isMaximized: false,
          layout: "tile",
          tileIndex: index,
          tileCount: targets.length,
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
          onOpenSetup={() => handleOpenPageClick(setupFormItem)}
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
        <div className="modalLayer" onMouseDown={() => setShowWindowFlyout(false)}>
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
          onSetDesktopBackground={setDesktopBackground}
          onSetTopbarBackground={setTopbarBackground}
          topbarBackground={topbarBackground}
          notifications={notifications}
          onReadNotification={handleReadNotification}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onSignOut={handleSignOut}
        />
      ))}
    </div>
  );
};

export default LayoutUI;
