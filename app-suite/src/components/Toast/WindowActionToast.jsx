import React from 'react';
import { useToast } from '@/context/FeedbackContext';
import Toast from './Toast';
import styles from './WindowActionToast.module.css';
import containerStyles from './ToastContainer.module.css';

const WindowActionToast = () => {
  const { toasts, removeToast } = useToast();

  const actionToasts = toasts.filter((t) => t.isAction);

  if (actionToasts.length === 0) return null;

  return (
    <div className={containerStyles.regularContainer}>
      {actionToasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};

export default WindowActionToast;
