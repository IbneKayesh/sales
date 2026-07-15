import React, { useState } from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu } from '@/context/DesktopContext';
import DesktopIcon from './DesktopIcon';
import Window from '../Window/Window';
import HomePage from '@/pages/HomePage';
import { getPageElement } from '@/routes/pageRegistry';
import { appConfigById } from '@/routes/appConfig';
import styles from './Desktop.module.css';

const Desktop = () => {
  const { windows, openWindow, recents } = useWindowManager();
  const { showMenu } = useContextMenu();
  const [selectedIconId, setSelectedIconId] = useState(null);

  const hasOpenWindows = windows.some((w) => w.isOpen && !w.isMinimized);

  const handleDesktopClick = () => setSelectedIconId(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  };

  return (
    <div
      className={styles.desktopWorkspace}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {!hasOpenWindows && (
        <div className={styles.dashboardBg}>
          <HomePage />
        </div>
      )}

      <div className={styles.iconsGrid}>
        {recents.map((id) => {
          const cfg = appConfigById[id];
          if (!cfg) return null;
          return (
            <DesktopIcon
              key={id}
              id={id}
              label={cfg.label || id}
              isSelected={selectedIconId === id}
              onClick={() => setSelectedIconId(id)}
              onDoubleClick={() => openWindow(id)}
            />
          );
        })}
      </div>

      <div className={styles.windowsContainer}>
        {windows.map((win) => (
          <Window key={win.id} {...win}>
            {getPageElement(win.id)}
          </Window>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
