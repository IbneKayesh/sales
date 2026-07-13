import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import Clock from './Clock';
import SystemStatus from './SystemStatus';
import WindowTabs from '../WindowTabs/WindowTabs';
import FullscreenToggle from '../FullscreenToggle/FullscreenToggle';
import UserMenu from '../UserMenu/UserMenu';
import styles from './MenuBar.module.css';

const menuItems = ['File', 'Edit', 'View', 'Window', 'Help'];

const MenuBar = ({ toggleLauncher, isLauncherOpen }) => {
  const { activeWindowId, windows } = useWindowManager();

  const activeWindow = windows.find(
    (win) => win.id === activeWindowId && win.isOpen && !win.isMinimized
  );
  const activeAppName = activeWindow ? activeWindow.title : 'Desktop';

  return (
    <header className={styles.menuBar} aria-label="System Menu Bar">
      <div className={styles.leftSection}>
        <button
          className={`${styles.launcherBtn} ${isLauncherOpen ? styles.launcherBtnActive : ''}`}
          onClick={toggleLauncher}
          aria-label="Open App Launcher"
          aria-expanded={isLauncherOpen}
        >
          <svg
            className={styles.launcherIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="2" />
            <circle cx="12" cy="5" r="2" />
            <circle cx="19" cy="5" r="2" />
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="12" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
        </button>

        <span className={styles.activeAppName}>{activeAppName}</span>

        <nav className={styles.staticMenu} aria-label="Application Menu">
          {menuItems.map((item) => (
            <button key={item} className={styles.menuItemBtn}>
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.centerSection}>
        <WindowTabs />
      </div>

      <div className={styles.rightSection}>
        <SystemStatus />
        <span className={styles.divider} />
        <Clock />
        <span className={styles.divider} />
        <FullscreenToggle />
        <span className={styles.divider} />
        <UserMenu />
      </div>
    </header>
  );
};

export default MenuBar;
