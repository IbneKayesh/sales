
import { useWindowManager } from '@/context/WindowManagerContext';
import { useContextMenu } from '@/context/DesktopContext';
import { getDockApps, getAppIcon } from '@/routes/appConfig';
import './Dock.css';
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
    <div className="dock-outer pos-absolute bottom-0 left-0 right-0 d-flex jc-center pointer-events-none z-100" style={{bottom:'10px'}}>
      <div className="dock d-flex ai-end gap-1 px-3 py-2" role="toolbar" aria-label="Application Dock" style={{pointerEvents:'auto'}}>
        {dockApps.map((app) => {
          const colors = app.color || DEFAULT_COLOR;
          const Icon = getAppIcon(app.id);
          const isOpen = openIds.has(app.id);
          return (
            <button
              key={app.id}
              className="dock-item pos-relative d-flex flex-column ai-center gap-1 p-1 cursor-pointer"
              onClick={() => handleClick(app.id)}
              onContextMenu={(e) => handleContextMenu(e, app)}
              title={app.label}
              aria-label={`${app.label}${isOpen ? ' (running)' : ''}`}
            >
              <span className="dock-tooltip">{app.label}</span>
              <div
                className="dock-icon d-flex ai-center jc-center w-44 h-44"
                style={{ backgroundColor: colors.bg, color: colors.color, borderRadius:'12px', transition:'all 0.2s ease' }}
              >
                {Icon ? <Icon /> : null}
              </div>
              {isOpen && <span className="dock-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
