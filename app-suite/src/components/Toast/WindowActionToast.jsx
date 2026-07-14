import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import styles from './WindowActionToast.module.css';

const WindowActionToast = ({ windowId }) => {
  const { toasts, removeToast } = useToast();

  const windowActionToasts = toasts.filter(
    (t) => t.isAction && (t.windowId === windowId || !t.windowId)
  );

  if (windowActionToasts.length === 0) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} />
      <div className={styles.center} aria-live="assertive">
        {windowActionToasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default WindowActionToast;
