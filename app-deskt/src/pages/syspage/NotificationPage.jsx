import { useState } from "react";
import "./NotificationPage.css";

const NotificationPage = ({
  notifications = [],
  onRead,
  onMarkAllRead,
  onClose,
  onDismiss,
}) => {
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread' | 'read'
  const unreadCount = notifications.filter((n) => !n.isRead).length;


  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "!";
      case "info":
      default:
        return "ℹ";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "var(--win11-green)";
      case "error":
        return "var(--win11-red)";
      case "info":
      default:
        return "var(--win11-blue)";
    }
  };

  return (
    <div className="page-container">
      <div className="page-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</h2>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid var(--win11-border)",
                background: "var(--win11-accent)",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
              type="button"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "12px",
        }}
      >
        {notifications.length === 0 ? (
          <div style={{ padding: "12px", textAlign: "center", color: "var(--win11-muted)" }}>
            No notifications
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.isRead && onRead(item.id)}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: `1px solid ${item.isRead ? "var(--win11-border)" : getTypeColor(item.type)}`,
                borderLeft: `4px solid ${getTypeColor(item.type)}`,
                background: item.isRead ? "var(--win11-panel)" : "var(--win11-panel-hover)",
                opacity: item.isRead ? 0.7 : 1,
                cursor: item.isRead ? "default" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "start" }}>
                <span
                  style={{
                    color: getTypeColor(item.type),
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "24px",
                    textAlign: "center",
                  }}
                >
                  {getTypeIcon(item.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--win11-muted)", lineHeight: "1.4" }}>
                    {item.message}
                  </div>
                </div>
                {!item.isRead && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: getTypeColor(item.type),
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
