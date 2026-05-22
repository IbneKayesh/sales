import { useEffect } from 'react';

export default function Modal({ open, title, children, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCancel?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        {title ? <div className="modal__title">{title}</div> : null}
        <div className="modal__content">{children}</div>
        <div className="modal__actions">
          <button type="button" className="btn btn--secondary" onClick={() => onCancel?.()}>
            {cancelText}
          </button>
          <button type="button" className="btn btn--primary" onClick={() => onConfirm?.()}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

