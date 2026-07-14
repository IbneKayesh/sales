import React, { useState, useMemo } from 'react';
import styles from './NotificationPage.module.css';

// ── Expanded Demo Notifications ───────────────────────────────────────────
const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'success',
    title: 'Sale Completed',
    message: 'Invoice INV-001 for Acme Corp ($6,000) has been paid successfully.',
    details: 'Payment was processed via wire transfer. Receipt sent to accounts@acmecorp.com. Inventory updated automatically.',
    time: '2 minutes ago',
    date: '2026-07-14T10:28:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'AI Inference Unit (SKU: AIU-005) is running low — only 8 units remaining.',
    details: 'Reorder threshold: 15 units. Recommended reorder quantity: 50 units. Estimated lead time: 14 days.',
    time: '15 minutes ago',
    date: '2026-07-14T10:15:00',
    read: false,
  },
  {
    id: 'n3',
    type: 'info',
    title: 'Order Shipped',
    message: 'Order ORD-004 for Umbrella Corp has been shipped via DHL.',
    details: 'Tracking number: DHL-9876543210. Estimated delivery: 2026-07-18. Package weight: 12.5 kg.',
    time: '1 hour ago',
    date: '2026-07-14T09:30:00',
    read: false,
  },
  {
    id: 'n4',
    type: 'info',
    title: 'System Update Available',
    message: 'A new system update (v2.4.1) is available. Restart recommended.',
    details: 'Changelog: Security patches, performance improvements, new API endpoints for CRM integration. Estimated install time: 5 minutes.',
    time: '3 hours ago',
    date: '2026-07-14T07:00:00',
    read: true,
  },
  {
    id: 'n5',
    type: 'error',
    title: 'Payment Failed',
    message: 'Invoice INV-003 for Initech LLC ($792) is overdue. Payment required.',
    details: 'Invoice sent 30 days ago. 2 reminders sent. Late fee of $39.60 (5%) has been applied. Further escalation pending.',
    time: '5 hours ago',
    date: '2026-07-14T05:00:00',
    read: true,
  },
  {
    id: 'n6',
    type: 'success',
    title: 'Inventory Updated',
    message: '12 new Cloud Compute Instances added to inventory.',
    details: 'SKU range: CCI-1001 to CCI-1012. Total value: $48,000. Added by warehouse team (Order PO-024).',
    time: 'Yesterday',
    date: '2026-07-13T16:45:00',
    read: true,
  },
  {
    id: 'n7',
    type: 'warning',
    title: 'Delivery Delayed',
    message: 'Delivery DEL-001 for Acme Corp is delayed. New ETA: 2026-07-17.',
    details: 'Reason: Weather conditions at shipping hub. Customer has been notified. No additional fees incurred.',
    time: 'Yesterday',
    date: '2026-07-13T11:20:00',
    read: true,
  },
  {
    id: 'n8',
    type: 'info',
    title: 'New User Registered',
    message: 'A new user "jdoe" has joined the system with Standard role.',
    details: 'User: John Doe (jdoe@company.com). Department: Sales. Manager approval pending.',
    time: '2 days ago',
    date: '2026-07-12T14:00:00',
    read: true,
  },
  {
    id: 'n9',
    type: 'success',
    title: 'CRM Sync Complete',
    message: 'Customer database synced successfully with HubSpot. 347 records updated.',
    details: 'New contacts: 23. Updated contacts: 124. Merged duplicates: 5. Sync duration: 47 seconds.',
    time: '2 days ago',
    date: '2026-07-12T09:00:00',
    read: true,
  },
  {
    id: 'n10',
    type: 'warning',
    title: 'SSL Certificate Expiring',
    message: 'The SSL certificate for app-suite.io expires in 14 days.',
    details: 'Certificate: SHA256 RSA 2048 bits. Issued by Let\'s Encrypt. Auto-renewal is enabled. No action required.',
    time: '3 days ago',
    date: '2026-07-11T08:30:00',
    read: true,
  },
];

// ── Type icon mapping (reused from NotificationPanel) ─────────────────────
const TypeIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.typeIcon}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'warning':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.typeIcon}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'error':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.typeIcon}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.typeIcon}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'success' | 'warning' | 'error' | 'info'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const typeCounts = useMemo(() => ({
    all: notifications.length,
    unread: unreadCount,
    success: notifications.filter((n) => n.type === 'success').length,
    warning: notifications.filter((n) => n.type === 'warning').length,
    error: notifications.filter((n) => n.type === 'error').length,
    info: notifications.filter((n) => n.type === 'info').length,
  }), [notifications, unreadCount]);

  const filtered = useMemo(() => {
    let list = notifications;
    if (filter === 'unread') list = list.filter((n) => !n.read);
    else if (filter !== 'all') list = list.filter((n) => n.type === filter);

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          n.details?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [notifications, filter, searchQuery]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return styles.typeSuccess;
      case 'warning': return styles.typeWarning;
      case 'error':   return styles.typeError;
      case 'info':    return styles.typeInfo;
      default:        return '';
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Notifications</h1>
          <span className={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} unread out of ${notifications.length} total`
              : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={markAllRead}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.btnIcon}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs + Search ────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.filterTabs}>
          {[
            { key: 'all', label: 'All', count: typeCounts.all },
            { key: 'unread', label: 'Unread', count: typeCounts.unread },
            { key: 'success', label: 'Success', count: typeCounts.success },
            { key: 'warning', label: 'Warning', count: typeCounts.warning },
            { key: 'error', label: 'Error', count: typeCounts.error },
            { key: 'info', label: 'Info', count: typeCounts.info },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`${styles.filterTab} ${filter === tab.key ? styles.filterTabActive : ''} ${tab.key === 'warning' ? styles.filterTabWarning : ''} ${tab.key === 'error' ? styles.filterTabError : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className={styles.filterCount}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.searchIcon}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Notification List ───────────────────────────────────────── */}
      <div className={styles.listSection}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            </svg>
            <h3>No notifications found</h3>
            <p>
              {searchQuery
                ? 'Try adjusting your search terms or filters.'
                : filter !== 'all'
                  ? `There are no ${filter} notifications.`
                  : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className={`${styles.item} ${n.read ? styles.itemRead : styles.itemUnread} ${expandedId === n.id ? styles.itemExpanded : ''}`}
            >
              <div className={styles.itemMain} onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}>
                <div className={`${styles.itemIcon} ${getTypeColor(n.type)}`}>
                  <TypeIcon type={n.type} />
                </div>
                <div className={styles.itemBody}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemTitle}>{n.title}</span>
                    <span className={styles.itemTime}>{n.time}</span>
                  </div>
                  <p className={styles.itemMessage}>{n.message}</p>
                  {expandedId === n.id && n.details && (
                    <div className={styles.itemDetails}>
                      <p>{n.details}</p>
                    </div>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                    title={n.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <svg viewBox="0 0 24 24" fill={n.read ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                    title="Dismiss"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
