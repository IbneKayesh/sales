import React, { useRef, useEffect } from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu, useDesktop } from '@/context/DesktopContext';
import { useToast } from '@/context/FeedbackContext';
import styles from './ContextMenu.module.css';

const ContextMenu = () => {
  const { menuState, closeMenu } = useContextMenu();
  const { openWindow, closeWindow, minimizeWindow } = useWindowManager();
  const { resetPositions, clearRecentApps, resetLayout } = useDesktop();
  const { addToast } = useToast();
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuState || !menuRef.current) return;
    
    const menuEl = menuRef.current;
    const { x, y } = menuState;
    const rect = menuEl.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + rect.width > screenWidth) {
      adjustedX = x - rect.width;
    }
    if (y + rect.height > screenHeight) {
      adjustedY = y - rect.height;
    }

    menuEl.style.left = `${adjustedX}px`;
    menuEl.style.top = `${adjustedY}px`;
  }, [menuState]);

  if (!menuState) return null;

  const handleAction = (callback) => {
    callback();
    closeMenu();
  };

  const ctx = menuState.context;

  // ── Dock context menu ──────────────────────────────────────────────
  if (ctx?.type === 'dock') {
    return (
      <div
        ref={menuRef}
        className={styles.menu}
        role="menu"
        tabIndex="-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`${styles.menuItem} ${styles.menuHeader}`}
          role="menuitem"
          disabled
        >
          <span className={styles.headerLabel}>{ctx.appLabel}</span>
        </button>

        <div className={styles.separator} />

        <button
          className={styles.menuItem}
          role="menuitem"
          onClick={() => handleAction(() => openWindow(ctx.appId))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Open</span>
          {ctx.isOpen && <span className={styles.shortcut}>⌘O</span>}
        </button>

        <button
          className={styles.menuItem}
          role="menuitem"
          onClick={() => {
            handleAction(() => {
              openWindow('files');
              addToast({ message: `Opening location of ${ctx.appLabel}...`, type: 'info' });
            });
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>Show in Finder</span>
        </button>

        {ctx.isOpen && (
          <>
            <div className={styles.separator} />

            <button
              className={styles.menuItem}
              role="menuitem"
              onClick={() => handleAction(() => minimizeWindow(ctx.appId))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Minimize</span>
              <span className={styles.shortcut}>⌘M</span>
            </button>

            <button
              className={`${styles.menuItem} ${styles.danger}`}
              role="menuitem"
              onClick={() => handleAction(() => closeWindow(ctx.appId))}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.menuIcon}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Quit</span>
              <span className={styles.shortcut}>⌘Q</span>
            </button>
          </>
        )}
      </div>
    );
  }

  // ── Desktop context menu ───────────────────────────────────────────
  return (
    <div
      ref={menuRef}
      className={styles.menu}
      role="menu"
      tabIndex="-1"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => openWindow('settings'))}
      >
        <span>Open System Settings</span>
      </button>

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => window.location.reload())}
      >
        <span>Reload Application</span>
      </button>

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => openWindow('settings'))}
      >
        <span>Go to User Profile</span>
      </button>

      <div className={styles.separator} />

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => {
          addToast({ message: 'Desktop refreshed successfully', type: 'success' });
        })}
      >
        <span>Refresh Desktop</span>
      </button>

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => {
          addToast({ message: 'New folder placeholder created', type: 'info' });
        })}
      >
        <span>New Folder</span>
      </button>

      <div className={styles.separator} />

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => {
          resetPositions();
          addToast({ message: 'Desktop layout reset to default', type: 'info' });
        })}
      >
        <span>Reset Desktop Layout</span>
      </button>

      <button
        className={styles.menuItem}
        role="menuitem"
        onClick={() => handleAction(() => {
          clearRecentApps();
          addToast({ message: 'Recent application shortcuts cleared', type: 'success' });
        })}
      >
        <span>Clear Recent Applications</span>
      </button>
      
      <button
        className={`${styles.menuItem} ${styles.danger}`}
        role="menuitem"
        onClick={() => handleAction(() => {
          resetLayout();
          addToast({ message: 'Desktop system configuration fully reset', type: 'warning' });
        })}
      >
        <span>Reset System Preferences</span>
      </button>
    </div>
  );
};

export default ContextMenu;
