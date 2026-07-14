import React from 'react';
import RunningApps from '../RunningApps/RunningApps';
import UserMenu from '../UserMenu/UserMenu';
import { IconGrid } from '@/assets/icons';
import styles from './AppBar.module.css';

const AppBar = ({ toggleLauncher, isLauncherOpen }) => {
  return (
    <header className={styles.appBar} aria-label="Top System Menu">
      <div className={styles.leftSection}>
        <button
          className={`${styles.launcherBtn} ${isLauncherOpen ? styles.launcherBtnActive : ''}`}
          onClick={toggleLauncher}
          aria-label="Open App Launcher"
          aria-expanded={isLauncherOpen}
        >
          <IconGrid className={styles.launcherIcon} />
        </button>
      </div>

      <div className={styles.centerSection}>
        <RunningApps />
      </div>

      <div className={styles.rightSection}>
        <UserMenu />
      </div>
    </header>
  );
};

export default AppBar;
