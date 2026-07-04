import React, { useState } from "react";
import { Bell, ShoppingBag, Shield, Info, Check } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "New Order #ORD-8821",
    body: "You have a new order from John Smith for $450.00",
    time: "2m ago",
    type: "order",
    read: false,
  },
  {
    id: 2,
    title: "Security Alert",
    body: "New login detected from Chrome on Windows 11",
    time: "1h ago",
    type: "security",
    read: false,
  },
  {
    id: 3,
    title: "Stock Warning",
    body: "5 items are low in stock. Please check the stock report.",
    time: "3h ago",
    type: "system",
    read: true,
  },
  {
    id: 4,
    title: "Monthly Report",
    body: "Your January sales report is available for download.",
    time: "1d ago",
    type: "system",
    read: true,
  },
];

const NotifComp = ({ isOpen }) => {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag size={18} color="var(--primary)" />;
      case "security":
        return <Shield size={18} color="#EF4444" />;
      default:
        return <Info size={18} color="#7C3AED" />;
    }
  };

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  return (
    <div
      className="lite-popup-menu"
      style={{
        width: "320px",
        maxHeight: "450px",
        overflowY: "auto",
        top: "56px",
        right: "12px",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--surface)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "15px", color: "var(--on-surface)" }}>Notifications</span>
        <button
          onClick={markAllRead}
          className="lite-header-btn-primary"
          style={{ fontSize: "11px", gap: "4px" }}
        >
          <Check size={14} /> Mark all read
        </button>
      </div>

      <div style={{ padding: "4px" }}>
        {notifs.length > 0 ? (
          notifs.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px",
                borderRadius: "12px",
                background: n.read ? "transparent" : "var(--hover-bg)",
                transition: "background 0.2s",
                marginBottom: "4px",
              }}
            >
              <div
                className="activity-icon"
                style={{
                  background: n.read
                    ? "var(--background)"
                    : "var(--primary-glow)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  flexShrink: 0,
                }}
              >
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "var(--on-surface)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{n.title}</span>
                  {!n.read && (
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--primary)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <p
                  className="item-sub-text"
                  style={{ margin: "4px 0 6px", lineHeight: 1.4, fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  {n.body}
                </p>
                <div className="label-small" style={{ fontSize: "10px", color: "var(--text-soft)" }}>
                  {n.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{ textAlign: "center", padding: "40px 20px", opacity: 0.5 }}
          >
            <Bell size={40} style={{ marginBottom: "12px", color: "var(--text-secondary)" }} />
            <p className="label-small">No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifComp;
