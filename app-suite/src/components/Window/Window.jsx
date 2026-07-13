import React, { useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
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

  const getAppIcon = () => {
    switch (id) {
      case 'files':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.appIcon}>
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
      case 'gallery':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.appIcon}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      case 'settings':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.appIcon}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'documents':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.appIcon}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
      default:
        return null;
    }
  };

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
          {getAppIcon()}
          <span className={styles.titleText}>{title}</span>
        </div>
        
        <div className={styles.headerSpacer} />
      </header>

      <div className={styles.windowContent}>
        {children}
      </div>
    </div>
  );
};

export default Window;
