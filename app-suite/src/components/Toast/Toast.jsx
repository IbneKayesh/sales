import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return (
        <svg className={styles.iconSuccess} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'error':
      return (
        <svg className={styles.iconError} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={styles.iconWarning} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'info':
    default:
      return (
        <svg className={styles.iconInfo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

const Toast = ({ toast, onClose }) => {
  const { id, message, type, duration, actionLabel, onAction, isAction } = toast;

  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const handleAction = () => {
    if (onAction) onAction();
    onClose(id);
  };

  const handleDismiss = () => {
    if (isAction) return;
    onClose(id);
  };

  const timerStyle = isAction || duration === Infinity
    ? {}
    : { animationDuration: `${duration}ms` };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isAction ? styles.actionToast : ''}`} role="alert">
      {!isAction && duration !== Infinity && (
        <div className={styles.timerBar}>
          <span className={styles.timerFill} style={timerStyle} />
        </div>
      )}
      <div className={styles.toastBody}>
        <div className={styles.iconContainer}>{getToastIcon(type)}</div>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actionGroup}>
          {actionLabel && (
            <button className={isAction ? styles.okBtn : styles.actionBtn} onClick={handleAction}>
              {isAction && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.okIcon}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {actionLabel}
            </button>
          )}
          <button
            className={`${styles.closeBtn} ${isAction ? styles.closeBtnHidden : ''}`}
            onClick={handleDismiss}
            aria-label="Close Notification"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
