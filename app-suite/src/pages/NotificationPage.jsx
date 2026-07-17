import { useState, useMemo } from 'react'
import PageCard, { PageCardBody } from '../components/PageCard'
import Button from '../components/Button'
import GroupButton from '../components/GroupButton'
import Badge from '../components/Badge'
import { toast } from '../components/ToastBox'
import { IconCheck, IconClose, IconDollar, IconBox, IconActivity, IconDelete, IconBell } from '../icons'

/* ─── Mock notifications ──────── */

const allNotifications = [
  { id: 1, type: 'success', icon: <IconDollar size={16} />, title: 'Payment received', message: '$3,500 from ABC Corp — Invoice #1024', time: '2025-07-22T10:23:00', read: false, category: 'finance' },
  { id: 2, type: 'warning', icon: <IconBox size={16} />, title: 'Low stock alert', message: 'Office supplies running low — 3 items below reorder threshold', time: '2025-07-22T09:45:00', read: false, category: 'inventory' },
  { id: 3, type: 'info', icon: <IconActivity size={16} />, title: 'New user registered', message: 'Leo Martinez created an account with Contributor role', time: '2025-07-22T08:12:00', read: false, category: 'system' },
  { id: 4, type: 'danger', icon: <IconClose size={16} />, title: 'Payment failed', message: 'Google Ads campaign payment of $1,500 declined — update billing information', time: '2025-07-22T06:30:00', read: true, category: 'finance' },
  { id: 5, type: 'success', icon: <IconCheck size={16} />, title: 'Report ready', message: 'Q3 Financial Summary is available for download in Reports', time: '2025-07-21T16:00:00', read: true, category: 'reports' },
  { id: 6, type: 'info', icon: <IconBell size={16} />, title: 'System update', message: 'ERP Suite v2.4.0 will be deployed tonight at 2:00 AM EST', time: '2025-07-21T14:15:00', read: true, category: 'system' },
  { id: 7, type: 'warning', icon: <IconBox size={16} />, title: 'Subscription expiring', message: 'Adobe Creative Cloud license renews in 7 days — $599.99/year', time: '2025-07-21T11:00:00', read: false, category: 'finance' },
  { id: 8, type: 'success', icon: <IconDollar size={16} />, title: 'Invoice paid', message: 'Invoice #1023 — $2,400 received from Smith Consulting', time: '2025-07-20T15:30:00', read: true, category: 'finance' },
  { id: 9, type: 'danger', icon: <IconClose size={16} />, title: 'Server alert', message: 'Response time exceeded 2s threshold on production server', time: '2025-07-20T13:22:00', read: false, category: 'system' },
  { id: 10, type: 'info', icon: <IconActivity size={16} />, title: 'Backup completed', message: 'Daily database backup completed successfully — 1.2 GB', time: '2025-07-20T04:00:00', read: true, category: 'system' },
  { id: 11, type: 'warning', icon: <IconBox size={16} />, title: 'Budget threshold', message: 'Marketing department has used 85% of Q3 budget', time: '2025-07-19T10:45:00', read: true, category: 'finance' },
  { id: 12, type: 'success', icon: <IconCheck size={16} />, title: 'User activated', message: 'Kate Garcia has been reactivated by Admin', time: '2025-07-19T09:00:00', read: false, category: 'system' },
]

/* ─── Helpers ──────── */

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const typeToVariant = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
}

/* ─── Component ──────── */

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
]

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(new Set())

  const filtered = useMemo(() => {
    if (filter === 'unread') return notifications.filter((n) => !n.read)
    if (filter === 'read') return notifications.filter((n) => n.read)
    return notifications
  }, [notifications, filter])

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    )
  }

  const deleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next })
    toast.success('Notification deleted')
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selected.has(n.id)))
    const count = selected.size
    setSelected(new Set())
    toast.success(`${count} notification${count > 1 ? 's' : ''} deleted`)
  }

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((n) => n.id)))
    }
  }

  return (
    <div className="page-wrap">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--sp-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{
            fontSize: 'var(--fs-2xl)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            Notifications
          </h2>
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-muted)',
            margin: 'var(--sp-1) 0 0',
          }}>
            {notifications.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexShrink: 0, alignItems: 'center' }}>
          <GroupButton
            options={filterOptions}
            value={filter}
            name="filter"
            onChange={(e) => { setFilter(e.target.value); setSelected(new Set()) }}
            size="sm"
          />
          {unreadCount > 0 && (
            <Button variant="ghost" size="xs" onClick={markAllRead}>
              <IconCheck size={12} className="icon-left" />
              Mark all read
            </Button>
          )}
          {selected.size > 0 && (
            <Button variant="ghost" size="xs" className="btn--icon-danger" onClick={deleteSelected}>
              <IconDelete size={12} className="icon-left" />
              Delete ({selected.size})
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <PageCard>
        <PageCardBody style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--sp-3)',
              padding: 'var(--sp-10) var(--sp-6)',
              color: 'var(--text-muted)',
            }}>
              <IconBell size={32} style={{ opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>
                {filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications'}
              </p>
            </div>
          ) : (
            <>
              {/* Select all header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-2) var(--sp-4)',
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface-alt)',
              }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  cursor: 'pointer',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--text-secondary)',
                  fontWeight: 'var(--fw-medium)',
                  userSelect: 'none',
                }}>
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleSelectAll}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  Select all
                </label>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                  {selected.size > 0 ? `${selected.size} selected` : `${filtered.length} notification${filtered.length !== 1 ? 's' : ''}`}
                </span>
              </div>

              {/* Notification items */}
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className={`topbar__notif-item${!n.read ? ' topbar__notif-item--unread' : ''}`}
                  style={{
                    padding: 'var(--sp-3) var(--sp-4)',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(n.id)}
                      onChange={() => toggleSelect(n.id)}
                      style={{ marginTop: 7, accentColor: 'var(--primary)' }}
                    />
                  </div>
                  <span className={`topbar__notif-item-icon topbar__notif-item-icon--${n.type}`}>
                    {n.icon}
                  </span>
                  <div className="topbar__notif-item-content" style={{ cursor: 'pointer' }} onClick={() => toggleRead(n.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                      <span className="topbar__notif-item-title">{n.title}</span>
                      <Badge variant={typeToVariant[n.type]} dot />
                    </div>
                    <span className="topbar__notif-item-message">{n.message}</span>
                    <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 3 }}>
                      <span className="topbar__notif-item-time" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {formatDate(n.time)}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--primary)',
                        fontWeight: 'var(--fw-semibold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}>
                        {n.category}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--sp-1)', flexShrink: 0, alignItems: 'flex-start' }}>
                    {!n.read && (
                      <button
                        type="button"
                        className="topbar__profile-action"
                        style={{ width: 28, height: 28, padding: 0, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                        onClick={() => toggleRead(n.id)}
                        title="Mark as read"
                      >
                        <IconCheck size={12} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="topbar__profile-action"
                      style={{ width: 28, height: 28, padding: 0, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                      onClick={() => deleteNotif(n.id)}
                      title="Delete"
                    >
                      <IconClose size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </PageCardBody>
      </PageCard>
    </div>
  )
}
