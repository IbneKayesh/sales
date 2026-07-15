import React, { useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { getAppIcon } from '@/routes/appConfig';
import ConfirmDialog from '../Confirm/ConfirmDialog';
import ToastContainer from '../Toast/ToastContainer';
import styles from './Window.module.css';

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
    if (e.target.closest('[class*="controlBtn"]')) return;
    
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
      className={`${styles.windowContainer} ${isActive ? styles.windowActive : styles.windowInactive} ${isMaximized ? styles.windowMaximized : ''}`}
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-label={`${title} window`}
    >
      <header
        className={styles.windowHeader}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className={styles.windowControls}>
          <button
            className={`${styles.controlBtn} ${styles.closeBtn}`}
            onClick={() => closeWindow(id)}
            aria-label="Close window"
          >
            <span className={styles.controlSymbol}>×</span>
          </button>
          <button
            className={`${styles.controlBtn} ${styles.minimizeBtn}`}
            onClick={() => minimizeWindow(id)}
            aria-label="Minimize window"
          >
            <span className={styles.controlSymbol}>−</span>
          </button>
          <button
            className={`${styles.controlBtn} ${styles.maximizeBtn}`}
            onClick={() => toggleMaximize(id)}
            aria-label="Maximize window"
          >
            <span className={styles.controlSymbol}>+</span>
          </button>
        </div>

        <div className={styles.titleArea}>
          {IconComponent ? <IconComponent className={styles.appIcon} /> : null}
          <span className={styles.titleText}>{title}</span>
        </div>
        
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.windowContent}>
        {children}
        <div className={styles.windowOverlayContainer}>
          <ConfirmDialog windowed />
          <ToastContainer mode="window" windowId={id} />
        </div>
      </div>
    </div>
  );
};

export default Window;
