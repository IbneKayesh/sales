import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import styles from './NotificationPanel.module.css';

// ── Demo notifications ────────────────────────────────────────────────────
const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'success',
    title: 'Sale Completed',
    message: 'Invoice INV-001 for Acme Corp ($6,000) has been paid successfully.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'AI Inference Unit (SKU: AIU-005) is running low — only 8 units remaining.',
    time: '15 minutes ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Order Shipped',
    message: 'Order ORD-004 for Umbrella Corp has been shipped via DHL.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'info',
    title: 'System Update Available',
    message: 'A new system update (v2.4.1) is available. Restart recommended.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'error',
    title: 'Payment Failed',
    message: 'Invoice INV-003 for Initech LLC ($792) is overdue. Payment required.',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'success',
    title: 'Inventory Updated',
    message: '12 new Cloud Compute Instances added to inventory.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n7',
    type: 'warning',
    title: 'Delivery Delayed',
    message: 'Delivery DEL-001 for Acme Corp is delayed. New ETA: 2026-07-17.',
    time: 'Yesterday',
    read: true,
  },
];

// ── Type icon mapping ─────────────────────────────────────────────────────
const TypeIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.iconSuccess}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.iconWarning}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.iconError}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.iconInfo}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

const NotificationPanel = () => {
  const { openWindow } = useWindowManager();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (e, id) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { close(); triggerRef.current?.focus(); }
    };
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, close]);

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={toggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.bellIcon}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge} aria-label={`${unreadCount} unread notifications`}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="dialog" aria-label="Notifications">
          <div className={styles.dropdownHeader}>
            <h3 className={styles.dropdownTitle}>Notifications</h3>
            <div className={styles.dropdownActions}>
              {unreadCount > 0 && (
                <button className={styles.markAllBtn} onClick={markAllRead}>
                  Mark all read
                </button>
              )}
              <button className={styles.viewAllBtn} onClick={() => { openWindow('notifications'); close(); }}>
                View All
              </button>
            </div>
          </div>

          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.emptyIcon}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                </svg>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.notificationItem} ${n.read ? styles.read : styles.unread}`}
                >
                  <div className={styles.notifIcon}>
                    <TypeIcon type={n.type} />
                  </div>
                  <div className={styles.notifBody}>
                    <div className={styles.notifHeader}>
                      <span className={styles.notifTitle}>{n.title}</span>
                      <button
                        className={styles.dismissBtn}
                        onClick={(e) => dismissNotification(e, n.id)}
                        aria-label="Dismiss notification"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <p className={styles.notifMessage}>{n.message}</p>
                    <span className={styles.notifTime}>{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
