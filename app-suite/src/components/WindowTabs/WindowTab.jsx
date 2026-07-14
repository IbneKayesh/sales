import React from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import { getAppIcon } from '@/routes/appConfig';
import styles from './WindowTab.module.css';

const WindowTab = ({ window: win }) => {
  const { activeWindowId, focusWindow, restoreWindow } = useWindowManager();

  const isActive = activeWindowId === win.id && !win.isMinimized;
  const Icon = getAppIcon(win.id);

  const handleClick = () => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <button
      className={`${styles.tab} ${isActive ? styles.tabActive : ''} ${win.isMinimized ? styles.tabMinimized : ''}`}
      onClick={handleClick}
      title={win.isMinimized ? `${win.title} (minimized)` : win.title}
      aria-label={win.title}
      aria-pressed={isActive}
    >
      <span className={styles.tabIcon}>
        {Icon ? <Icon /> : null}
      </span>
      <span className={styles.tabName}>{win.title}</span>
      {win.isMinimized && <span className={styles.minimizedDot} aria-hidden="true" />}
      <span className={`${styles.activeDot} ${isActive ? styles.activeDotVisible : ''}`} aria-hidden="true" />
    </button>
  );
};

export default WindowTab;
