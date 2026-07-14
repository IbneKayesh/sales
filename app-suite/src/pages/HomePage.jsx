import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDesktop } from '../context/DesktopContext';
import { useToast } from '@/context/FeedbackContext';
import styles from './HomePage.module.css';

// ── Widget Definitions ────────────────────────────────────────────────────
const WIDGET_DEFS = {
  'system-status': {
    id: 'system-status',
    title: 'System Status',
    icon: 'monitor',
    description: 'CPU, memory and storage usage',
  },
  'sales-summary': {
    id: 'sales-summary',
    title: 'Sales Summary',
    icon: 'dollar',
    description: 'Revenue, orders and pending stats',
  },
  'recent-activity': {
    id: 'recent-activity',
    title: 'Recent Activity',
    icon: 'clock',
    description: 'Latest system events and alerts',
  },
  'quick-actions': {
    id: 'quick-actions',
    title: 'Quick Actions',
    icon: 'zap',
    description: 'One-click access to common tasks',
  },
};

const SvgIcon = ({ icon }) => {
  switch (icon) {
    case 'monitor':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.cardIcon}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'dollar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.cardIcon}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.cardIcon}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'zap':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.cardIcon}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    default:
      return null;
  }
};

// ── Individual Widget Components ──────────────────────────────────────────

const SystemStatusWidget = () => (
  <div className={styles.statusList}>
    <div className={styles.statusItem}>
      <div className={styles.statusLabel}>
        <span>CPU Usage</span>
        <span>28%</span>
      </div>
      <div className={styles.progressBar}>
        <div className={`${styles.progressFill} ${styles.progressCpu}`} />
      </div>
    </div>
    <div className={styles.statusItem}>
      <div className={styles.statusLabel}>
        <span>Memory</span>
        <span>4.2 GB / 16 GB</span>
      </div>
      <div className={styles.progressBar}>
        <div className={`${styles.progressFill} ${styles.progressMem}`} />
      </div>
    </div>
    <div className={styles.statusItem}>
      <div className={styles.statusLabel}>
        <span>Storage</span>
        <span>124 GB / 512 GB</span>
      </div>
      <div className={styles.progressBar}>
        <div className={`${styles.progressFill} ${styles.progressStorage}`} />
      </div>
    </div>
  </div>
);

const SalesSummaryWidget = () => (
  <div className={styles.statsGrid}>
    <div className={styles.statItem}>
      <span className={styles.statValue}>$24,580</span>
      <span className={styles.statLabel}>Total Revenue</span>
      <span className={`${styles.statTrend} ${styles.trendUp}`}>+12.3%</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statValue}>47</span>
      <span className={styles.statLabel}>Orders</span>
      <span className={`${styles.statTrend} ${styles.trendUp}`}>+8</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statValue}>12</span>
      <span className={styles.statLabel}>Pending</span>
      <span className={`${styles.statTrend} ${styles.trendNeutral}`}>= 0</span>
    </div>
    <div className={styles.statItem}>
      <span className={styles.statValue}>$3,420</span>
      <span className={styles.statLabel}>Avg. Order</span>
      <span className={`${styles.statTrend} ${styles.trendUp}`}>+5.7%</span>
    </div>
  </div>
);

const RecentActivityWidget = () => (
  <div className={styles.activityList}>
    <div className={styles.activityItem}>
      <div className={`${styles.activityDot} ${styles.dotSuccess}`} />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>Sale completed</span>
        <span className={styles.activityMeta}>Invoice INV-001 • 2 min ago</span>
      </div>
    </div>
    <div className={styles.activityItem}>
      <div className={`${styles.activityDot} ${styles.dotWarning}`} />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>Low stock alert</span>
        <span className={styles.activityMeta}>AIU-005: 8 remaining • 15 min ago</span>
      </div>
    </div>
    <div className={styles.activityItem}>
      <div className={`${styles.activityDot} ${styles.dotInfo}`} />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>Order shipped</span>
        <span className={styles.activityMeta}>ORD-004 via DHL • 1 hour ago</span>
      </div>
    </div>
    <div className={styles.activityItem}>
      <div className={`${styles.activityDot} ${styles.dotSuccess}`} />
      <div className={styles.activityText}>
        <span className={styles.activityTitle}>Inventory updated</span>
        <span className={styles.activityMeta}>12 new items added • Yesterday</span>
      </div>
    </div>
  </div>
);

const QuickActionsWidget = () => {
  const { addToast } = useToast();
  const actions = [
    { label: 'New Sale', icon: 'plus' },
    { label: 'New Invoice', icon: 'file' },
    { label: 'Add Product', icon: 'box' },
    { label: 'Reports', icon: 'chart' },
  ];
  const actIcon = (name) => {
    switch (name) {
      case 'plus':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
      case 'file':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
      case 'box':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>;
      case 'chart':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
      default:
        return null;
    }
  };
  return (
    <div className={styles.actionsGrid}>
      {actions.map((a) => (
        <button key={a.label} className={styles.actionBtn} onClick={() => addToast({ message: `Opening ${a.label}...`, type: 'info' })}>
          {actIcon(a.icon)}
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  );
};

const WIDGET_COMPONENTS = {
  'system-status': SystemStatusWidget,
  'sales-summary': SalesSummaryWidget,
  'recent-activity': RecentActivityWidget,
  'quick-actions': QuickActionsWidget,
};

// ── HomePage ──────────────────────────────────────────────────────────────

const HomePage = () => {
  const { currentUser } = useAuth();
  const { widgetOrder, setWidgetOrder, toggleWidget, allWidgets } = useDesktop();
  const [time, setTime] = useState(new Date());
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showPicker) return;
    const close = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showPicker]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const visibleWidgets = widgetOrder.filter((id) => WIDGET_COMPONENTS[id]);
  const hiddenWidgets = allWidgets.filter((id) => !widgetOrder.includes(id));

  // ── Drag handlers ────────────────────────────────────────────────────
  const handleDragStart = useCallback((e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
    // Delay adding the dragging class for a cleaner visual
    setTimeout(() => {
      if (e.target) e.target.closest(`.${styles.widgetCard}`)?.classList.add(styles.dragging);
    }, 0);
  }, []);

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIdx !== null && dragIdx !== idx) setOverIdx(idx);
  }, [dragIdx]);

  const handleDragLeave = useCallback(() => {
    setOverIdx(null);
  }, []);

  const handleDrop = useCallback((e, dropIdx) => {
    e.preventDefault();
    const srcIdx = dragIdx;
    if (srcIdx === null || srcIdx === dropIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const reordered = [...widgetOrder];
    const [moved] = reordered.splice(srcIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    setWidgetOrder(reordered);
    setDragIdx(null);
    setOverIdx(null);
    // Clean up dragging class
    document.querySelectorAll(`.${styles.dragging}`).forEach((el) => el.classList.remove(styles.dragging));
  }, [dragIdx, widgetOrder, setWidgetOrder]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setOverIdx(null);
    document.querySelectorAll(`.${styles.dragging}`).forEach((el) => el.classList.remove(styles.dragging));
  }, []);

  const displayName = currentUser?.displayName || 'Guest';

  return (
    <div className={styles.container}>
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <div className={styles.heroSection}>
        <div className={styles.heroTopRow}>
          <div className={styles.timeWidget}>
            <h1 className={styles.clock}>{formatTime(time)}</h1>
            <p className={styles.date}>{formatDate(time)}</p>
          </div>
          <div className={styles.widgetToolbar}>
            <button
              className={styles.addWidgetBtn}
              onClick={() => setShowPicker((p) => !p)}
              title="Customize widgets"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Widgets</span>
            </button>

            {showPicker && (
              <div className={styles.widgetPicker} ref={pickerRef}>
                <div className={styles.pickerHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.pickerIcon}>
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Customize Dashboard
                </div>
                <p className={styles.pickerHint}>Drag widgets to reorder. Toggle to show/hide.</p>
                {allWidgets.map((id) => {
                  const def = WIDGET_DEFS[id];
                  const isActive = visibleWidgets.includes(id);
                  const idx = visibleWidgets.indexOf(id);
                  return (
                    <div key={id} className={styles.pickerRow}>
                      <div className={styles.pickerInfo}>
                        {def && <SvgIcon icon={def.icon} />}
                        <div className={styles.pickerText}>
                          <span className={styles.pickerName}>{def?.title || id}</span>
                          <span className={styles.pickerDesc}>{def?.description}</span>
                        </div>
                      </div>
                      <div className={styles.pickerControls}>
                        <span className={styles.pickerPos}>#{idx + 1}</span>
                        <button
                          className={`${styles.pinBtn} ${isActive ? styles.pinBtnActive : ''}`}
                          onClick={() => toggleWidget(id)}
                          title={isActive ? 'Remove from dashboard' : 'Add to dashboard'}
                        >
                          {isActive ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className={styles.welcomeWidget}>
          <h2 className={styles.greeting}>{getGreeting()}, {displayName}</h2>
          <p className={styles.subtitle}>Welcome back to your workspace. All systems are fully operational.</p>
        </div>
      </div>

      {/* ── Draggable Widget Grid ───────────────────────────────────── */}
      {visibleWidgets.length === 0 ? (
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <h3>No widgets pinned</h3>
          <p>Click the <strong>+ Widgets</strong> button above to add widgets to your dashboard.</p>
        </div>
      ) : (
        <div className={styles.dashboardGrid}>
          {visibleWidgets.map((id, idx) => {
            const Widget = WIDGET_COMPONENTS[id];
            const def = WIDGET_DEFS[id];
            return (
              <div
                key={id}
                className={`${styles.widgetCard} ${dragIdx === idx ? styles.dragging : ''} ${overIdx === idx ? styles.dragOver : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.widgetHeader}>
                  <div className={styles.widgetDragHandle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.dragIcon}>
                      <line x1="8" y1="6" x2="16" y2="6" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                      <line x1="8" y1="18" x2="16" y2="18" />
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>
                    {def && <SvgIcon icon={def.icon} />}
                    {def?.title || id}
                  </h3>
                  <button
                    className={styles.removeWidgetBtn}
                    onClick={() => toggleWidget(id)}
                    title={`Remove ${def?.title || id}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className={styles.widgetBody}>
                  <Widget />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
