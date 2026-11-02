import { useState, useCallback, useEffect, useRef } from "react";

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((p) => p.map((t) => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 260);
  }, []);

  const push = useCallback((message, type = "info", duration = 3500) => {
    const id = ++_id;
    setToasts((p) => [...p, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  useEffect(() => { const t = timers.current; return () => Object.values(t).forEach(clearTimeout); }, []);

  return {
    toasts,
    dismiss,
    success: (m, d) => push(m, "success", d),
    error:   (m, d) => push(m, "error", d ?? 5000),
    info:    (m, d) => push(m, "info", d),
  };
}

const ICON = { success: "✓", error: "✕", info: "ℹ" };

export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="toast-container" role="region">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}${t.exiting ? " exiting" : ""}`}>
          <span>{ICON[t.type]}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button className="btn btn-ghost btn-icon" style={{ width: 22, height: 22, fontSize: 11 }} onClick={() => dismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
