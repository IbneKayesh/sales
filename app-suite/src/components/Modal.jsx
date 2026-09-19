import { useEffect, useCallback, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '../icons'

/**
 * Modal — Full-featured modal dialog with open/close transitions.
 *
 * Usage:
 *   <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *
 * `className` styles the dialog card; `overlayClassName` styles the backdrop
 * layer it is centred in (used by the floating windows in layouts/Window).
 *
 * The overlay is portaled to <body> (like src/print/PrintModal) so its fixed
 * backdrop is always sized against the viewport. Rendered in place, a modal
 * opened from a page inside a floating window would inherit that window's
 * translate() as its containing block — the backdrop would then cover only
 * the window's own area (offset by wherever it was dragged) instead of the
 * full screen.
 *
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
  size = 'md',            // sm | md | lg | xl | xxl | xxxl |full
  // A click on the backdrop never dismisses the modal by default: an
  // accidental click outside the card must not throw away the user's input.
  // Pass closeOnBackdrop (or onBackdropClick) to opt back in.
  closeOnBackdrop = false,
  closeOnEscape = true,
  blockScroll = true,
  children,
  className = '',
  overlayClassName = '',
  modalStyle,
  modalRef,
  ...rest
}) {
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef(null)

  // Handle open/close state with exit animation
  useEffect(() => {
    if (open) {
      // Clear any pending close timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setClosing(false)
      setMounted(true)
    } else if (mounted) {
      // Start exit animation
      setClosing(true)
      // Remove from DOM after animation completes
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setClosing(false)
        timerRef.current = null
      }, 300) // slightly longer than the longest CSS animation (--transition-slow: 0.25s)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [open])

  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape' && open) {
      onClose?.()
    }
  }, [closeOnEscape, onClose, open])

  useEffect(() => {
    if (!mounted) return
    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll while modal is open (unless blockScroll is disabled,
    // e.g. non-blocking popups), but allow during close animation
    if (blockScroll) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = prev
      }
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mounted, handleKeyDown, blockScroll])

  if (!mounted) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !closing) {
      if (closeOnBackdrop) onClose?.()
      else onBackdropClick?.()
    }
  }

  const overlayClass = `modal-overlay${closing ? ' modal-overlay--closing' : ''}${overlayClassName ? ' ' + overlayClassName : ''}`
  const modalClass = `modal modal--${size}${closing ? ' modal--closing' : ''}${className ? ' ' + className : ''}`

  return createPortal(
    <div className={overlayClass} onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
      <div className={modalClass} style={modalStyle} ref={modalRef}>
        {children}
      </div>
    </div>,
    document.body,
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
