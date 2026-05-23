import React, { useEffect, useRef } from "react";
import "./ConfirmBox.css";

const ConfirmBox = ({
  message,
  title = "Confirm",
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="confirm-box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-box-title"
        aria-describedby="confirm-box-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-box-title" className="confirm-box__title">
          {title}
        </h2>
        <p id="confirm-box-message" className="confirm-box__message">
          {message}
        </p>
        <div className="confirm-box__actions">
          <button
            type="button"
            className="confirm-box__btn confirm-box__btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className="confirm-box__btn confirm-box__btn--confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
