import React, { useEffect } from 'react';
import { IconCheck, IconWarning, IconInfo, IconError, IconClose } from '@/assets/icons';
import styles from './Toast.module.css';

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return <IconCheck className={styles.iconSuccess} />;
    case 'error':
      return <IconError className={styles.iconError} />;
    case 'warning':
      return <IconWarning className={styles.iconWarning} />;
    case 'info':
    default:
      return <IconInfo className={styles.iconInfo} />;
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
        <div className={styles.actionGroup}>            {actionLabel && (
            <button className={isAction ? styles.okBtn : styles.actionBtn} onClick={handleAction}>
              {isAction && (
                <IconCheck className={styles.okIcon} />
              )}
              {actionLabel}
            </button>
          )}
          <button
            className={`${styles.closeBtn} ${isAction ? styles.closeBtnHidden : ''}`}
            onClick={handleDismiss}
            aria-label="Close Notification"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
