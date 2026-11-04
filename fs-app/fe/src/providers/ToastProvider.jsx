import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./toastContext";
import { ToastViewport } from "../components/ui/ToastViewport";

let nextToastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast))
    );

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 200);
  }, []);

  const push = useCallback(
    (message, tone = "info", duration = 3500) => {
      const id = ++nextToastId;
      setToasts((current) => [...current, { id, message, tone, leaving: false }]);
      timers.current[id] = window.setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const confirm = useCallback(
    ({ title, message, confirmLabel = "Yes", cancelLabel = "No", onConfirm }) => {
      const id = ++nextToastId;

      setToasts((current) => [
        ...current,
        {
          id,
          tone: "confirm",
          title,
          message,
          confirmLabel,
          cancelLabel,
          onConfirm,
          leaving: false,
        },
      ]);

      return id;
    },
    []
  );

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => {
      Object.values(pendingTimers).forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      dismiss,
      confirm,
      success: (message, duration) => push(message, "success", duration),
      error: (message, duration) => push(message, "error", duration ?? 5000),
      info: (message, duration) => push(message, "info", duration),
    }),
    [toasts, dismiss, confirm, push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
