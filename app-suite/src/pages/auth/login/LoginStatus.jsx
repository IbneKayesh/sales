import { useEffect, useState } from "react";
import { IconCheck, IconClose, IconSpinner } from "@/icons";

// The dot variant lives in tight corners, so it gets shorter wording.
const LABELS = {
  icon: { checking: "Checking…", online: "Server connected", offline: "Server offline" },
  dot: { checking: "Checking…", online: "Connected", offline: "Offline" },
};

const pad = (n) => String(n).padStart(2, "0");

const formatClock = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const formatAge = (ms) => {
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

/**
 * Backend connectivity indicator. Clicking it re-runs the health check, so the
 * pill doubles as a retry button when the server is unreachable.
 *
 *  - `variant="icon"` (default): check / cross / spinner glyph + full label.
 *  - `variant="dot"`: a coloured status light + short label, for tight spots
 *    like the corner of the split view's brand panel.
 *
 * Hovering (or focusing) the pill opens a card with the last-checked time.
 */
export default function LoginStatus({
  status = null, // null = unknown/checking, true = online, false = offline
  checking = false,
  lastCheckedAt = null,
  onRecheck,
  variant = "icon",
  retryAttempt = 0,
  maxRetryAttempts = 0,
  autoRetryStopped = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // While the card is open, refresh the clock immediately (deferred a tick so
  // it isn't a synchronous setState-in-effect) and then once a second, so the
  // "x ago" label stays honest while it's on screen.
  useEffect(() => {
    if (!open) return undefined;
    const kick = setTimeout(() => setNow(Date.now()), 0);
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(kick);
      clearInterval(id);
    };
  }, [open]);

  const state = checking || status === null ? "checking" : status ? "online" : "offline";
  const label = (LABELS[variant] || LABELS.icon)[state];

  const checked = lastCheckedAt ? new Date(lastCheckedAt) : null;
  const checkedText = checked
    ? `${formatClock(checked)} · ${formatAge(now - checked.getTime())}`
    : "Not checked yet";

  const ariaLabel =
    state === "checking"
      ? `Backend status: ${label}`
      : `Backend status: ${label}. Click to re-check.`;

  return (
    <div
      className={`login-page__backend${className ? " " + className : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`login-page__backend-btn login-page__backend-btn--${state}${
          variant === "dot" ? " login-page__backend-btn--dot" : ""
        }`}
        onClick={onRecheck}
        disabled={checking}
        aria-live="polite"
        aria-label={ariaLabel}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {variant === "dot" ? (
          <span className="login-page__backend-dot" aria-hidden="true" />
        ) : state === "checking" ? (
          <IconSpinner size={12} />
        ) : state === "online" ? (
          <IconCheck size={12} />
        ) : (
          <IconClose size={12} />
        )}
        <span>{label}</span>
      </button>

      {open && (
        <div
          className={`login-page__status-card login-page__status-card--${state}`}
          role="tooltip"
        >
          <div className="login-page__status-card-head">
            <span className="login-page__backend-dot" aria-hidden="true" />
            <span className="login-page__status-card-state">{label}</span>
          </div>

          <div className="login-page__status-card-meta">
            <span>Last checked</span>
            <span className="login-page__status-card-time">{checkedText}</span>
          </div>

          {state === "offline" && maxRetryAttempts > 0 && (
            <div className="login-page__status-card-meta">
              <span>Auto-retry</span>
              <span className="login-page__status-card-time">
                {autoRetryStopped
                  ? `stopped after ${maxRetryAttempts}`
                  : `attempt ${retryAttempt} of ${maxRetryAttempts}`}
              </span>
            </div>
          )}

          <div className="login-page__status-card-hint">
            Click the pill to run the check again
          </div>
        </div>
      )}
    </div>
  );
}
