import { useEffect, useMemo, useState } from 'react';

/**
 * Promise-based confirm dialog.
 * Usage:
 *   const ok = await confirm({ title, message })
 */
export function useConfirm() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
    }
  }, [queue, current]);

  const confirm = useMemo(() => {
    return ({
      title,
      message,
      confirmText = 'Yes',
      cancelText = 'No',
      variant = 'default'
    } = {}) => {
      return new Promise((resolve) => {
        const next = {
          title,
          message,
          confirmText,
          cancelText,
          variant,
          resolve
        };
        setQueue((q) => [...q, next]);
      });
    };
  }, []);

  const close = (value) => {
    if (!current) return;
    current.resolve(value);
    setQueue((q) => q.slice(1));
    setCurrent(null);
  };

  useEffect(() => {
    if (!current) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close(false);
      if (e.key === 'Enter') close(true);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [current]);

  return {
    confirm,
    confirmModal:
      current ? (
        <div
          className="confirm-backdrop"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false);
          }}
        >
          <div className={`confirm-modal confirm-modal-${current.variant}`}>
            <div className="confirm-modal-header">
              <div className="confirm-title">{current.title}</div>
            </div>

            <div className="confirm-message">{current.message}</div>

            <div className="confirm-actions">
              <button className="btn btn-secondary btn-xs" onClick={() => close(false)}>
                {current.cancelText}
              </button>
              <button className="btn btn-primary btn-xs" onClick={() => close(true)}>
                {current.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null
  };
}

