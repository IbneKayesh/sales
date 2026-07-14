import React from 'react';
import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu } from '@/context/DesktopContext';
import { getDockApps, getAppIcon } from '@/routes/appConfig';
import styles from './Dock.module.css';

const DEFAULT_COLOR = { bg: 'rgba(255,255,255,0.08)', color: '#fff' };

const Dock = () => {
  const { windows, openWindow, closeWindow, minimizeWindow } = useWindowManager();
  const { showMenu } = useContextMenu();

  const dockApps = getDockApps();
  const openIds = new Set(windows.filter((w) => w.isOpen).map((w) => w.id));

  const handleClick = (id) => {
    openWindow(id);
  };

  const handleContextMenu = (e, app) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = openIds.has(app.id);
    showMenu(e.clientX, e.clientY, {
      type: 'dock',
      appId: app.id,
      appLabel: app.label,
      isOpen,
    });
  };

  return (
    <div className={styles.dockOuter}>
      <div className={styles.dock} role="toolbar" aria-label="Application Dock">
        {dockApps.map((app) => {
          const colors = app.color || DEFAULT_COLOR;
          const Icon = getAppIcon(app.id);
          const isOpen = openIds.has(app.id);
          return (
            <button
              key={app.id}
              className={styles.dockItem}
              onClick={() => handleClick(app.id)}
              onContextMenu={(e) => handleContextMenu(e, app)}
              title={app.label}
              aria-label={`${app.label}${isOpen ? ' (running)' : ''}`}
            >
              <span className={styles.tooltip}>{app.label}</span>
              <div
                className={styles.dockIcon}
                style={{ backgroundColor: colors.bg, color: colors.color }}
              >
                {Icon ? <Icon /> : null}
              </div>
              {isOpen && <span className={styles.dot} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
