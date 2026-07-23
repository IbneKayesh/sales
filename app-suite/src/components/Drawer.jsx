import { useEffect, useCallback, useState, useRef } from 'react'
import { IconClose } from '../icons'

/**
 * Drawer — Slide-in overlay panel for navigation, filters, or secondary content.
 *
 * Usage:
 *   <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="left" size="md">
 *     <DrawerHeader title="Navigation" onClose={() => setIsOpen(false)} />
 *     <DrawerBody>
 *       <DrawerGroup label="Main">
 *         <DrawerItem icon={...} label="Dashboard" active />
 *         <DrawerItem icon={...} label="Settings" />
 *       </DrawerGroup>
 *     </DrawerBody>
 *   </Drawer>
 */

export default function Drawer({
  open = false,
  onClose,
  position = 'left',    // 'left' | 'right'
  size = 'md',          // sm | md | lg | xl
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = '',
  ...rest
}) {
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef(null)

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
    }
  }

  const overlayClass = `drawer-overlay${closing ? ' drawer-overlay--closing' : ''}`
  const drawerClass = `drawer drawer--${position} drawer--${size}${closing ? ' drawer--closing' : ''}${className ? ' ' + className : ''}`

  return (
    <div className={overlayClass} onClick={handleBackdrop} role="dialog" aria-modal="true" {...rest}>
      <div className={drawerClass}>
        {children}
      </div>
    </div>
  )
}

/* ---------- Header ---------- */

export function DrawerHeader({ children, title, subtitle, onClose, className = '', ...rest }) {
  const content = children || (
    <div className="drawer__title-wrap">
      <div className="drawer__title-text">
        {title && <h3 className="drawer__title">{title}</h3>}
        {subtitle && <p className="drawer__subtitle">{subtitle}</p>}
      </div>
      {onClose && (
        <button type="button" className="drawer__close" onClick={onClose} aria-label="Close drawer">
          <IconClose size={16} />
        </button>
      )}
    </div>
  )

  return (
    <div className={`drawer__header${className ? ' ' + className : ''}`} {...rest}>
      {content}
    </div>
  )
}

/* ---------- Body ---------- */

export function DrawerBody({ children, className = '', ...rest }) {
  return (
    <div className={`drawer__body${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/* ---------- Group (collapsible section) ---------- */

export function DrawerGroup({ label, icon, children, defaultOpen = true, className = '', ...rest }) {
  const [expanded, setExpanded] = useState(defaultOpen)

  return (
    <div className={`drawer__group${className ? ' ' + className : ''}`} {...rest}>
      <button
        type="button"
        className="drawer__group-btn"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        {icon && <span className="drawer__group-icon">{icon}</span>}
        <span className="drawer__group-label">{label}</span>
        <svg
          className={`drawer__group-chevron${expanded ? ' drawer__group-chevron--open' : ''}`}
          viewBox="0 0 16 16"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 4 10 8 6 12" />
        </svg>
      </button>
      {expanded && (
        <div className="drawer__group-items">
          {children}
        </div>
      )}
    </div>
  )
}

/* ---------- Item (nav link) ---------- */

export function DrawerItem({
  icon,
  label,
  badge,
  active = false,
  disabled = false,
  onClick,
  href,
  className = '',
  ...rest
}) {
  const content = (
    <>
      {icon && <span className="drawer__item-icon">{icon}</span>}
      <span className="drawer__item-label">{label}</span>
      {badge && <span className="drawer__item-badge">{badge}</span>}
    </>
  )

  const itemClass = `drawer__item${active ? ' drawer__item--active' : ''}${disabled ? ' drawer__item--disabled' : ''}${className ? ' ' + className : ''}`

  if (href && !disabled) {
    return (
      <a href={href} className={itemClass} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={itemClass}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      {...rest}
    >
      {content}
    </button>
  )
}

/* ---------- Divider ---------- */

export function DrawerDivider({ className = '', ...rest }) {
  return (
    <hr className={`drawer__divider${className ? ' ' + className : ''}`} {...rest} />
  )
}

/* ---------- Footer ---------- */

export function DrawerFooter({ children, className = '', ...rest }) {
  return (
    <div className={`drawer__footer${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}
