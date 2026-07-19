import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  IconLogo,
  IconBell,
  IconLogout,
  IconUsers,
  IconEdit,
  IconInfo,
  IconCheck,
  IconClose,
  IconDollar,
  IconBox,
  IconActivity,
  IconBar,
} from "../icons";
import { toast } from "../components/ToastBox";

export default function Topbar({ className = "", ...rest }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = [
    {
      id: 1,
      type: "success",
      icon: <IconDollar size={16} />,
      title: "Payment received",
      message: "$3,500 from ABC Corp — Invoice #1024",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      icon: <IconBox size={16} />,
      title: "Low stock alert",
      message: "Office supplies running low — 3 items below threshold",
      time: "18 min ago",
      read: false,
    },
    {
      id: 3,
      type: "info",
      icon: <IconActivity size={16} />,
      title: "New user registered",
      message: "Leo Martinez created an account",
      time: "1 hr ago",
      read: false,
    },
    {
      id: 4,
      type: "danger",
      icon: <IconClose size={16} />,
      title: "Payment failed",
      message: "Google Ads campaign payment declined — update billing",
      time: "3 hr ago",
      read: true,
    },
    {
      id: 5,
      type: "success",
      icon: <IconCheck size={16} />,
      title: "Report ready",
      message: "Q3 Financial Summary is available for download",
      time: "5 hr ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  // Close notification panel on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

  const handleLogout = () => {
    toast.success("Logged out successfully.");
    logout();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Only treat as image avatar if value looks like a URL
  const hasAvatar = !!(
    user?.avatar &&
    (user.avatar.startsWith("http") || user.avatar.startsWith("data:"))
  );

  return (
    <header className={`topbar${className ? " " + className : ""}`} {...rest}>
      <NavLink to="/M01/modules" className="topbar__brand">
        <span className="topbar__logo">
          <IconBar size={24} />
        </span>
      </NavLink>
      <NavLink to="/M01/modules" className="topbar__brand">
        <span className="topbar__logo">
          <IconLogo size={28} />
        </span>
        <span className="topbar__title">bSuite</span>
      </NavLink>

      <div className="topbar__nav" />

      <div className="topbar__right">
        <div className="topbar__notif-wrap" ref={notifRef}>
          <button
            type="button"
            className={`topbar__icon-btn${notifOpen ? " topbar__icon-btn--active" : ""}`}
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <IconBell size={20} />
          </button>
          {unreadCount > 0 && (
            <span className="topbar__notif-badge">{unreadCount}</span>
          )}

          {notifOpen && (
            <div className="topbar__notif-panel">
              <div className="topbar__notif-header">
                <span className="topbar__notif-header-title">
                  Notifications
                </span>
                <button
                  type="button"
                  className="topbar__notif-mark-read"
                  onClick={() => setNotifOpen(false)}
                >
                  Mark all as read
                </button>
              </div>
              <div className="topbar__notif-list">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`topbar__notif-item${!n.read ? " topbar__notif-item--unread" : ""}`}
                  >
                    <span
                      className={`topbar__notif-item-icon topbar__notif-item-icon--${n.type}`}
                    >
                      {n.icon}
                    </span>
                    <div className="topbar__notif-item-content">
                      <span className="topbar__notif-item-title">
                        {n.title}
                      </span>
                      <span className="topbar__notif-item-message">
                        {n.message}
                      </span>
                    </div>
                    <span className="topbar__notif-item-time">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="topbar__notif-footer">
                <button
                  type="button"
                  className="topbar__notif-view-all"
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/notifications");
                  }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Account */}
        <div className="topbar__profile-wrap" ref={profileRef}>
          <button
            type="button"
            className={`topbar__avatar${profileOpen ? " topbar__avatar--active" : ""}`}
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User menu"
            aria-expanded={profileOpen}
            title={user?.name || "User"}
          >
            {hasAvatar ? (
              <img
                className="topbar__avatar-img"
                src={user.avatar}
                alt={user.name || "User"}
              />
            ) : (
              <span className="topbar__avatar-initials">{initials}</span>
            )}
            <span
              className={`topbar__avatar-status ${user?.status === "active" ? "topbar__avatar-status--online" : ""}`}
            />
          </button>

          {profileOpen && (
            <div className="topbar__profile-menu">
              <div className="topbar__profile-header">
                <div className="topbar__profile-header-left">
                  {hasAvatar ? (
                    <img
                      className="topbar__profile-avatar-img"
                      src={user.avatar}
                      alt=""
                    />
                  ) : (
                    <span className="topbar__profile-avatar-letter">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="topbar__profile-header-text">
                  <span className="topbar__profile-name">
                    {user?.name || "User"}
                  </span>
                  <span className="topbar__profile-email">
                    {user?.email || ""}
                  </span>
                  {user?.role && (
                    <span className="topbar__profile-role">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <div className="topbar__profile-divider" />
              <div className="topbar__profile-actions">
                <button
                  type="button"
                  className="topbar__profile-action"
                  onClick={() => navigate("/users")}
                >
                  <IconUsers size={16} />
                  Profile settings
                </button>
                <button
                  type="button"
                  className="topbar__profile-action"
                  onClick={() => navigate("/settings")}
                >
                  <IconEdit size={16} />
                  Account settings
                </button>
                <button type="button" className="topbar__profile-action">
                  <IconInfo size={16} />
                  Help &amp; support
                </button>
              </div>
              <div className="topbar__profile-divider" />
              <button
                type="button"
                className="topbar__profile-logout"
                onClick={handleLogout}
              >
                <IconLogout size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
