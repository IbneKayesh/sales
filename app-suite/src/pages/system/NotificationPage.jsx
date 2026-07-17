import { useState, useMemo } from 'react';

import { IconCheck, IconWarning, IconError, IconInfo, IconSearch, IconBell, IconRead, IconClose } from '@/assets/icons';
import './NotificationPage.css';
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
      return <IconCheck className="typeIcon" />;
    case 'warning':
      return <IconWarning className="typeIcon" />;
    case 'error':
      return <IconError className="typeIcon" />;
    case 'info':
    default:
      return <IconInfo className="typeIcon" />;
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
      case 'success': return 'typeSuccess';
      case 'warning': return 'typeWarning';
      case 'error':   return 'typeError';
      case 'info':    return 'typeInfo';
      default:        return '';
    }
  };

  return (
    <div className="page">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="header">
        <div className="headerLeft">
          <h1 className="title">Notifications</h1>
          <span className="subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread out of ${notifications.length} total`
              : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="headerActions">
          {unreadCount > 0 && (
            <button className="markAllBtn" onClick={markAllRead}>
              <IconCheck className="btnIcon" />
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs + Search ────────────────────────────────────── */}
      <div className="toolbar">
        <div className="filterTabs">
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
              className={`filterTab ${filter === tab.key ? 'filterTabActive' : ''} ${tab.key === 'warning' ? 'filterTabWarning' : ''} ${tab.key === 'error' ? 'filterTabError' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="filterCount">{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="searchWrap">
          <IconSearch className="searchIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Notification List ───────────────────────────────────────── */}
      <div className="listSection">
        {filtered.length === 0 ? (
          <div className="empty">
            <IconBell className="emptyIcon" />
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
              className={`item ${n.read ? 'itemRead' : 'itemUnread'} ${expandedId === n.id ? 'itemExpanded' : ''}`}
            >
              <div className="itemMain" onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}>
                <div className={`itemIcon ${getTypeColor(n.type)}`}>
                  <TypeIcon type={n.type} />
                </div>
                <div className="itemBody">
                  <div className="itemHeader">
                    <span className="itemTitle">{n.title}</span>
                    <span className="itemTime">{n.time}</span>
                  </div>
                  <p className="itemMessage">{n.message}</p>
                  {expandedId === n.id && n.details && (
                    <div className="itemDetails">
                      <p>{n.details}</p>
                    </div>
                  )}
                </div>
                <div className="itemActions">
                  <button
                    className="actionBtn"
                    onClick={(e) => { e.stopPropagation(); toggleRead(n.id); }}
                    title={n.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <IconRead fill={n.read ? 'none' : 'currentColor'} />
                  </button>
                  <button
                    className="actionBtn"
                    onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                    title="Dismiss"
                  >
                    <IconClose />
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
