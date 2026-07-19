import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import Confirm from "@/components/Confirm";
import Progress from "@/components/Progress";
import ToastBox from "@/components/ToastBox";
import {
  IconCogs,
  IconSuccess,
  IconError,
  IconInfo,
  IconWarning,
  IconClose,
} from "@/icons";

const UIContext = createContext(null);

let toastId = 0;

export function AppUIProvider({ children }) {
  /* ─── Toast ─────────────────────────────────── */
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev.slice(-4), t]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const t = {
        id: ++toastId,
        message,
        type: options.type || "info",
        duration: options.duration ?? 4000,
      };
      addToast(t);
    },
    [addToast],
  );

  /* ─── Global Confirm ────────────────────────── */
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "primary",
    resolve: null,
  });

  const confirmBox = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title: options.title || "Confirm",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "primary",
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    const res = confirmState.resolve;
    setConfirmState((prev) => ({ ...prev, open: false }));
    // Small delay so the close animation plays before resolving
    await new Promise((r) => setTimeout(r, 100));
    res?.(true);
  }, [confirmState.resolve]);

  const handleCancel = useCallback(() => {
    const res = confirmState.resolve;
    setConfirmState((prev) => ({ ...prev, open: false }));
    res?.(false);
  }, [confirmState.resolve]);

  /* ─── Global Alert ──────────────────────────── */
  const [alertState, setAlertState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    variant: "primary",
    resolve: null,
  });

  const alertBox = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setAlertState({
        open: true,
        title: options.title || "Notice",
        message: options.message || "",
        confirmText: options.confirmText || "OK",
        variant: options.variant || "primary",
        resolve,
      });
    });
  }, []);

  const handleAlertConfirm = useCallback(() => {
    const res = alertState.resolve;
    setAlertState((prev) => ({ ...prev, open: false }));
    res?.();
  }, [alertState.resolve]);

  /* ─── Global Busy State & Loading Overlay ──── */
  const [isBusy, setBusy] = useState(false);
  const [loading, setLoading] = useState({
    active: false,
    label: "",
    description: "",
  });

  const setIsBusy = useCallback((busy) => {
    setBusy(busy);
    if (busy) {
      setLoading({
        active: true,
        label: "Processing...",
        description: "Please wait while we process your request.",
      });
    } else {
      setLoading({ active: false, label: "", description: "" });
    }
  }, []);

  const value = {
    showToast,
    confirmBox,
    alertBox,
    isBusy,
    setIsBusy,
  };

  return (
    <UIContext.Provider value={value}>
      {children}

      {/* Toast — both the new context-driven renderer AND the legacy ToastBox for backward compat */}
      <ToastRenderer toasts={toasts} onRemove={removeToast} />
      <ToastBox />

      {/* Global confirm dialog */}
      <Confirm
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Global alert dialog */}
      <Confirm
        open={alertState.open}
        title={alertState.title}
        message={alertState.message}
        confirmText={alertState.confirmText}
        variant={alertState.variant}
        confirmOnly={true}
        onConfirm={handleAlertConfirm}
      />

      {/* Global loading overlay — full-screen modal popup */}
      {loading.active && (
        <div className="ui-loading-overlay">
          <div className="ui-loading-modal">
            <div className="ui-loading-modal__body">
              <div className="ui-loading-modal__icon">
                <IconCogs size={28} style={{ color: "var(--primary)" }} />
              </div>
              <div className="ui-loading-modal__content">
                <h3 className="ui-loading-modal__title">{loading.label}</h3>
                {loading.description && (
                  <p className="ui-loading-modal__desc">
                    {loading.description}
                  </p>
                )}
                <Progress pulse size="md" variant="primary" showValue={false} />
              </div>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}

/* ─── Toast Renderer (internal) ────────────── */

function ToastRenderer({ toasts, onRemove }) {
  const [exiting, setExiting] = useState({});

  const triggerRemove = useCallback(
    (id) => {
      setExiting((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        onRemove(id);
        setExiting((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 250);
    },
    [onRemove],
  );

  return (
    <div className="toast-box" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          exiting={!!exiting[t.id]}
          onRemove={() => triggerRemove(t.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast: t, exiting, onRemove }) {
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(onRemove, t.duration);
  }, [t.duration, onRemove]);

  // Start timer on mount
  useState(() => {
    startTimer();
  });

  const icons = {
    success: <IconSuccess size={18} />,
    error: <IconError size={18} />,
    info: <IconInfo size={18} />,
    warning: <IconWarning size={18} />,
  };

  return (
    <div
      className={`toast-item toast-item--${t.type}${exiting ? " toast-item--exiting" : ""}`}
      role="alert"
    >
      <span className="toast-item__icon">{icons[t.type] || icons.info}</span>
      <span className="toast-item__message">{t.message}</span>
      <button
        type="button"
        className="toast-item__close"
        onClick={onRemove}
        aria-label="Close"
      >
        <IconClose size={14} />
      </button>
    </div>
  );
}

/* ─── Hook ─────────────────────────────────── */

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within AppUIProvider");
  return ctx;
}
