import { useState, useRef, useEffect } from 'react'
import { IconBell, IconCheck, IconInfo, IconSuccess, IconWarning, IconError } from '@/icons'

const typeIcons = {
  info:    <IconInfo size={16} />,
  success: <IconSuccess size={16} />,
  warning: <IconWarning size={16} />,
  error:   <IconError size={16} />,
}

const typeColors = {
  info:    'var(--info)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error:   'var(--danger)',
}

export default function NotificationBell({
  notifications = [],
  onMarkAllRead,
  onNotificationClick,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close on click outside
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const handleToggle = () => setOpen((prev) => !prev)

  const handleMarkAll = () => {
    onMarkAllRead?.()
    setOpen(false)
  }

  const handleItemClick = (notification) => {
    onNotificationClick?.(notification)
    if (!notification.read) {
      // Allow the parent to handle marking as read, close dropdown
      setOpen(false)
    }
  }

  return (
    <div
      className={`notification-bell${className ? ' ' + className : ''}`}
      ref={wrapRef}
    >
      <button
        type="button"
        className="notification-bell__trigger"
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <IconBell size={22} />
        {unreadCount > 0 && (
          <span className="notification-bell__badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-bell__panel" role="menu">
          <div className="notification-bell__panel-header">
            <span className="notification-bell__panel-title">Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-bell__panel-count">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="notification-bell__list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`notification-bell__item${!notification.read ? ' notification-bell__item--unread' : ''}`}
                  role="menuitem"
                  onClick={() => handleItemClick(notification)}
                >
                  <span
                    className="notification-bell__item-icon"
                    style={{ color: typeColors[notification.type] || typeColors.info }}
                  >
                    {typeIcons[notification.type] || typeIcons.info}
                  </span>
                  <div className="notification-bell__item-content">
                    <span className="notification-bell__item-title">
                      {notification.title}
                    </span>
                    {notification.description && (
                      <span className="notification-bell__item-desc">
                        {notification.description}
                      </span>
                    )}
                    <span className="notification-bell__item-time">
                      {notification.time}
                    </span>
                  </div>
                  {!notification.read && (
                    <span className="notification-bell__item-dot" />
                  )}
                </button>
              ))
            ) : (
              <div className="notification-bell__empty">
                <IconBell size={32} />
                <span>No notifications</span>
              </div>
            )}
          </div>

          {unreadCount > 0 && (
            <div className="notification-bell__panel-footer">
              <button
                type="button"
                className="notification-bell__mark-all"
                onClick={handleMarkAll}
              >
                <IconCheck size={14} />
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
