import { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle } from "react-icons/fi";

const UIContext = createContext(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}

export function UIProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [confirm, setConfirm] = useState({ visible: false, message: "", onConfirm: null });

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), duration);
  }, []);

  const showConfirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirm({ visible: true, message, onConfirm: resolve });
    });
  }, []);

  const handleConfirm = (value) => {
    if (confirm.onConfirm) confirm.onConfirm(value);
    setConfirm({ visible: false, message: "", onConfirm: null });
  };

  const toastIcon = toast.type === "success" ? <FiCheckCircle /> : toast.type === "error" ? <FiAlertCircle /> : <FiAlertTriangle />;
  const toastBg = toast.type === "success" ? "var(--accent-primary)" : toast.type === "error" ? "var(--error)" : "orange";

  return (
    <UIContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {/* Toast */}
      <div style={{
        position: "fixed", bottom: 90, left: "50%",
        zIndex: 999, transition: "opacity 0.3s ease, transform 0.3s ease",
        opacity: toast.visible ? 1 : 0, pointerEvents: toast.visible ? "auto" : "none",
        transform: toast.visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(20px)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--space-2)",
          background: toastBg, color: "#fff",
          padding: "var(--space-3) var(--space-4)",
          borderRadius: "var(--radius-full)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          fontSize: "0.85rem", fontWeight: 500,
          maxWidth: "calc(100vw - var(--space-8))",
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: "var(--icon-md)", flexShrink: 0, display: "grid", placeItems: "center" }}>{toastIcon}</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{toast.message}</span>
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirm.visible && (
        <div style={{
          position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 998,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-4)",
        }}>
          <div style={{
            background: "var(--bg-surface)", width: "100%", maxWidth: 320,
            borderRadius: "var(--radius-xl)", padding: "var(--space-6) var(--space-5)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "2.5rem", color: "var(--error)", marginBottom: "var(--space-3)" }}>
              <FiAlertTriangle />
            </div>
            <p style={{ color: "var(--text-h)", fontWeight: 500, fontSize: "1rem", margin: 0 }}>{confirm.message}</p>
            <p style={{ color: "var(--text-subtle)", fontSize: "0.85rem", marginTop: "var(--space-2)" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
              <button className="ui-btn ui-btn-secondary" onClick={() => handleConfirm(false)}
                style={{ flex: 1, padding: "var(--space-3)" }}>Cancel</button>
              <button className="ui-btn ui-btn-primary" onClick={() => handleConfirm(true)}
                style={{ flex: 1, padding: "var(--space-3)", background: "var(--error)" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </UIContext.Provider>
  );
}
