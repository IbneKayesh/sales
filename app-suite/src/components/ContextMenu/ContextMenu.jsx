import React, { useRef, useEffect } from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu, useDesktop } from '@/context/DesktopContext';
import { useToast } from '@/context/FeedbackContext';
import { IconHomeSimple, IconFolderOpen, IconMinus, IconClose } from '@/assets/icons';
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
          <IconHomeSimple className={styles.menuIcon} />
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
          <IconFolderOpen className={styles.menuIcon} />
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
              <IconMinus className={styles.menuIcon} />
              <span>Minimize</span>
              <span className={styles.shortcut}>⌘M</span>
            </button>

            <button
              className={`${styles.menuItem} ${styles.danger}`}
              role="menuitem"
              onClick={() => handleAction(() => closeWindow(ctx.appId))}
            >
              <IconClose className={styles.menuIcon} />
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
