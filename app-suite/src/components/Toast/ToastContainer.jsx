import React from 'react';
import { useToast } from '@/context/FeedbackContext';
import Toast from './Toast';
import styles from './Toast.module.css';

/**
 * ToastContainer — renders toast notifications.
 *
 * Props:
 *   mode    'global' (default) | 'window'
 *     global: fixed top-right, all toasts
 *     window: absolute inside parent, only action toasts matching windowId
 *   windowId  string (required when mode='window')
 *
 * @example
 *   // Global (rendered once in FeedbackDialog)
 *   <ToastContainer />
 *
 *   // In-window (rendered inside a Window for scoped action toasts)
 *   <ToastContainer mode="window" windowId="products" />
 */
const ToastContainer = ({ mode = 'global', windowId }) => {
  const { toasts, removeToast } = useToast();

  const filtered = mode === 'window'
    // Window mode: only action toasts targeting this specific window
    ? toasts.filter((t) => t.isAction && t.windowId === windowId)
    // Global mode: all toasts EXCEPT window-scoped action toasts
    : toasts.filter((t) => !(t.isAction && t.windowId));

  if (filtered.length === 0) return null;

  const containerClass = mode === 'window' ? styles.windowContainer : styles.regularContainer;

  return (
    <div className={containerClass} aria-live="polite" aria-relevant="additions">
      {filtered.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
