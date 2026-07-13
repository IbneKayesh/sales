import { useEffect, useRef, useCallback } from 'react';

const SIZES = {
  sm: 400,
  md: 520,
  lg: 680,
  xl: 860,
  fullscreen: 'calc(100vw - 48px)',
};

export default function Modal({ open, onClose, title, children, footer, size = 'md', width, closeOnOverlay = true }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);

  const actualWidth = width || SIZES[size] || SIZES.md;

  // Close on Escape, trap focus, prevent body scroll
  useEffect(() => {
    if (!open) return;

    prevFocusRef.current = document.activeElement;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      // Simple focus trap — tab cycles between modal elements
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    requestAnimationFrame(() => {
      if (modalRef.current) {
        const first = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      prevFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlay && e.target === overlayRef.current) onClose();
  }, [closeOnOverlay, onClose]);

  const isFullscreen = size === 'fullscreen';
  const styleWidth = isFullscreen ? { width: actualWidth, maxWidth: actualWidth } : { maxWidth: actualWidth };

  return (
    <>
      <div className="modal-overlay visible" ref={overlayRef} onClick={handleOverlayClick} />
      <div
        ref={modalRef}
        className={`modal visible ${isFullscreen ? 'modal-fullscreen' : ''}`}
        style={styleWidth}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body" style={footer ? { paddingBottom: 0 } : undefined}>
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
