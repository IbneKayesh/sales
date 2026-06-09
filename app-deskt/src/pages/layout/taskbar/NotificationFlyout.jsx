import "./NotificationFlyout.css";

const NotificationFlyout = ({
  notifications = [],

  onRead,
  onMarkAllRead,
  onViewAll,
}) => {
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
    <div className="notificationFlyout">
      <div className="flyoutHeader">
        <span>Notifications {unreadCount > 0 && `(${unreadCount})`}</span>
        <div style={{ display: "flex", gap: "4px" }}>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="btn-link"
              type="button"
              style={{ fontSize: "11px", padding: "2px 6px" }}
              title="Mark all as read"
            >
              Clear
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onViewAll}
              className="btn-link"
              type="button"
              style={{ fontSize: "11px", padding: "2px 6px" }}
              title="View all notifications"
            >
              View All
            </button>
          )}
        </div>
      </div>
      <div className="flyoutContent">
        {notifications.length === 0 ? (
          <div className="notificationItem" style={{ opacity: 0.6 }}>
            No notifications
          </div>
        ) : (
          notifications.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className={`notificationItem ${item.isRead ? "is-read" : ""}`}
              onClick={() => !item.isRead && onRead(item.id)}
              style={{
                opacity: item.isRead ? 0.6 : 1,
                cursor: item.isRead ? "default" : "pointer",
                borderLeft: `3px solid ${getTypeColor(item.type)}`,
                paddingLeft: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    color: getTypeColor(item.type),
                    fontWeight: "bold",
                    minWidth: "16px",
                  }}
                >
                  {getTypeIcon(item.type)}
                </span>
                <div>
                  <div style={{ fontWeight: "500", fontSize: "12px" }}>
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--win11-muted)",
                      marginTop: "2px",
                    }}
                  >
                    {item.message}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationFlyout;
