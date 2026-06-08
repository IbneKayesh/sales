import { useState, useEffect } from "react";
import "./LayoutUI.css";
import TaskbarUI from "./TaskbarUI";
import DesktopUI from "./DesktopUI";
import AppSuiteUI from "./AppSuiteUI";
import FormsUI from "./FormsUI";
import TaskViewFlyout from "./taskbar/TaskViewFlyout";
import WindowFlyout from "./taskbar/WindowFlyout";
import ProfileFlyout from "./taskbar/ProfileFlyout";

const LayoutUI = () => {
  const [showAppSuite, setShowAppSuite] = useState(false);
  const [showTaskViewFlyout, setShowTaskViewFlyout] = useState(false);
  const [showProfileFlyout, setShowProfileFlyout] = useState(false);
  const [showWindowFlyout, setShowWindowFlyout] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [notifUnreadCount, setNotifUnreadCount] = useState(5);
  const [windowList, setWindowList] = useState([]);

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

  const handleAppSuiteToggle = () => {
    setShowAppSuite(!showAppSuite);
  };
  const handleShowTaskViewFlyout = () => {
    setShowTaskViewFlyout(!showTaskViewFlyout);
  };
  const handleProfileFlyout = () => {
    setShowProfileFlyout(!showProfileFlyout);
  };
  const handleNotificationFlyout = () => {};
  const handleShowWindowFlyout = () => {
    setShowWindowFlyout(!showWindowFlyout);
  };
  const handleShowDesktop = () => {};

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
    setWindowList((prev) => {
      const exists = prev.some((item) => item.id === formItem.id);

      if (exists) {
        return prev;
      }

      return [...prev, formItem];
    });
    setShowAppSuite(false);
  };

  const handleCloseFormClick = (formItem) => {
    setWindowList((prev) => prev.filter((item) => item.id !== formItem.id));
  };

  return (
    <div className="layoutRoot win11-root">
      <div className="desktopLayer">
        <DesktopUI />
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
        />
      </div>
      {showAppSuite && <AppSuiteUI onOpenPageClick={handleOpenPageClick} />}
      {showTaskViewFlyout && <TaskViewFlyout />}
      {showProfileFlyout && <ProfileFlyout />}
      {showWindowFlyout && <WindowFlyout />}
      {windowList.map((item) => (
        <FormsUI key={item.id} formItem={item} onClose={handleCloseFormClick} />
      ))}
    </div>
  );
};

export default LayoutUI;
