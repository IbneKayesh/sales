import { useEffect, useCallback, useState, useRef } from 'react'
import { IconClose } from '../icons'

/**
 * SidePanel — Slides in from left or right with open/close transitions.
 *
 * Usage:
 *   <SidePanel open={isOpen} onClose={...} position="right" size="md">
 *     <SidePanelHeader>
 *       <SidePanelTitle title="..." subtitle="..." onClose={...} />
 *     </SidePanelHeader>
 *     <SidePanelBody>...</SidePanelBody>
 *     <SidePanelFooter>
 *       <Button>Save</Button>
 *     </SidePanelFooter>
 *   </SidePanel>
 */

export default function SidePanel({
  open = false,
  onClose,
  onBackdropClick,
  position = 'right',     // 'left' | 'right'
  size = 'md',            // sm | md | lg | xl
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
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setClosing(false)
      setMounted(true)
    } else if (mounted) {
      setClosing(true)
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setClosing(false)
        timerRef.current = null
      }, 300)
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

  const overlayClass = `sidepanel-overlay${closing ? ' sidepanel-overlay--closing' : ''}`
  const panelClass = `sidepanel sidepanel--${position} sidepanel--${size}${closing ? ' sidepanel--closing' : ''}${className ? ' ' + className : ''}`

  return (
    <div className={overlayClass} onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
      <div className={panelClass}>
        {children}
      </div>
    </div>
  )
}

/* ---------- Header ---------- */

export function SidePanelHeader({ children, className = '', ...rest }) {
  return (
    <div className={`sidepanel__header${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/* ---------- Title (with optional subtitle and close) ---------- */

export function SidePanelTitle({ title, subtitle, onClose, className = '', ...rest }) {
  return (
    <div className={`sidepanel__title-wrap${className ? ' ' + className : ''}`} {...rest}>
      <div className="sidepanel__title-text">
        {title && <h3 className="sidepanel__title">{title}</h3>}
        {subtitle && <p className="sidepanel__subtitle">{subtitle}</p>}
      </div>
      {onClose && (
        <button type="button" className="sidepanel__close" onClick={onClose} aria-label="Close panel">
          <IconClose size={16} />
        </button>
      )}
    </div>
  )
}

/* ---------- Body ---------- */

export function SidePanelBody({ children, className = '', ...rest }) {
  return (
    <div className={`sidepanel__body${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/* ---------- Footer (right-aligned actions) ---------- */

export function SidePanelFooter({ children, className = '', ...rest }) {
  return (
    <div className={`sidepanel__footer${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}
