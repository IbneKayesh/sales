import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const regularToasts = toasts.filter((t) => !t.isAction);

  if (regularToasts.length === 0) return null;

  return (
    <div className={styles.regularContainer} aria-live="polite" aria-relevant="additions">
      {regularToasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
