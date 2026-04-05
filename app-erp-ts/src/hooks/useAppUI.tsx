import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { ReactNode } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Toast } from "primereact/toast";

// --- Types ---
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
  fromUser: string;
  toUser: string;
}

interface ChangesLog {
  id: string;
  message: string;
  type: string;
  timestamp: string;
}

interface NotifyParams {
  severity?: "success" | "info" | "warn" | "error";
  summary?: string;
  detail?: string;
  toast?: boolean;
  notification?: boolean;
  log?: boolean;
}

interface BusyContextType {
  isBusy: boolean;
  setIsBusy: (busy: boolean) => void;
}

interface NotificationContextType {
  notifications: Notification[];
  changesLog: ChangesLog[];
  addNotification: (title: string, message: string, type?: string) => void;
  addChangesLog: (message: string, type?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  clearChangesLog: () => void;
  notify: (params: NotifyParams) => void;
}

interface ToastContextType {
  showToast: (
    severity: string,
    summary: string,
    detail: string,
    life?: number,
  ) => void;
}

// --- Context Definitions ---
const BusyContext = createContext<BusyContextType | null>(null);
const NotificationContext = createContext<NotificationContextType | null>(null);
const ToastContext = createContext<ToastContextType | null>(null);

// --- Component Definition for Loading Overlay ---
const LoadingOverlay: React.FC<{ isBusy: boolean }> = ({ isBusy }) => {
  if (!isBusy) return null;
  return <LoadingSpinner fullScreen />;
};

// --- Main Provider Component ---
export const AppUIProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const toast = useRef<Toast>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [changesLog, setChangesLog] = useState<ChangesLog[]>([]);

  const showToast = useCallback(
    (severity: string, summary: string, detail: string, life = 3000) => {
      toast.current?.show({ severity, summary, detail, life });
    },
    [],
  );

  const addNotification = useCallback(
    (title: string, message: string, type = "info") => {
      const newNotification: Notification = {
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
    },
    [],
  );

  const addChangesLog = useCallback((message: string, type = "info") => {
    const newLog: ChangesLog = {
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

  const markAsRead = useCallback((id: string) => {
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

  const notify = useCallback(
    ({
      severity = "info",
      summary = "Info",
      detail = "",
      toast = true,
      notification = false,
      log = false,
    }: NotifyParams) => {
      if (toast) {
        showToast(severity, summary, detail);
      }
      if (notification) {
        addNotification(summary, detail, severity);
      }
      if (log) {
        addChangesLog(`${summary} - ${detail}`, severity);
      }
    },
    [showToast, addNotification, addChangesLog],
  );

  const loadingValue = useMemo(() => ({ isBusy, setIsBusy }), [isBusy]);

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
