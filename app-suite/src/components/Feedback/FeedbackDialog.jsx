import React from 'react';
import ToastContainer from '../Toast/ToastContainer';
import ConfirmDialogInner from '../Confirm/ConfirmDialog';

/**
 * Renders both toast notifications and confirmation dialogs from a single
 * FeedbackProvider. This replaces separate ToastContainer + ConfirmDialog.
 */
const FeedbackDialog = () => {
  return (
    <>
      {/* Toast notifications (handles regular + action toasts) */}
      <ToastContainer />

      {/* Confirm dialog (centered overlay) */}
      <ConfirmDialogInner />
    </>
  );
};

export default FeedbackDialog;
