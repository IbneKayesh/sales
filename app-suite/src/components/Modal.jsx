import { useEffect, useCallback, useState, useRef } from 'react'
import { IconClose } from '../icons'

/**
 * Modal — Full-featured modal dialog with open/close transitions.
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
    // Prevent body scroll while modal is open (but allow during close animation)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prev
    }
  }, [mounted, handleKeyDown])

  if (!mounted) return null

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !closing) {
      if (closeOnBackdrop) onClose?.()
      else onBackdropClick?.()
    }
  }

  const overlayClass = `modal-overlay${closing ? ' modal-overlay--closing' : ''}`
  const modalClass = `modal modal--${size}${closing ? ' modal--closing' : ''}${className ? ' ' + className : ''}`

  return (
    <div className={overlayClass} onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
      <div className={modalClass}>
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
