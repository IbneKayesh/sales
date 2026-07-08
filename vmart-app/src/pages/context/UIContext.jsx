import { createContext, useContext, useState, useCallback } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";
import "../context/UIContext.css";

const UIContext = createContext(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}

export function UIProvider({ children }) {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [confirm, setConfirm] = useState({
    visible: false,
    message: "",
    onConfirm: null,
  });
  const [isBusy, setBusy] = useState(false);

  const showToast = useCallback(
    (message, type = "success", duration = 3000) => {
      setToast({ visible: true, message, type });
      setTimeout(
        () => setToast((prev) => ({ ...prev, visible: false })),
        duration,
      );
    },
    [],
  );

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirm({ visible: true, message, onConfirm: resolve });
    });
  }, []);

  const handleConfirm = (value) => {
    if (confirm.onConfirm) confirm.onConfirm(value);
    setConfirm({ visible: false, message: "", onConfirm: null });
  };

  const setIsBusy = useCallback((busy) => {
    setBusy(busy);
  }, []);

  const toastIcon =
    toast.type === "success" ? (
      <FiCheckCircle />
    ) : toast.type === "error" ? (
      <FiAlertCircle />
    ) : (
      <FiAlertTriangle />
    );
  const toastBg =
    toast.type === "success"
      ? "var(--accent-primary)"
      : toast.type === "error"
        ? "var(--error)"
        : "orange";

  return (
    <UIContext.Provider value={{ showToast, showConfirm, isBusy, setIsBusy }}>
      {children}

      {/* Toast */}
      <div
        className={`ui-toast-container ${toast.visible ? "ui-toast-container--visible" : "ui-toast-container--hidden"}`}
      >
        <div className="ui-toast-inner" style={{ background: toastBg }}>
          <span className="ui-toast-icon">{toastIcon}</span>
          <span className="ui-toast-message">{toast.message}</span>
        </div>
      </div>

      {/* Busy Overlay */}
      {isBusy && (
        <div className="ui-busy-overlay">
          <div className="ui-busy-spinner">
            <FiLoader size={22} />
          </div>
          <p className="ui-busy-text">Please wait…</p>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirm.visible && (
        <div className="ui-confirm-overlay">
          <div className="ui-confirm-dialog">
            <div className="ui-confirm-icon">
              <FiAlertTriangle />
            </div>
            <p className="ui-confirm-message">{confirm.message}</p>
            <p className="ui-confirm-hint">This action cannot be undone.</p>
            <div className="ui-confirm-actions">
              <button
                className="ui-btn ui-btn-secondary ui-confirm-btn"
                onClick={() => handleConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="ui-btn ui-btn-primary ui-confirm-btn ui-confirm-btn--delete"
                onClick={() => handleConfirm(true)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}
