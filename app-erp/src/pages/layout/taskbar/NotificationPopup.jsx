import React, { useEffect, useRef } from 'react';

export default function NotificationPopup({ notifications, onMarkRead, onMarkAllRead, onDismiss, onOpenPage, onClose }) {
  const popupRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on click outside
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={popupRef} className="notif-popup">
      {/* Header */}
      <div className="notif-popup-header">
        <span className="notif-popup-title">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="notif-unread-badge">{unreadCount}</span>
          )}
        </span>
        {unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={onMarkAllRead}>Mark all read</button>
        )}
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <div className="notif-empty-icon">🔕</div>
            No notifications
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? 'read' : 'unread'}`}
              onClick={() => !n.read && onMarkRead(n.id)}
            >
              <div className="notif-item-icon">{n.icon}</div>
              <div className="notif-item-body">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-text">{n.body}</div>
                <div className="notif-item-time">{n.timestamp}</div>
              </div>
              <button
                className="notif-item-dismiss"
                onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
                title="Dismiss"
              >✕</button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="notif-popup-footer">
        <button
          className="notif-open-page-btn"
          onClick={() => { onOpenPage(); onClose(); }}
        >
          📋 View All Notifications
        </button>
      </div>
    </div>
  );
}
