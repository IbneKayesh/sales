import React, { useState, useEffect, useRef } from "react";
import FullScreenBtn from "./taskbar/FullScreenBtn";
import QuickViewBtn from "./taskbar/QuickViewBtn";
import ShowDesktopBtn from "./taskbar/ShowDesktopBtn";
import StartBtn from "./taskbar/StartBtn";
import SystemClock from "./taskbar/SystemClock";
import NotificationsBtn from "./taskbar/NotificationsBtn";
import quickviewImage from "../../assets/screen-options.png";

export default function TaskbarUI({
  windows,
  activeWindowId,
  onToggleMinimize,
  onFocus,
  user,
  onProfileClick,
  onStartClick,
  onCloseAll,
  onMinimizeAll,
  onMaximizeAll,
  onTileAll,
  isFullscreen,
  onToggleFullscreen,
  showDesktopActive,
  onToggleShowDesktop,
  onToggleOverview,
  unreadNotifCount,
  onToggleNotifications,
}) {
  const [showWinMenu, setShowWinMenu] = useState(false);
  const winMenuRef = useRef(null);

  useEffect(() => {
    if (!showWinMenu) return;
    const handler = (e) => {
      if (winMenuRef.current && !winMenuRef.current.contains(e.target)) {
        setShowWinMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showWinMenu]);

  const handleItemClick = (win) => {
    if (win.id === activeWindowId && !win.minimized) {
      onToggleMinimize(win.id);
    } else {
      if (win.minimized) onToggleMinimize(win.id);
      onFocus(win.id);
    }
  };

  const runWinAction = (fn) => {
    setShowWinMenu(false);
    fn();
  };

  const taskbarItemsRef = useRef(null);
  const [isTaskbarOverflowing, setIsTaskbarOverflowing] = useState(false);

  useEffect(() => {
    const el = taskbarItemsRef.current;
    if (!el) return;

    const compute = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth + 1;
      setIsTaskbarOverflowing(hasOverflow);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);

    const onScroll = () => compute();
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [windows.length]);

  return (
    <div
      className={`taskbar-container ${isTaskbarOverflowing ? "overflow-taskbar" : ""}`}
    >
      <div className="taskbar-left">
        <StartBtn onStartClick={onStartClick} />
        <QuickViewBtn onToggleClick={onToggleOverview} />

        <button
          className="taskbar-scroll-arrow taskbar-scroll-arrow-left"
          type="button"
          aria-label="Scroll taskbar left"
          title="Scroll left"
          onClick={() => {
            const el = document.querySelector(".taskbar-items-container");
            if (el) el.scrollBy({ left: -260, behavior: "smooth" });
          }}
        >
          ◀
        </button>

        <div className="taskbar-items-container" ref={taskbarItemsRef}>
          {windows.map((win) => {
            const isActive = win.id === activeWindowId && !win.minimized;
            return (
              <div
                key={win.id}
                className={`taskbar-item ${isActive ? "active" : ""}`}
                onClick={() => handleItemClick(win)}
                title={win.title}
              >
                <div className="taskbar-window-icon">{win.icon || "📁"}</div>
                <span className="taskbar-text">{win.title}</span>
                <div className="taskbar-item-indicator" />
              </div>
            );
          })}
        </div>

        <button
          className="taskbar-scroll-arrow taskbar-scroll-arrow-right"
          type="button"
          aria-label="Scroll taskbar right"
          title="Scroll right"
          onClick={() => {
            const el = document.querySelector(".taskbar-items-container");
            if (el) el.scrollBy({ left: 260, behavior: "smooth" });
          }}
        >
          ▶
        </button>
      </div>

      <div className="taskbar-right">
        <SystemClock />
        <NotificationsBtn
          unreadCount={unreadNotifCount}
          onToggleClick={onToggleNotifications}
        />
        <FullScreenBtn
          isFullScreen={isFullscreen}
          onToggleClick={onToggleFullscreen}
        />

        <div
          ref={winMenuRef}
          className="win-menu-container mobile-hide-taskbar"
        >
          <button
            className={`win-menu-trigger ${showWinMenu ? "active" : ""}`}
            onClick={() => setShowWinMenu((v) => !v)}
            title="Window Management"
          >
            <img
              src={quickviewImage}
              alt="Quick View"
              width="24"
              height="24"
              style={{ color: "var(--accent-light)" }}
            />
          </button>

          {showWinMenu && (
            <div className="win-menu-popup">
              {[
                {
                  label: "✕  Close All Windows",
                  icon: "✕",
                  action: onCloseAll,
                  danger: true,
                },
                { label: "Minimize All", icon: "−", action: onMinimizeAll },
                { label: "Maximize All", icon: "□", action: onMaximizeAll },
                {
                  label: "Tile Side-by-Side",
                  icon: "⧓",
                  action: onTileAll,
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => runWinAction(item.action)}
                  className={`win-menu-item ${item.danger ? "danger" : ""}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label.replace(item.icon, "").trim()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <ShowDesktopBtn
          isDesktopActive={showDesktopActive}
          onToggleClick={onToggleShowDesktop}
        />

        <button
          className="profile-avatar-btn"
          onClick={onProfileClick}
          title={`Profile: ${user.name}`}
        >
          {user.avatarText || user.name.slice(0, 2).toUpperCase()}
        </button>
      </div>
    </div>
  );
}
