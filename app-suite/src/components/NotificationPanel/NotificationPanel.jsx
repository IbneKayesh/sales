import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { IconCheck, IconWarning, IconError, IconInfo, IconClose, IconBell } from '@/assets/icons';
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
      return <IconCheck className={styles.iconSuccess} />;
    case 'warning':
      return <IconWarning className={styles.iconWarning} />;
    case 'error':
      return <IconError className={styles.iconError} />;
    case 'info':
    default:
      return <IconInfo className={styles.iconInfo} />;
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
        <IconBell className={styles.bellIcon} />
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
                <IconBell className={styles.emptyIcon} />
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
                        <IconClose />
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
