import React, { useEffect, useRef, useState } from 'react';
import { useConfirm } from '../../context/ConfirmContext';
import styles from './WindowConfirm.module.css';

const EXIT_DURATION = 150;

const WindowConfirm = ({ windowId }) => {
  const { dialogState, handleConfirm, handleCancel } = useConfirm();
  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const exitDataRef = useRef(null);
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const timeoutRef = useRef(null);

  const isVisible = dialogState && dialogState.windowId === windowId;
  const show = isVisible || exiting;
  const canInteract = !exiting && !loading;

  // Snapshot dialog data via ref so we can render during exit animation
  if (isVisible && dialogState) {
    exitDataRef.current = {
      title: dialogState.title,
      description: dialogState.description,
      action: dialogState.action,
      options: dialogState.options,
    };
  }

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

    if (data.action) {
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

  const handleOverlayClick = (e) => {
    if (!canInteract) return;
    const clickOutsideToClose = exitDataRef.current?.options?.clickOutsideToClose ?? true;
    if (
      clickOutsideToClose &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      handleExitCancel();
    }
  };

  useEffect(() => {
    if (!show || exiting) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loadingRef.current) {
        handleExitCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, exiting]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const data = exitDataRef.current;
  if (!show || !data) return null;

  const { title, description, options } = data;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-confirm-title"
      aria-describedby="win-confirm-desc"
    >
      <div
        className={`${styles.dialog} ${exiting ? styles.dialogExiting : ''}`}
        ref={modalRef}
      >
        <div className={styles.header}>
          <h2 id="win-confirm-title" className={styles.title}>
            {title}
          </h2>
        </div>
        <div className={styles.body}>
          <p id="win-confirm-desc" className={styles.description}>
            {description}
          </p>
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
};

export default WindowConfirm;
