import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Notifications.css";

const Notifications = ({ onClose }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "System Update",
      subtitle: "System will be down for maintenance at 12:00 AM.",
      timestamp: "2 mins ago",
      is_read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Payment Received",
      subtitle: "Invoice #INV-2024-001 has been paid successfully.",
      timestamp: "1 hour ago",
      is_read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stock Alert",
      subtitle: "Product 'Organic Green Tea' is running low on stock.",
      timestamp: "3 hours ago",
      is_read: true,
    },
    {
      id: 4,
      type: "danger",
      title: "Security Breach",
      subtitle: "Unauthorized login attempt detected from IP 192.168.1.100.",
      timestamp: "Yesterday",
      is_read: false,
    },
    {
      id: 5,
      type: "info",
      title: "New Feature Available",
      subtitle: "Check out the new dashboard analytics tool.",
      timestamp: "2 days ago",
      is_read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return "pi pi-info-circle";
      case "success":
        return "pi pi-check-circle";
      case "warning":
        return "pi pi-exclamation-triangle";
      case "danger":
        return "pi pi-times-circle";
      default:
        return "pi pi-bell";
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-left">
          <h2>Notifications</h2>
          <span className="unread-count">
            {notifications.filter((n) => !n.is_read).length} New
          </span>
        </div>
        <button className="mark-all-btn" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.is_read ? "read" : "unread"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className={`notification-icon-wrapper ${notification.type}`}>
                <i className={getIcon(notification.type)}></i>
              </div>
              <div className="notification-content">
                <div className="notification-title-row">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="notification-subtitle">{notification.subtitle}</p>
              </div>
              {!notification.is_read && <div className="unread-dot"></div>}
            </div>
          ))
        ) : (
          <div className="empty-notifications">
            <div className="empty-icon-circle">
              <i className="pi pi-bell-slash"></i>
            </div>
            <p>No notifications yet</p>
            <span>We'll let you know when something happens.</span>
          </div>
        )}
      </div>

      <div className="notifications-footer">
        <button 
          className="view-all-btn" 
          onClick={() => {
            navigate("/notifications");
            onClose && onClose();
          }}
        >
          View all notifications
          <i className="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Notifications;
