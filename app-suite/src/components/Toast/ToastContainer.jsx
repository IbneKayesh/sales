import React from 'react';
import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.container} aria-live="assertive" aria-relevant="additions">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
