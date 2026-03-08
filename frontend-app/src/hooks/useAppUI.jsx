import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { ProgressSpinner } from "primereact/progressspinner";

// --- Context Definitions ---
const LoadingContext = createContext(null);
const NotificationContext = createContext(null);

// --- Component Definition for Loading Overlay ---
const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div
      className="loading-overlay flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        zIndex: 10000,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .loading-card {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      <div className="loading-card flex flex-column align-items-center gap-4 p-6 border-round-3xl">
        <div className="relative flex align-items-center justify-content-center">
          <ProgressSpinner
            style={{ width: "70px", height: "70px" }}
            strokeWidth="4"
            fill="transparent"
            animationDuration="1s"
          />
          <div
            className="absolute border-circle"
            style={{
              width: "40px",
              height: "40px",
              background: "var(--primary-color)",
              opacity: 0.1,
            }}
          ></div>
        </div>
        <div className="flex flex-column align-items-center gap-2">
          <span
            className="text-2xl font-bold text-900 tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            Processing
          </span>
          <span className="text-500 font-medium lowercase">
            Please wait a moment...
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Main Provider Component ---
export const AppUIProvider = ({ children }) => {
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState([]);

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
    () => ({ isLoading, setIsLoading }),
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

  return (
    <LoadingContext.Provider value={loadingValue}>
      <NotificationContext.Provider value={notificationValue}>
        <LoadingOverlay isLoading={isLoading} />
        {children}
      </NotificationContext.Provider>
    </LoadingContext.Provider>
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
