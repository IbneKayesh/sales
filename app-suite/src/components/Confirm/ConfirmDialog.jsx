import React, { useEffect, useRef, useState } from 'react';
import { useConfirm } from '@/context/FeedbackContext';
import { IconWarning } from '@/assets/icons';
import styles from './ConfirmDialog.module.css';

const EXIT_DURATION = 150;

const ConfirmDialog = ({ windowed = false }) => {
  const { dialogState, handleConfirm, handleCancel } = useConfirm();
  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const exitDataRef = useRef(null);
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const timeoutRef = useRef(null);

  const matchesScope = windowed
    ? (dialogState && dialogState.windowId)
    : (dialogState && !dialogState.windowId);

  // Store dialog data when it matches this component's scope
  if (matchesScope) {
    exitDataRef.current = {
      title: dialogState.title,
      description: dialogState.description,
      action: dialogState.action,
      options: dialogState.options,
    };
  }

  const show = matchesScope || exiting;
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
    if (!windowed && !canInteract) return;
    startExit(handleCancel);
  };

  const handleExitConfirm = async () => {
    if (!windowed && !canInteract) return;
    const data = exitDataRef.current;
    if (!data) return;

    if (data.action && windowed) {
      // Window mode — synchronous execution
      data.action();
      startExit(handleConfirm);
    } else if (data.action) {
      // Global mode — async with loading state
      loadingRef.current = true;
      setLoading(true);
      try {
        await data.action();
      } catch {
        // Error handled by the calling page
      }
      loadingRef.current = false;
      setLoading(false);
      startExit(handleConfirm);
    } else {
      startExit(handleConfirm);
    }
  };

  useEffect(() => {
    if (!show || exiting) return;
    confirmBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (!loadingRef.current || windowed)) {
        handleExitCancel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, exiting, windowed]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const data = exitDataRef.current;
  if (!show || !data) return null;

  const { title, description, options } = data;

  // ── Global mode ───────────────────────────────────────────────────────
  if (!windowed) {
    const clickOutsideToClose = options.clickOutsideToClose ?? true;

    const handleOverlayClick = (e) => {
      if (!canInteract) return;
      if (clickOutsideToClose && modalRef.current && !modalRef.current.contains(e.target)) {
        handleExitCancel();
      }
    };

    return (
      <div
        className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        <div className={`${styles.dialog} ${exiting ? styles.dialogExiting : ''}`} ref={modalRef}>
          <div className={styles.body}>
            <h2 id="confirm-title" className={styles.title}>{title}</h2>
            <p id="confirm-desc" className={styles.description}>{description}</p>
          </div>
          {loading && (
            <div className={styles.loadingBar}>
              <span className={styles.loadingBarFill} />
            </div>
          )}
          <div className={styles.footer}>
            <button
              className={styles.cancelBtn}
              onClick={handleExitCancel}
              disabled={!canInteract}
            >
              {loading ? 'Please wait…' : (options.cancelLabel || 'Cancel')}
            </button>
            <button
              ref={confirmBtnRef}
              className={`${styles.confirmBtn} ${loading ? styles.confirmBtnLoading : ''} ${options.danger ? styles.confirmBtnDanger : ''}`}
              onClick={handleExitConfirm}
              disabled={!canInteract}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  {options.loadingLabel || 'Deleting…'}
                </>
              ) : (
                options.confirmLabel || 'Confirm'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Window mode ───────────────────────────────────────────────────────
  return (
    <div className={`${styles.windowOverlay} ${exiting ? styles.windowOverlayExiting : ''}`}>
      <div className={`${styles.windowDialog} ${exiting ? styles.windowDialogExiting : ''}`} ref={modalRef} role="dialog" aria-modal="true">
        <div className={styles.body}>
          <IconWarning className={styles.warningIcon} />
          <h2 className={styles.windowTitle}>{title}</h2>
          <p className={styles.windowDescription}>{description}</p>
        </div>
        <div className={styles.windowFooter}>
          <button className={styles.windowCancelBtn} onClick={handleExitCancel}>
            {options.cancelLabel || 'Cancel'}
          </button>
          <button
            ref={confirmBtnRef}
            className={`${styles.windowConfirmBtn} ${options.danger ? styles.windowConfirmBtnDanger : ''}`}
            onClick={handleExitConfirm}
          >
            {options.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
