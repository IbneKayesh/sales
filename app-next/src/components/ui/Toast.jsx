import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

// ─── Context ──────────────────────────────────────────────
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500, action) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, duration, action, createdAt: Date.now() }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Derived helpers — each accepts (message, opts) where opts can include:
  //   duration, action: { label, onClick }
  const toast = useCallback((message, opts = {}) => {
    const type = opts.type || 'info';
    const duration = opts.duration ?? 3500;
    return addToast(message, type, duration, opts.action);
  }, [addToast]);

  toast.success = useCallback((msg, opts = {}) => {
    const duration = opts.duration ?? 3500;
    return addToast(msg, 'success', duration, opts.action);
  }, [addToast]);

  toast.error   = useCallback((msg, opts = {}) => {
    const duration = opts.duration ?? 5000;
    return addToast(msg, 'error', duration, opts.action);
  }, [addToast]);

  toast.warning = useCallback((msg, opts = {}) => {
    const duration = opts.duration ?? 4000;
    return addToast(msg, 'warning', duration, opts.action);
  }, [addToast]);

  toast.info    = useCallback((msg, opts = {}) => {
    const duration = opts.duration ?? 3500;
    return addToast(msg, 'info', duration, opts.action);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

// ─── Individual Toast ─────────────────────────────────────
function ToastItem({ toast: t, onDismiss }) {
  const timerRef = useRef(null);
  const [remaining, setRemaining] = useState(t.duration);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!paused) {
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = elapsedRef.current + (Date.now() - startRef.current);
        const left = Math.max(0, t.duration - elapsed);
        setRemaining(left);
        if (left <= 0) {
          clearInterval(timerRef.current);
          onDismiss(t.id);
        }
      }, 30);
    } else {
      elapsedRef.current += Date.now() - startRef.current;
    }
    return () => clearInterval(timerRef.current);
  }, [t.duration, t.id, onDismiss, paused]);

  const pct = (remaining / t.duration) * 100;

  const icons = {
    success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    error:   '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  };

  const colors = {
    success: { bg: '#059669', border: '#34d399' },
    error:   { bg: '#dc2626', border: '#f87171' },
    warning: { bg: '#d97706', border: '#fbbf24' },
    info:    { bg: '#6366f1', border: '#a5b4fc' },
  };

  const c = colors[t.type] || colors.info;

  return (
    <div
      className={`toast-item toast-${t.type}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); startRef.current = Date.now(); }}
    >
      <div className="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: icons[t.type] || icons.info }} />
      </div>
      <span className="toast-message">{t.message}</span>

      {t.action && (
        <button className="toast-action" onClick={(e) => { e.stopPropagation(); t.action.onClick(); onDismiss(t.id); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {t.action.label}
        </button>
      )}

      <button className="toast-close" onClick={() => onDismiss(t.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div className="toast-progress" style={{ width: `${pct}%`, background: c.border }} />
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
