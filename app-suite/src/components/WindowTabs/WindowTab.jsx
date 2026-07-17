
import { useWindowManager } from '@/context/WindowManagerContext';
import { getAppIcon } from '@/routes/appConfig';
import './WindowTab.css';
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
      className={`tab ${isActive ? 'tabActive' : ''} ${win.isMinimized ? 'tabMinimized' : ''}`}
      onClick={handleClick}
      title={win.isMinimized ? `${win.title} (minimized)` : win.title}
      aria-label={win.title}
      aria-pressed={isActive}
    >
      <span className="tabIcon">
        {Icon ? <Icon /> : null}
      </span>
      <span className="tabName">{win.title}</span>
      {win.isMinimized && <span className="minimizedDot" aria-hidden="true" />}
      <span className={`activeDot ${isActive ? 'activeDotVisible' : ''}`} aria-hidden="true" />
    </button>
  );
};

export default WindowTab;
