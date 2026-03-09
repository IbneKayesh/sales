import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorageData } from "@/utils/storage";
import "./Topbar.css";
import ActiveBusiness from "@/components/ActiveBusiness";
import UserProfile from "@/components/UserProfile";
import { useNotification } from "@/hooks/useAppUI";
import { OverlayPanel } from "primereact/overlaypanel";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";

const Topbar = ({
  leftbarCollapsed,
  onToggleLeftbar,
  onToggleFullMode,
  menus,
}) => {
  const { logout, user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearNotifications } =
    useNotification();

  const location = useLocation();
  const navigate = useNavigate();
  const [navigationIcons, setNavigationIcons] = useState([]);
  const [recentMenus, setRecentMenus] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const dropdownRef = useRef(null);
  const notificationPanel = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const data = getStorageData();
    setRecentMenus(data.recentMenus || []);
  }, [location.pathname]); // Update when route changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleRecentClick = (url) => {
    setShowRecent(false);
    navigate(url);
  };

  const [showActiveBusiness, setShowActiveBusiness] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-btn" onClick={onToggleLeftbar}>
            <i
              className={`pi ${
                leftbarCollapsed ? "pi-angle-right" : "pi-angle-left"
              }`}
            ></i>
          </button>
          <button className="topbar-btn" onClick={onToggleFullMode}>
            <i className="pi pi-expand"></i>
          </button>
        </div>

        <div className="topbar-center">
          {recentMenus.length > 0 && (
            <div className="recent-menus-wrapper" ref={dropdownRef}>
              <button
                className="recent-menus-trigger topbar-btn"
                onClick={() => setShowRecent((v) => !v)}
                title="Recent menus"
              >
                <i className="pi pi-history"></i>
              </button>

              {showRecent && (
                <div className="recent-menus-dropdown">
                  <div className="recent-menus-header">Recent</div>
                  {recentMenus.map((menu) => (
                    <div
                      key={menu.url}
                      className={`recent-menu-item${
                        location.pathname === menu.url ? " active" : ""
                      }`}
                      onClick={() => handleRecentClick(menu.url)}
                    >
                      <i className={menu.icon}></i>
                      <span>
                        {menu.name} ({menu.count || 1})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="topbar-avatar">
          <div className="flex items-center gap-2">
            <button
              className="topbar-btn p-overlay-badge"
              onClick={(e) => {
                notificationPanel.current.toggle(e);
              }}
            >
              <i className="pi pi-bell"></i>
              {unreadCount > 0 && (
                <Badge
                  value={unreadCount}
                  severity="danger"
                  size="small"
                ></Badge>
              )}
            </button>
            <OverlayPanel
              ref={notificationPanel}
              style={{ width: "350px" }}
              className="notification-panel shadow-5"
            >
              <div className="flex justify-content-between align-items-center mb-2 px-2 border-bottom-1 surface-border pb-2">
                <span className="font-bold text-xl">Notifications</span>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      label="Mark Read"
                      link
                      className="p-0 text-sm font-semibold"
                      onClick={markAllAsRead}
                    />
                  )}
                  <Button
                    label="Clear"
                    link
                    className="p-0 text-sm text-pink-500 font-semibold"
                    onClick={clearNotifications}
                    disabled={notifications.length === 0}
                  />
                </div>
              </div>
              <div
                className="notification-list overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-500">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 mb-2 border-round cursor-pointer transition-all transition-duration-200 ${
                        n.read
                          ? "surface-50 opacity-70"
                          : "blue-50 border-left-3 border-blue-500 shadow-1"
                      } hover:surface-100`}
                      onClick={() => {
                        if (!n.read) markAsRead(n.id);
                      }}
                    >
                      <div className="flex justify-content-between align-items-start mb-1">
                        <span
                          className={`text-sm ${n.read ? "text-700" : "font-bold text-blue-800"}`}
                        >
                          {n.title}
                        </span>
                        <span className="text-xs text-500">{n.timestamp}</span>
                      </div>
                      <p
                        className={`m-0 text-sm line-height-3 ${n.read ? "text-600" : "text-800"}`}
                      >
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </OverlayPanel>

            <UserProfile
              onSwitchBusiness={() => setShowActiveBusiness(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
      {showActiveBusiness && (
        <ActiveBusiness
          visible={showActiveBusiness}
          setVisible={setShowActiveBusiness}
        />
      )}
    </>
  );
};

export default Topbar;
