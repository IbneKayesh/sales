// ToastContext.js - Toast notification context provider
import React, { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/Toast.jsx";

const ToastContext = createContext(null);


// Generate unique ID for each toast
const generateId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);


  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  // Helper methods for common toast types
  const success = useCallback(
    (message, duration) => addToast(message, "success", duration),
    [addToast],
  );
  const error = useCallback(
    (message, duration) => addToast(message, "error", duration),
    [addToast],
  );
  const warning = useCallback(
    (message, duration) => addToast(message, "warning", duration),
    [addToast],
  );
  const info = useCallback(
    (message, duration) => addToast(message, "info", duration),
    [addToast],
  );

  return React.createElement(
    ToastContext.Provider,
    {
      value: { addToast, removeToast, success, error, warning, info },
    },
    children,
    React.createElement(
      "div",
      { className: "toast-container", "aria-live": "polite" },
      toasts.map((toast) =>
        React.createElement(Toast, {
          key: toast.id,
          id: toast.id,
          type: toast.type,
          message: toast.message,
          duration: toast.duration,
          onClose: removeToast,
        }),
      ),
    ),
  );

};

// Custom hook to use toast notifications
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
