import { useEffect, useCallback } from 'react'
import { IconClose } from '../icons'

/**
 * Modal — Full-featured modal dialog.
 *
 * Usage:
 *   <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *     <ModalHeader title="Title" subtitle="Optional subtitle" onClose={() => setIsOpen(false)} />
 *     <ModalBody>...</ModalBody>
 *     <ModalFooter><Button>Save</Button></ModalFooter>
 *   </Modal>
 *
 * Or with named sub-components:
 *   <Modal open={isOpen} onClose={...}>
 *     <ModalHeader>
 *       <ModalTitle title="..." subtitle="..." />
 *       <IconClose onClick={...} />
 *     </ModalHeader>
 *     <ModalBody>...</ModalBody>
 *     <ModalFooter actions={<Button>Save</Button>} />
 *   </Modal>
 */

export default function Modal({
  open = false,
  onClose,
  onBackdropClick,
  size = 'md',            // sm | md | lg | xl | full
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = '',
  ...rest
}) {
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose?.()
    }
  }, [closeOnEscape, onClose])

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll while modal is open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      if (closeOnBackdrop) onClose?.()
      else onBackdropClick?.()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
      <div className={`modal modal--${size}${className ? ' ' + className : ''}`}>
        {children}
      </div>
    </div>
  )
}

/* ---------- Header ---------- */

export function ModalHeader({ children, className = '', ...rest }) {
  return (
    <div className={`modal__header${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/* ---------- Title (with optional subtitle and close) ---------- */

export function ModalTitle({ title, subtitle, onClose, className = '', ...rest }) {
  return (
    <div className={`modal__title-wrap${className ? ' ' + className : ''}`} {...rest}>
      <div className="modal__title-text">
        {title && <h3 className="modal__title">{title}</h3>}
        {subtitle && <p className="modal__subtitle">{subtitle}</p>}
      </div>
      {onClose && (
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close modal">
          <IconClose size={16} />
        </button>
      )}
    </div>
  )
}

/* ---------- Body ---------- */

export function ModalBody({ children, className = '', ...rest }) {
  return (
    <div className={`modal__body${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/* ---------- Footer (right-aligned actions) ---------- */

export function ModalFooter({ children, className = '', ...rest }) {
  return (
    <div className={`modal__footer${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}
