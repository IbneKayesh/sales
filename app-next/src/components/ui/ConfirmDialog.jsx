import { useState, useEffect, useCallback, useRef } from 'react';

let confirmResolver = null;

export function confirm(message, options = {}) {
  return new Promise((resolve) => {
    confirmResolver = { resolve, message, options };
    // Trigger a custom event so the ConfirmDialog component picks it up
    window.dispatchEvent(new CustomEvent('show-confirm'));
  });
}

export default function ConfirmDialog() {
  const [state, setState] = useState(null);
  const [visible, setVisible] = useState(false);
  const resolverRef = useRef(null);

  const handleEvent = useCallback(() => {
    if (confirmResolver) {
      resolverRef.current = confirmResolver;
      setState({ ...confirmResolver });
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('show-confirm', handleEvent);
    return () => window.removeEventListener('show-confirm', handleEvent);
  }, [handleEvent]);

  const dismiss = useCallback((result) => {
    if (resolverRef.current) {
      resolverRef.current.resolve(result);
      resolverRef.current = null;
      confirmResolver = null;
    }
    setVisible(false);
    setTimeout(() => setState(null), 200);
  }, []);

  const handleConfirm = useCallback(() => dismiss(true), [dismiss]);
  const handleCancel = useCallback(() => dismiss(false), [dismiss]);

  // Keyboard handling
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') handleCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, handleCancel]);

  if (!state) return null;

  const opts = state.options || {};
  const title = opts.title || 'Confirm Action';
  const confirmText = opts.confirmText || 'Confirm';
  const cancelText = opts.cancelText || 'Cancel';
  const variant = opts.variant || 'primary';
  const icon = opts.icon || 'help';

  const icons = {
    danger: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  };

  const iconColors = {
    danger: '#dc2626', warning: '#d97706', help: '#6366f1', info: '#3b82f6',
  };

  const btnVariants = {
    danger: { bg: '#dc2626', hover: '#b91c1c' },
    warning: { bg: '#d97706', hover: '#b45309' },
    primary: { bg: '#6366f1', hover: '#4f46e5' },
  };

  const btnStyle = btnVariants[variant] || btnVariants.primary;

  return (
    <>
      <div className={`confirm-overlay ${visible ? 'visible' : ''}`} onClick={handleCancel} />
      <div className={`confirm-dialog ${visible ? 'visible' : ''}`} role="alertdialog" aria-modal="true">
        <div className="confirm-icon" style={{ background: `${iconColors[icon] || iconColors.help}15`, color: iconColors[icon] || iconColors.help }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icons[icon] || icons.help }} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{state.message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn confirm-cancel" onClick={handleCancel}>
            {cancelText}
          </button>
          <button
            className="confirm-btn confirm-confirm"
            style={{ background: btnStyle.bg }}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
