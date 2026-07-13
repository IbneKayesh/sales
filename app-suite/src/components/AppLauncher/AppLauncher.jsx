import React, { useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import styles from './AppLauncher.module.css';

const appItems = [
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
];

const AppLauncher = ({ isOpen, closeLauncher }) => {
  const { openWindow } = useWindowManager();
  const launcherRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLauncher();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLauncher]);

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

  const handleLaunch = (id) => {
    openWindow(id);
    closeLauncher();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.launcher} ref={launcherRef} role="dialog" aria-modal="true" aria-label="Application Launcher">
        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search applications..."
            className={styles.searchInput}
            autoFocus
          />
        </div>

        <div className={styles.grid}>
          {appItems.map((app) => (
            <button
              key={app.id}
              className={`${styles.appCard} ${app.classStyle}`}
              onClick={() => handleLaunch(app.id)}
            >
              <div className={styles.iconContainer}>
                {app.icon}
              </div>
              <div className={styles.appInfo}>
                <div className={styles.appName}>{app.name}</div>
                <div className={styles.appDescription}>{app.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
