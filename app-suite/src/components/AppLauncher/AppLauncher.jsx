import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import styles from './AppLauncher.module.css';

// ── Back arrow icon ───────────────────────────────────────────────────────
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.backIcon}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// ── App Items (flat + groups with children) ───────────────────────────────
const appItems = [
  {
    id: 'home',
    name: 'Home',
    description: 'Dashboard with system overview and widgets.',
    classStyle: styles.cardHome,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'files',
    name: 'Finder',
    description: 'Manage files, folders, and resources.',
    classStyle: styles.cardFiles,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'gallery',
    name: 'System Gallery',
    description: 'Browse photos, illustrations, and videos.',
    classStyle: styles.cardGallery,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Configure desktop environment options.',
    classStyle: styles.cardSettings,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Read and check system document files.',
    classStyle: styles.cardDocuments,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    id: 'sales',
    name: 'Sales',
    description: 'Overview of sales transactions',
    classStyle: styles.cardSales,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    children: [
      {
        id: 'sales.orders',
        name: 'Orders',
        description: 'View and manage customer orders',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
      {
        id: 'sales.invoices',
        name: 'Invoices',
        description: 'Manage billing and payments',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        ),
      },
      {
        id: 'sales.delivery',
        name: 'Delivery',
        description: 'Track shipments and deliveries',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        ),
      },
      {
        id: 'sales.reports',
        name: 'Reports',
        description: 'Sales analytics and performance data',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Track products, stock levels, and pricing.',
    classStyle: styles.cardInventory,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'purchase',
    name: 'Purchase',
    description: 'Manage procurement and vendor orders.',
    classStyle: styles.cardPurchase,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'hr',
    name: 'HR',
    description: 'Manage employees and departments.',
    classStyle: styles.cardHR,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer relationship management.',
    classStyle: styles.cardCRM,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'profile',
    name: 'Profile Settings',
    description: 'Edit your profile and change password.',
    classStyle: styles.cardProfile,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'View system notifications and alerts.',
    classStyle: styles.cardNotifications,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

// ── AppLauncher Component ──────────────────────────────────────────────────
const AppLauncher = ({ isOpen, closeLauncher }) => {
  const { openWindow } = useWindowManager();
  const launcherRef = useRef(null);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Reset when closing
  useEffect(() => {
    if (!isOpen) {
      setActiveGroupId(null);
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeGroupId) {
          setActiveGroupId(null);
        } else {
          closeLauncher();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLauncher, activeGroupId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target)) {
        if (!e.target.closest('[aria-label="Open App Launcher"]')) {
          closeLauncher();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeLauncher]);

  const handleLaunch = useCallback((id) => {
    openWindow(id);
    closeLauncher();
  }, [openWindow, closeLauncher]);

  const openGroup = useCallback((id) => {
    setActiveGroupId(id);
  }, []);

  const goBack = useCallback(() => {
    setActiveGroupId(null);
  }, []);

  // Find the active group
  const activeGroup = activeGroupId ? appItems.find((a) => a.id === activeGroupId) : null;
  const isInSubView = !!activeGroup;

  // ── Filter items based on search ──────────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const displayedItems = (() => {
    const source = isInSubView ? activeGroup.children || [] : appItems;
    if (!q) return source;
    return source.filter((item) => {
      const matches = item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      if (!isInSubView && item.children) {
        return matches || item.children.some(
          (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
      }
      return matches;
    });
  })();

  return (
    <div className={styles.overlay}>
      <div className={styles.launcher} ref={launcherRef} role="dialog" aria-modal="true" aria-label="Application Launcher">
        {/* ── Header with back button ──────────────────────────────────── */}
        <div className={styles.header}>
          {isInSubView && (
            <button className={styles.backBtn} onClick={goBack} aria-label="Back to all apps">
              <BackIcon />
            </button>
          )}
          <div className={styles.headerInfo}>
            <h2 className={styles.headerTitle}>
              {isInSubView ? activeGroup.name : 'Apps'}
            </h2>
            <span className={styles.headerCount}>
              {displayedItems.length} {displayedItems.length === 1 ? 'app' : 'apps'}
            </span>
          </div>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* ── Icon Grid (Android style) ────────────────────────────────── */}
        <div className={styles.iconGrid}>
          {displayedItems.length === 0 ? (
            <div className={styles.emptyState}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.emptyIcon}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p>No apps found</p>
            </div>
          ) : (
            displayedItems.map((item) => {
              const isGroup = !isInSubView && item.children;
              return (
                <button
                  key={item.id}
                  className={`${styles.iconCard} ${item.classStyle || (isInSubView && activeGroup?.classStyle) || styles.cardDefault}`}
                  onClick={() => (isGroup ? openGroup(item.id) : handleLaunch(item.id))}
                  title={item.description}
                >
                  <div className={styles.iconCircle}>
                    {item.icon}
                  </div>
                  <span className={styles.iconLabel}>{item.name}</span>
                  {isGroup && (
                    <span className={styles.childCountBadge}>{item.children.length}</span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            Press <kbd className={styles.kbd}>Esc</kbd> to {isInSubView ? 'go back' : 'close'}
          </span>
          {isInSubView && (
            <button className={styles.footerBackBtn} onClick={goBack}>
              <BackIcon />
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
