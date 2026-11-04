import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { Button } from "./Button";

const TONE_ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  confirm: Info,
};

export function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  async function handleConfirm(toast) {
    try {
      await toast.onConfirm?.();
    } finally {
      onDismiss(toast.id);
    }
  }

  return (
    <div className="toast-viewport" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = TONE_ICONS[toast.tone] ?? Info;

        if (toast.tone === "confirm") {
          return (
            <div
              key={toast.id}
              className={`toast toast--confirm${toast.leaving ? " is-leaving" : ""}`}
              role="alertdialog"
              aria-label={toast.title}
            >
              <span className="toast__icon">
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="toast__content">
                <span className="toast__title">{toast.title}</span>
                {toast.message ? (
                  <span className="toast__message">{toast.message}</span>
                ) : null}
                <span className="toast__actions">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleConfirm(toast)}
                  >
                    {toast.confirmLabel}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDismiss(toast.id)}
                  >
                    {toast.cancelLabel}
                  </Button>
                </span>
              </span>
            </div>
          );
        }

        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.tone}${toast.leaving ? " is-leaving" : ""}`}
          >
            <span className="toast__icon">
              <Icon size={15} aria-hidden="true" />
            </span>
            <span className="toast__message">{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
