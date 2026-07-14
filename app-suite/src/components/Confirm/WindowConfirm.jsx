import React, { useEffect, useRef, useState } from 'react';
import { useConfirm } from '@/context/FeedbackContext';
import styles from './WindowConfirm.module.css';

const EXIT_DURATION = 150;

const WindowConfirm = () => {
  const { dialogState, handleConfirm, handleCancel } = useConfirm();
  const [exiting, setExiting] = useState(false);
  const exitDataRef = useRef(null);
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const timeoutRef = useRef(null);

  if (dialogState && dialogState.windowId) {
    exitDataRef.current = {
      title: dialogState.title,
      description: dialogState.description,
      action: dialogState.action,
      options: dialogState.options,
    };
  }

  const show = (dialogState && dialogState.windowId) || exiting;

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
    startExit(handleCancel);
  };

  const handleExitConfirm = () => {
    const data = exitDataRef.current;
    if (data?.action) data.action();
    startExit(handleConfirm);
  };

  useEffect(() => {
    if (!show || exiting) return;
    confirmBtnRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleExitCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, exiting]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const data = exitDataRef.current;
  if (!show || !data) return null;

  const { title, description, options } = data;

  return (
    <div className={`${styles.overlay} ${exiting ? styles.overlayExiting : ''}`} role="dialog" aria-modal="true">
      <div className={`${styles.dialog} ${exiting ? styles.dialogExiting : ''}`} ref={modalRef}>
        <div className={styles.body}>
          <svg className={styles.warningIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleExitCancel}>
            {options.cancelLabel || 'Cancel'}
          </button>
          <button
            ref={confirmBtnRef}
            className={`${styles.confirmBtn} ${options.danger ? styles.confirmBtnDanger : ''}`}
            onClick={handleExitConfirm}
          >
            {options.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WindowConfirm;
