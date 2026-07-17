import { useState } from 'react';

import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu } from '@/context/DesktopContext';
import DesktopIcon from './DesktopIcon';
import Window from '../Window/Window';
import HomePage from '@/pages/HomePage';
import { appConfigById, getPageElement } from '@/routes/appConfig';
import './Desktop.css';
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
      className="desktop-workspace pos-relative w-100 h-100 overflow-hidden"
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {!hasOpenWindows && (
        <div className="dashboard-bg pos-absolute top-0 left-0 w-100 h-100 z-1 overflow-y-auto overflow-x-hidden">
          <HomePage />
        </div>
      )}

      <div className="desktop-icons pos-absolute top-4 right-4 z-5 d-flex flex-column flex-wrap gap-12" style={{maxHeight:'calc(100% - 32px)',alignContent:'flex-start'}}>
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

      <div className="desktop-windows pos-absolute top-0 left-0 w-100 h-100 pointer-events-none z-10">
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
