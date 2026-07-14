import React from 'react';
import Toast from '../Toast/Toast';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import styles from '../Toast/ToastContainer.module.css';

// ── Renamed imports to avoid collision ─────────────────────────────────────
import ConfirmDialogInner from '../Confirm/ConfirmDialog';

/**
 * Renders both toast notifications and confirmation dialogs from a single
 * FeedbackProvider. This replaces separate ToastContainer + ConfirmDialog.
 */
const FeedbackDialog = () => {
  // Toast part
  const { toasts, removeToast } = useToast();
  const regularToasts = toasts.filter((t) => !t.isAction);

  // Confirm part is handled by the existing ConfirmDialog component
  // which reads from the same FeedbackContext
  return (
    <>
      {/* Toast notifications (top-right) */}
      {regularToasts.length > 0 && (
        <div className={styles.regularContainer} aria-live="polite" aria-relevant="additions">
          {regularToasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      )}

      {/* Confirm dialog (centered overlay) */}
      <ConfirmDialogInner />
    </>
  );
};

export default FeedbackDialog;
