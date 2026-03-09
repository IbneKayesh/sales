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
const LoadingContext = createContext(null);
const NotificationContext = createContext(null);
const ToastContext = createContext(null);

// --- Component Definition for Loading Overlay ---
const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;
  return <LoadingSpinner fullScreen />;
};

// --- Main Provider Component ---
export const AppUIProvider = ({ children }) => {
  // Toast Ref
  const toast = useRef(null);

  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState([]);

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
    };
    setNotifications((prev) => [newNotification, ...prev]);
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

  // Memoized values to prevent unnecessary re-renders
  const loadingValue = useMemo(
    () => ({
      isLoading,
      setIsLoading,
    }),
    [isLoading],
  );

  const notificationValue = useMemo(
    () => ({
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    ],
  );

  const toastValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={toastValue}>
      <LoadingContext.Provider value={loadingValue}>
        <NotificationContext.Provider value={notificationValue}>
          <Toast ref={toast} />
          <LoadingOverlay isLoading={isLoading} />
          {children}
        </NotificationContext.Provider>
      </LoadingContext.Provider>
    </ToastContext.Provider>
  );
};

// --- Hooks ---
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an AppUIProvider");
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
