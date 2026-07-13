import React, { useRef, useEffect } from 'react';
import { useContextMenu } from '../../context/ContextMenuContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDesktop } from '../../context/DesktopContext';
import { useToast } from '../../context/ToastContext';
import styles from './ContextMenu.module.css';

const ContextMenu = () => {
  const { menuState, closeMenu } = useContextMenu();
  const { openWindow } = useWindowManager();
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
