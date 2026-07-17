import { useState, useEffect, useCallback } from 'react'
import { IconSuccess, IconError, IconInfo, IconWarning, IconClose } from '../icons'

let toastId = 0
let addToastFn = null

export function toast(message, options = {}) {
  if (addToastFn) {
    addToastFn({
      id: ++toastId,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
    })
  }
}

toast.success = (msg, opts) => toast(msg, { ...opts, type: 'success' })
toast.error = (msg, opts) => toast(msg, { ...opts, type: 'error' })
toast.info = (msg, opts) => toast(msg, { ...opts, type: 'info' })
toast.warning = (msg, opts) => toast(msg, { ...opts, type: 'warning' })

export default function ToastBox({ maxToasts = 5, className = '' }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev.slice(-(maxToasts - 1)), t])
  }, [maxToasts])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className={`toast-box${className ? ' ' + className : ''}`} aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}

function ToastItem({ toast: t, onRemove }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onRemove(t.id), 250)
    }, t.duration)
    return () => clearTimeout(timer)
  }, [t.id, t.duration, onRemove])

  const icons = {
    success: <IconSuccess size={18} />,
    error: <IconError size={18} />,
    info: <IconInfo size={18} />,
    warning: <IconWarning size={18} />,
  }

  return (
    <div className={`toast-item toast-item--${t.type}${exiting ? ' toast-item--exiting' : ''}`} role="alert">
      <span className="toast-item__icon">{icons[t.type] || icons.info}</span>
      <span className="toast-item__message">{t.message}</span>
      <button
        type="button"
        className="toast-item__close"
        onClick={() => {
          setExiting(true)
          setTimeout(() => onRemove(t.id), 250)
        }}
        aria-label="Close"
      >
        <IconClose size={14} />
      </button>
    </div>
  )
}
