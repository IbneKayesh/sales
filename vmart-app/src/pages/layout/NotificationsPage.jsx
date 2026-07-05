import React, { useState } from "react";
import "./NotificationsPage.css";
import { BreadCrumb } from 'primereact/breadcrumb';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "System Update",
      subtitle: "System will be down for maintenance at 12:00 AM.",
      timestamp: "2 mins ago",
      is_read: false,
      date: "2024-05-07"
    },
    {
      id: 2,
      type: "success",
      title: "Payment Received",
      subtitle: "Invoice #INV-2024-001 has been paid successfully.",
      timestamp: "1 hour ago",
      is_read: false,
      date: "2024-05-07"
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stock Alert",
      subtitle: "Product 'Organic Green Tea' is running low on stock.",
      timestamp: "3 hours ago",
      is_read: true,
      date: "2024-05-07"
    },
    {
      id: 4,
      type: "danger",
      title: "Security Breach",
      subtitle: "Unauthorized login attempt detected from IP 192.168.1.100.",
      timestamp: "Yesterday",
      is_read: false,
      date: "2024-05-06"
    },
    {
      id: 5,
      type: "info",
      title: "New Feature Available",
      subtitle: "Check out the new dashboard analytics tool.",
      timestamp: "2 days ago",
      is_read: true,
      date: "2024-05-05"
    },
  ]);

  const [filter, setFilter] = useState("all");

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
      case "info": return "pi pi-info-circle";
      case "success": return "pi pi-check-circle";
      case "warning": return "pi pi-exclamation-triangle";
      case "danger": return "pi pi-times-circle";
      default: return "pi pi-bell";
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const breadcrumbItems = [{ label: 'Notifications' }];
  const home = { icon: 'pi pi-home', url: '/dashboard' };

  return (
    <div className="notifications-page-container">
      <div className="notifications-page-header">
        <div className="np-header-top">
          <BreadCrumb model={breadcrumbItems} home={home} className="np-breadcrumb" />
          <div className="header-actions">
             <button className="np-btn-mark-all" onClick={markAllAsRead}>
                <i className="pi pi-check-square"></i>
                Mark all as read
             </button>
          </div>
        </div>
        <div className="np-header-content">
          <h1>All Notifications</h1>
          <div className="np-filter-tabs">
            <button 
              className={`np-filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All <span>({notifications.length})</span>
            </button>
            <button 
              className={`np-filter-tab ${filter === "unread" ? "active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Unread <span>({notifications.filter(n => !n.is_read).length})</span>
            </button>
            <button 
              className={`np-filter-tab ${filter === "read" ? "active" : ""}`}
              onClick={() => setFilter("read")}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      <div className="notifications-page-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-page-item ${notification.is_read ? "read" : "unread"}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className={`np-icon-circle ${notification.type}`}>
                <i className={getIcon(notification.type)}></i>
              </div>
              <div className="np-content">
                <div className="np-title-row">
                  <h3 className="np-title">{notification.title}</h3>
                  <span className="np-time">{notification.timestamp}</span>
                </div>
                <p className="np-subtitle">{notification.subtitle}</p>
                <div className="np-meta">
                   <span className="np-date"><i className="pi pi-calendar"></i> {notification.date}</span>
                </div>
              </div>
              {!notification.is_read && <div className="np-indicator"></div>}
            </div>
          ))
        ) : (
          <div className="np-empty-state">
            <i className="pi pi-bell-slash"></i>
            <h3>No notifications found</h3>
            <p>You're all caught up! There are no {filter !== 'all' ? filter : ''} notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
