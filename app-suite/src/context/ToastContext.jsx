import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
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

  return (
    <ToastContext.Provider value={{ toasts, addToast, addActionToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
