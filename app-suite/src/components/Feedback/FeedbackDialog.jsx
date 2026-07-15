import React, { useEffect, useRef, useState } from 'react';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconCheck, IconWarning, IconInfo, IconError, IconClose } from '@/assets/icons';
import styles from './FeedbackDialog.module.css';

const EXIT_DURATION = 150;

// ── Toast icon helper ────────────────────────────────────────────────────
const getToastIcon = (type) => {
  switch (type) {
    case 'success': return <IconCheck className={styles.iconSuccess} />;
    case 'error':   return <IconError className={styles.iconError} />;
    case 'warning': return <IconWarning className={styles.iconWarning} />;
    case 'info':
    default:        return <IconInfo className={styles.iconInfo} />;
  }
};

// ── Single Toast component (inline to keep dependencies minimal) ─────────
const ToastItem = ({ toast, onClose }) => {
  const { id, message, type, duration, actionLabel, onAction, isAction } = toast;

  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const handleAction = () => {
    if (onAction) onAction();
    onClose(id);
  };

  const timerStyle = isAction || duration === Infinity
    ? {}
    : { animationDuration: `${duration}ms` };

  return (
    <div className={`${styles.toast} ${styles[type]} ${isAction ? styles.actionToast : ''}`} role="alert">
      {!isAction && duration !== Infinity && (
        <div className={styles.timerBar}>
          <span className={styles.timerFill} style={timerStyle} />
        </div>
      )}
      <div className={styles.toastBody}>
        <div className={styles.iconContainer}>{getToastIcon(type)}</div>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.actionGroup}>
          {actionLabel && (
            <button className={isAction ? styles.okBtn : styles.actionBtn} onClick={handleAction}>
              {isAction && <IconCheck className={styles.okIcon} />}
              {actionLabel}
            </button>
          )}
          <button
            className={`${styles.closeBtn} ${isAction ? styles.closeBtnHidden : ''}`}
            onClick={() => { if (!isAction) onClose(id); }}
            aria-label="Close Notification"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Unified Feedback Dialog ──────────────────────────────────────────────
//
// Merges ConfirmDialog + ToastContainer into one component.
//
// Props:
//   mode      'global' (default) | 'window'
//     global: fixed top-right toasts + centered confirm overlay
//     window: absolute inside parent, scoped to windowId
//   windowId  string (required when mode='window')
//
// Usage:
//   // Global (rendered once in DesktopLayout)
//   <FeedbackDialog />
//
//   // In-window (rendered inside a Window)
//   <FeedbackDialog mode="window" windowId="products" />

const FeedbackDialog = ({ mode = 'global', windowId }) => {
  const { toasts, removeToast } = useToast();
  const { dialogState, handleConfirm, handleCancel } = useConfirm();

  // ── Toast filtering ──────────────────────────────────────────────────
  const filteredToasts = mode === 'window'
    ? toasts.filter((t) => t.isAction && t.windowId === windowId)
    : toasts.filter((t) => !(t.isAction && t.windowId));

  // ── Confirm state ────────────────────────────────────────────────────
  const matchesScope = mode === 'window'
    ? (dialogState && dialogState.windowId)
    : (dialogState && !dialogState.windowId);

  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const exitDataRef = useRef(null);
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const timeoutRef = useRef(null);

  if (matchesScope) {
    exitDataRef.current = {
      title: dialogState.title,
      description: dialogState.description,
      action: dialogState.action,
      options: dialogState.options,
    };
  }

  const showConfirm = matchesScope || exiting;
  const canInteract = !exiting && !loading;

  const startExit = (onComplete) => {
    if (exiting) return;
    setExiting(true);
    timeoutRef.current = setTimeout(() => {
      setExiting(false);
      exitDataRef.current = null;
      onComplete?.();
    }, EXIT_DURATION);
  };

  const handleExitCancel = () => {
    if (!canInteract) return;
    startExit(handleCancel);
  };

  const handleExitConfirm = async () => {
    if (!canInteract) return;
    const data = exitDataRef.current;
    if (!data) return;

    if (data.action && mode === 'window') {
      data.action();
      startExit(handleConfirm);
    } else if (data.action) {
      loadingRef.current = true;
      setLoading(true);
      try { await data.action(); } catch { /* handled by caller */ }
      loadingRef.current = false;
      setLoading(false);
      startExit(handleConfirm);
    } else {
      startExit(handleConfirm);
    }
  };

  // ── Keyboard handler ─────────────────────────────────────────────────
  useEffect(() => {
    if (!showConfirm || exiting) return;
    confirmBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (!loadingRef.current || mode === 'window')) {
        handleExitCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm, exiting, mode]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const confirmData = exitDataRef.current;

  // ── Toast container class ────────────────────────────────────────────
  const containerClass = mode === 'window' ? styles.windowContainer : styles.regularContainer;

  return (
    <>
      {/* ── Toast list ──────────────────────────────────────────────── */}
      {filteredToasts.length > 0 && (
        <div className={containerClass} aria-live="polite" aria-relevant="additions">
          {filteredToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      )}

      {/* ── Confirm dialog ──────────────────────────────────────────── */}
      {showConfirm && confirmData && (
        mode === 'window' ? (
          <div className={`${styles.windowOverlay} ${exiting ? styles.windowOverlayExiting : ''}`}>
            <div className={`${styles.windowDialog} ${exiting ? styles.windowDialogExiting : ''}`} ref={modalRef} role="dialog" aria-modal="true">
              <div className={styles.body}>
                <IconWarning className={styles.warningIcon} />
                <h2 className={styles.windowTitle}>{confirmData.title}</h2>
                <p className={styles.windowDescription}>{confirmData.description}</p>
              </div>
              <div className={styles.windowFooter}>
                <button className={styles.windowCancelBtn} onClick={handleExitCancel}>
                  {confirmData.options.cancelLabel || 'Cancel'}
                </button>
                <button
                  ref={confirmBtnRef}
                  className={`${styles.windowConfirmBtn} ${confirmData.options.danger ? styles.windowConfirmBtnDanger : ''}`}
                  onClick={handleExitConfirm}
                >
                  {confirmData.options.confirmLabel || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}
            onClick={(e) => {
              const clickOutside = confirmData.options.clickOutsideToClose ?? true;
              if (canInteract && clickOutside && modalRef.current && !modalRef.current.contains(e.target)) {
                handleExitCancel();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
          >
            <div className={`${styles.dialog} ${exiting ? styles.dialogExiting : ''}`} ref={modalRef}>
              <div className={styles.body}>
                <h2 id="confirm-title" className={styles.title}>{confirmData.title}</h2>
                <p id="confirm-desc" className={styles.description}>{confirmData.description}</p>
              </div>
              {loading && (
                <div className={styles.loadingBar}>
                  <span className={styles.loadingBarFill} />
                </div>
              )}
              <div className={styles.footer}>
                <button className={styles.cancelBtn} onClick={handleExitCancel} disabled={!canInteract}>
                  {loading ? 'Please wait…' : (confirmData.options.cancelLabel || 'Cancel')}
                </button>
                <button
                  ref={confirmBtnRef}
                  className={`${styles.confirmBtn} ${loading ? styles.confirmBtnLoading : ''} ${confirmData.options.danger ? styles.confirmBtnDanger : ''}`}
                  onClick={handleExitConfirm}
                  disabled={!canInteract}
                >
                  {loading ? (
                    <><span className={styles.spinner} />{confirmData.options.loadingLabel || 'Deleting…'}</>
                  ) : (
                    confirmData.options.confirmLabel || 'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default FeedbackDialog;
