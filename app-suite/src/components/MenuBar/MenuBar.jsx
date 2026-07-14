import React from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import Clock from './Clock';
import SystemStatus from './SystemStatus';
import WindowMenu from './WindowMenu';
import WindowTabs from '../WindowTabs/WindowTabs';
import FullscreenToggle from '../FullscreenToggle/FullscreenToggle';
import UserMenu from '../UserMenu/UserMenu';
import { IconGrid } from '@/assets/icons';
import styles from './MenuBar.module.css';

const menuItems = ['File', 'Edit', 'View', 'Help'];

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
          <IconGrid className={styles.launcherIcon} />
        </button>

        <span className={styles.activeAppName}>{activeAppName}</span>

        <nav className={styles.staticMenu} aria-label="Application Menu">
          {menuItems.map((item) => (
            <button key={item} className={styles.menuItemBtn}>
              {item}
            </button>
          ))}
          <WindowMenu />
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
