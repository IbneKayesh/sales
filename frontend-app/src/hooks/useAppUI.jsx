import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Toast } from "primereact/toast";

// --- Context Definitions ---
const BusyContext = createContext(null);
const NotificationContext = createContext(null);
const ToastContext = createContext(null);

// --- Component Definition for Loading Overlay ---
const LoadingOverlay = ({ isBusy }) => {
  if (!isBusy) return null;
  return <LoadingSpinner fullScreen />;
};

// --- Main Provider Component ---
export const AppUIProvider = ({ children }) => {
  // Toast Ref
  const toast = useRef(null);

  // Loading State
  const [isBusy, setIsBusy] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [changesLog, setChangesLog] = useState([]);

  // Toast Action
  const showToast = useCallback((severity, summary, detail, life = 3000) => {
    toast.current?.show({ severity, summary, detail, life });
  }, []);

  // Memoized Notification actions
  const addNotification = useCallback((title, message, type = "info") => {
    const newNotification = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
      fromUser: "",
      toUser: "",
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const addChangesLog = useCallback((message, type = "info") => {
    const newLog = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message,
      type,
      timestamp: new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
    };
    setChangesLog((prev) => [newLog, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearChangesLog = useCallback(() => {
    setChangesLog([]);
  }, []);

  // Unified Notify Helper
  const notify = useCallback(
    ({
      severity = "info",
      summary = "Info",
      detail = "",
      toast = true,
      notification = false,
      log = false,
    }) => {
      // 1. Show Toast
      if (toast) {
        showToast(severity, summary, detail);
      }

      // 2. Add to Notifications (Important info)
      if (notification) {
        addNotification(summary, detail, severity);
      }

      // 3. Add to Changes Log (Audit trail)
      if (log) {
        addChangesLog(`${summary} - ${detail}`, severity);
      }
    },
    [showToast, addNotification, addChangesLog],
  );

  // Memoized values to prevent unnecessary re-renders
  const loadingValue = useMemo(
    () => ({
      isBusy,
      setIsBusy,
    }),
    [isBusy],
  );

  const notificationValue = useMemo(
    () => ({
      notifications,
      changesLog,
      addNotification,
      addChangesLog,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      clearChangesLog,
      notify,
    }),
    [
      notifications,
      changesLog,
      addNotification,
      addChangesLog,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      clearChangesLog,
      notify,
    ],
  );

  const toastValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={toastValue}>
      <BusyContext.Provider value={loadingValue}>
        <NotificationContext.Provider value={notificationValue}>
          <Toast ref={toast} />
          <LoadingOverlay isBusy={isBusy} />
          {children}
        </NotificationContext.Provider>
      </BusyContext.Provider>
    </ToastContext.Provider>
  );
};

// --- Hooks ---
export const useBusy = () => {
  const context = useContext(BusyContext);
  if (!context) {
    throw new Error("useBusy must be used within an AppUIProvider");
  }
  return context;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within an AppUIProvider");
  }
  return context;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within an AppUIProvider");
  }
  return context;
};
