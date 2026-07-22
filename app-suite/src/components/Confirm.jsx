import { useState, useEffect, useRef } from 'react'
import Button from './Button'
import { IconInfo } from '../icons'

export default function Confirm({
  open = false,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Yes',
  cancelText = 'No',
  variant = 'primary',
  onConfirm,
  onCancel,
  confirmOnly = false,
  className = '',
  ...rest
}) {
  const [confirming, setConfirming] = useState(false)
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

  if (!mounted) return null

  const handleConfirm = async () => {
    setConfirming(true)
    try {
      await onConfirm?.()
    } finally {
      setConfirming(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !confirmOnly && !closing) {
      onCancel?.()
    }
  }

  const overlayClass = `confirm-overlay${closing ? ' confirm-overlay--closing' : ''}`
  const dialogClass = `confirm${closing ? ' confirm--closing' : ''}${className ? ' ' + className : ''}`

  return (
    <div className={overlayClass} onClick={handleBackdropClick} {...rest}>
      <div className={dialogClass} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="confirm__icon-wrap">
          <div className="confirm__icon">
            <IconInfo size={24} />
          </div>
        </div>
        <h3 id="confirm-title" className="confirm__title">{title}</h3>
        <p className="confirm__message">{message}</p>
        <div className="confirm__actions">
          {!confirmOnly && (
            <Button key="cancel" variant="secondary" size="md" onClick={onCancel} disabled={confirming}>
              {cancelText}
            </Button>
          )}
          <Button key="confirm" variant={variant} size="md" onClick={handleConfirm} loading={confirming}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}