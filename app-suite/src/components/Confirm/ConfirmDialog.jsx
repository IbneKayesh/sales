import React, { useEffect, useRef } from 'react';
import { useConfirm } from '../../context/ConfirmContext';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = () => {
  const { dialogState, handleConfirm, handleCancel } = useConfirm();
  const modalRef = useRef(null);
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!dialogState) return;

    confirmBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dialogState, handleCancel]);

  if (!dialogState) return null;

  const { title, description, options } = dialogState;
  const clickOutsideToClose = options.clickOutsideToClose ?? true;

  const handleOverlayClick = (e) => {
    if (clickOutsideToClose && modalRef.current && !modalRef.current.contains(e.target)) {
      handleCancel();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
      <div className={styles.dialog} ref={modalRef}>
        <div className={styles.header}>
          <h2 id="confirm-title" className={styles.title}>{title}</h2>
        </div>
        <div className={styles.body}>
          <p id="confirm-desc" className={styles.description}>{description}</p>
        </div>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            {options.cancelLabel || 'Cancel'}
          </button>
          <button
            ref={confirmBtnRef}
            className={`${styles.confirmBtn} ${options.danger ? styles.confirmBtnDanger : ''}`}
            onClick={handleConfirm}
          >
            {options.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
