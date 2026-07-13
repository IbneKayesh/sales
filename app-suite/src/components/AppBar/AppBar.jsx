import React from 'react';
import RunningApps from '../RunningApps/RunningApps';
import UserMenu from '../UserMenu/UserMenu';
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
