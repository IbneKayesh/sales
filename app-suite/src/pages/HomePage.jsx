import { useState, useEffect, useCallback, useRef } from 'react';

import { useAuth } from '../context/AuthContext';
import { useDesktop } from '../context/DesktopContext';
import { useToast } from '@/context/FeedbackContext';
import { fmtDateFull } from '@/utils/dataFormat';
import { IconMonitor, IconDollar, IconClock, IconZap, IconPlus, IconFile, IconBox, IconChart, IconGridRect, IconCheck, IconDrag, IconClose } from '@/assets/icons';
import './HomePage.css';
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
      return <IconMonitor className="cardIcon" />;
    case 'dollar':
      return <IconDollar className="cardIcon" />;
    case 'clock':
      return <IconClock className="cardIcon" />;
    case 'zap':
      return <IconZap className="cardIcon" />;
    default:
      return null;
  }
};

// ── Individual Widget Components ──────────────────────────────────────────

const SystemStatusWidget = () => (
  <div className="statusList">
    <div className="statusItem">
      <div className="statusLabel">
        <span>CPU Usage</span>
        <span>28%</span>
      </div>
      <div className="progressBar">
        <div className={`progressFill progressCpu`} />
      </div>
    </div>
    <div className="statusItem">
      <div className="statusLabel">
        <span>Memory</span>
        <span>4.2 GB / 16 GB</span>
      </div>
      <div className="progressBar">
        <div className={`progressFill progressMem`} />
      </div>
    </div>
    <div className="statusItem">
      <div className="statusLabel">
        <span>Storage</span>
        <span>124 GB / 512 GB</span>
      </div>
      <div className="progressBar">
        <div className={`progressFill progressStorage`} />
      </div>
    </div>
  </div>
);

const SalesSummaryWidget = () => (
  <div className="statsGrid">
    <div className="statItem">
      <span className="statValue">$24,580</span>
      <span className="statLabel">Total Revenue</span>
      <span className={`statTrend trendUp`}>+12.3%</span>
    </div>
    <div className="statItem">
      <span className="statValue">47</span>
      <span className="statLabel">Orders</span>
      <span className={`statTrend trendUp`}>+8</span>
    </div>
    <div className="statItem">
      <span className="statValue">12</span>
      <span className="statLabel">Pending</span>
      <span className={`statTrend trendNeutral`}>= 0</span>
    </div>
    <div className="statItem">
      <span className="statValue">$3,420</span>
      <span className="statLabel">Avg. Order</span>
      <span className={`statTrend trendUp`}>+5.7%</span>
    </div>
  </div>
);

const RecentActivityWidget = () => (
  <div className="activityList">
    <div className="activityItem">
      <div className={`activityDot dotSuccess`} />
      <div className="activityText">
        <span className="activityTitle">Sale completed</span>
        <span className="activityMeta">Invoice INV-001 • 2 min ago</span>
      </div>
    </div>
    <div className="activityItem">
      <div className={`activityDot dotWarning`} />
      <div className="activityText">
        <span className="activityTitle">Low stock alert</span>
        <span className="activityMeta">AIU-005: 8 remaining • 15 min ago</span>
      </div>
    </div>
    <div className="activityItem">
      <div className={`activityDot dotInfo`} />
      <div className="activityText">
        <span className="activityTitle">Order shipped</span>
        <span className="activityMeta">ORD-004 via DHL • 1 hour ago</span>
      </div>
    </div>
    <div className="activityItem">
      <div className={`activityDot dotSuccess`} />
      <div className="activityText">
        <span className="activityTitle">Inventory updated</span>
        <span className="activityMeta">12 new items added • Yesterday</span>
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
        return <IconPlus />;
      case 'file':
        return <IconFile />;
      case 'box':
        return <IconBox />;
      case 'chart':
        return <IconChart />;
      default:
        return null;
    }
  };
  return (
    <div className="actionsGrid">
      {actions.map((a) => (
        <button key={a.label} className="actionBtn" onClick={() => addToast({ message: `Opening ${a.label}...`, type: 'info' })}>
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
      if (e.target) e.target.closest(`.widgetCard`)?.classList.add('dragging');
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
    document.querySelectorAll(`.dragging`).forEach((el) => el.classList.remove('dragging'));
  }, [dragIdx, widgetOrder, setWidgetOrder]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
    setOverIdx(null);
    document.querySelectorAll(`.dragging`).forEach((el) => el.classList.remove('dragging'));
  }, []);

  const displayName = currentUser?.displayName || 'Guest';

  return (
    <div className="container">
      {/* ── Hero Section ────────────────────────────────────────────── */}
      <div className="heroSection">
        <div className="heroTopRow">
          <div className="timeWidget">
            <h1 className="clock">{formatTime(time)}</h1>
            <p className="date">{fmtDateFull(time)}</p>
          </div>
          <div className="widgetToolbar">
            <button
              className="addWidgetBtn"
              onClick={() => setShowPicker((p) => !p)}
              title="Customize widgets"
            >
              <IconPlus />
              <span>Widgets</span>
            </button>

            {showPicker && (
              <div className="widgetPicker" ref={pickerRef}>
                <div className="pickerHeader">
                  <IconGridRect className="pickerIcon" />
                  Customize Dashboard
                </div>
                <p className="pickerHint">Drag widgets to reorder. Toggle to show/hide.</p>
                {allWidgets.map((id) => {
                  const def = WIDGET_DEFS[id];
                  const isActive = visibleWidgets.includes(id);
                  const idx = visibleWidgets.indexOf(id);
                  return (
                    <div key={id} className="pickerRow">
                      <div className="pickerInfo">
                        {def && <SvgIcon icon={def.icon} />}
                        <div className="pickerText">
                          <span className="pickerName">{def?.title || id}</span>
                          <span className="pickerDesc">{def?.description}</span>
                        </div>
                      </div>
                      <div className="pickerControls">
                        <span className="pickerPos">#{idx + 1}</span>
                        <button
                          className={`pinBtn ${isActive ? 'pinBtnActive' : ''}`}
                          onClick={() => toggleWidget(id)}
                          title={isActive ? 'Remove from dashboard' : 'Add to dashboard'}
                        >
                          {isActive ? (
                            <IconCheck />
                          ) : (
                            <IconPlus />
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
        <div className="welcomeWidget">
          <h2 className="greeting">{getGreeting()}, {displayName}</h2>
          <p className="subtitle">Welcome back to your workspace. All systems are fully operational.</p>
        </div>
      </div>

      {/* ── Draggable Widget Grid ───────────────────────────────────── */}
      {visibleWidgets.length === 0 ? (
        <div className="emptyState">
          <IconGridRect className="emptyIcon" />
          <h3>No widgets pinned</h3>
          <p>Click the <strong>+ Widgets</strong> button above to add widgets to your dashboard.</p>
        </div>
      ) : (
        <div className="dashboardGrid">
          {visibleWidgets.map((id, idx) => {
            const Widget = WIDGET_COMPONENTS[id];
            const def = WIDGET_DEFS[id];
            return (
              <div
                key={id}
                className={`widgetCard ${dragIdx === idx ? 'dragging' : ''} ${overIdx === idx ? 'dragOver' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
              >
                <div className="widgetHeader">
                  <div className="widgetDragHandle">
                    <IconDrag className="dragIcon" />
                  </div>
                  <h3 className="cardTitle">
                    {def && <SvgIcon icon={def.icon} />}
                    {def?.title || id}
                  </h3>
                  <button
                    className="removeWidgetBtn"
                    onClick={() => toggleWidget(id)}
                    title={`Remove ${def?.title || id}`}
                  >
                    <IconClose />
                  </button>
                </div>
                <div className="widgetBody">
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
