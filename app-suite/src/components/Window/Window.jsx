import { useEffect, useRef } from 'react';

import { useWindowManager } from '../../context/WindowManagerContext';
import { getAppIcon } from '@/routes/appConfig';
import FeedbackDialog from '@/components/Feedback/FeedbackDialog';
import './Window.css';
const Window = ({ id, title, isOpen, isMinimized, isMaximized, x, y, width, height, zIndex, children }) => {
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, activeWindowId, updateWindowPosition } = useWindowManager();
  const windowRef = useRef(null);
  const isActive = activeWindowId === id;

  useEffect(() => {
    if (windowRef.current) {
      if (isMaximized) {
        windowRef.current.style.left = '0px';
        windowRef.current.style.top = '0px';
        windowRef.current.style.width = '100%';
        windowRef.current.style.height = '100%';
      } else {
        windowRef.current.style.left = `${x}px`;
        windowRef.current.style.top = `${y}px`;
        windowRef.current.style.width = `${width}px`;
        windowRef.current.style.height = `${height}px`;
      }
      windowRef.current.style.zIndex = zIndex;
    }
  }, [x, y, width, height, zIndex, isMaximized]);

  if (!isOpen || isMinimized) return null;

  const handleMouseDown = () => {
    focusWindow(id);
  };

  const handleHeaderMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('[class*="window-btn"]')) return;
    
    e.preventDefault();
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      if (newY < 0) newY = 0;

      updateWindowPosition(id, newX, newY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const IconComponent = getAppIcon(id);

  return (
    <div
      ref={windowRef}
      className={`window-container pos-absolute d-flex flex-column ${isActive ? 'window-active' : 'window-inactive'} ${isMaximized ? 'window-maximized' : ''}`}
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-label={`${title} window`}
    >
      <header
        className="window-header d-flex ai-center jc-between user-select-none"
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="window-controls d-flex ai-center gap-2">
          <button
            className={`window-btn close-btn`}
            onClick={() => closeWindow(id)}
            aria-label="Close window"
          >
            <span className="window-symbol">×</span>
          </button>
          <button
            className={`window-btn minimize-btn`}
            onClick={() => minimizeWindow(id)}
            aria-label="Minimize window"
          >
            <span className="window-symbol">−</span>
          </button>
          <button
            className={`window-btn maximize-btn`}
            onClick={() => toggleMaximize(id)}
            aria-label="Maximize window"
          >
            <span className="window-symbol">+</span>
          </button>
        </div>

        <div className="window-title d-flex ai-center gap-2 fs-13 fw-600">
          {IconComponent ? <IconComponent className="w-14 h-14" /> : null}
          <span className="text-nowrap">{title}</span>
        </div>
        
        <div style={{width:'52px'}} />
      </header>

      <div className="window-content flex-1 overflow-auto pos-relative">
        {children}
        <div className="window-overlay pos-absolute bottom-3 right-3 d-flex flex-column gap-2 z-10 pointer-events-none" style={{maxWidth:'360px'}}>
          <FeedbackDialog mode="window" windowId={id} />
        </div>
      </div>
    </div>
  );
};

export default Window;
