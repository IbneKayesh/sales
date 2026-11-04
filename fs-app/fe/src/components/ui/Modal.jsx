import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export function Modal({ title, icon: Icon, size = "md", onClose, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={`modal modal--${size}`}>
        <header className="modal__header">
          {Icon ? (
            <span className="modal__icon">
              <Icon size={16} aria-hidden="true" />
            </span>
          ) : null}
          <h2 className="modal__title">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </Button>
        </header>

        <div className="modal__body">{children}</div>

        {footer ? <footer className="modal__footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
