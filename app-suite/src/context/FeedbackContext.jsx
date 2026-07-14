import React, { createContext, useContext, useState, useCallback } from 'react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  // ── Toast state ──────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000, actionLabel, onAction }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration, actionLabel, onAction }]);
    return id;
  }, []);

  const addActionToast = useCallback((message, type = 'info', windowId = null) => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, {
        id,
        message,
        type,
        duration: Infinity,
        windowId,
        actionLabel: 'OK',
        onAction: () => resolve(true),
        isAction: true,
      }]);
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Confirm dialog state ─────────────────────────────────────────────────
  const [dialogState, setDialogState] = useState(null);

  const confirm = useCallback((title, description, options = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        title,
        description,
        resolve,
        windowId: options.windowId || null,
        action: null,
        options,
      });
    });
  }, []);

  const confirmWithAction = useCallback((title, description, action, options = {}) => {
    return new Promise((resolve) => {
      setDialogState({
        title,
        description,
        resolve,
        windowId: options.windowId || null,
        action,
        options,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (dialogState) {
      dialogState.resolve(true);
      setDialogState(null);
    }
  }, [dialogState]);

  const handleCancel = useCallback(() => {
    if (dialogState) {
      dialogState.resolve(false);
      setDialogState(null);
    }
  }, [dialogState]);

  return (
    <FeedbackContext.Provider
      value={{
        // Toast APIs
        toasts,
        addToast,
        addActionToast,
        removeToast,
        // Confirm APIs
        dialogState,
        confirm,
        confirmWithAction,
        handleConfirm,
        handleCancel,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useToast must be used within a FeedbackProvider');
  }
  return context;
};

export const useConfirm = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useConfirm must be used within a FeedbackProvider');
  }
  return context;
};
