import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import styles from './WindowMenu.module.css';

const WindowMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);

  const {
    windows,
    closeAllWindows,
    minimizeAllWindows,
    restoreAllWindows,
  } = useWindowManager();

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const openCount = windows.filter((w) => w.isOpen && !w.isMinimized).length;
  const minimizedCount = windows.filter((w) => w.isMinimized).length;
  const hasOpen = openCount > 0 || minimizedCount > 0;

  const handleAction = (action) => {
    action();
    close();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
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
        aria-label="Window menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        Window
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu" aria-label="Window menu">
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Window Actions</span>
            {hasOpen && (
              <span className={styles.windowCount}>
                {openCount} open{minimizedCount > 0 ? `, ${minimizedCount} hidden` : ''}
              </span>
            )}
          </div>

          <div className={styles.menuList}>
            <button
              className={styles.menuItem}
              onClick={() => handleAction(restoreAllWindows)}
              disabled={minimizedCount === 0}
              role="menuitem"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className={styles.menuLabel}>Show All Windows</span>
              {minimizedCount === 0 && <span className={styles.menuHint}>No hidden windows</span>}
            </button>

            <button
              className={styles.menuItem}
              onClick={() => handleAction(minimizeAllWindows)}
              disabled={openCount === 0}
              role="menuitem"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <polyline points="7 10 12 5 17 10" />
              </svg>
              <span className={styles.menuLabel}>Hide All Windows</span>
              {openCount === 0 && <span className={styles.menuHint}>No open windows</span>}
            </button>

            <div className={styles.divider} />

            <button
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => handleAction(closeAllWindows)}
              disabled={!hasOpen}
              role="menuitem"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className={styles.menuLabel}>Close All Windows</span>
              {!hasOpen && <span className={styles.menuHint}>No windows open</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WindowMenu;
