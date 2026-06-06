import React, { useState } from 'react';

export default function NotificationPage({ notifications = [], onMarkRead, onMarkAllRead, onDismiss }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'read'

  const filtered = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '20px', animation: 'windowOpen 0.2s ease', fontFamily: 'var(--font-family)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span style={{
                background: '#e81123', color: 'white', fontSize: '11px', fontWeight: '700',
                padding: '1px 7px', borderRadius: '10px'
              }}>{unreadCount}</span>
            )}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            System alerts, reminders, and ERP notifications.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{
              background: 'rgba(96,205,255,0.1)', border: '1px solid rgba(96,205,255,0.3)',
              color: 'var(--accent-light)', padding: '7px 14px', borderRadius: '4px',
              cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-family)', transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,205,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,205,255,0.1)'}
          >
            ✓ Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--border-acrylic)', paddingBottom: '0' }}>
        {['all', 'unread', 'read'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '8px 16px', fontSize: '13px', fontFamily: 'var(--font-family)',
              color: activeTab === tab ? 'var(--accent-light)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent-light)' : '2px solid transparent',
              transition: 'all 0.15s', marginBottom: '-1px',
              fontWeight: activeTab === tab ? '600' : '400',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'unread' && unreadCount > 0 && (
              <span style={{
                marginLeft: '6px', background: '#e81123', color: 'white',
                fontSize: '10px', padding: '1px 5px', borderRadius: '8px'
              }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔕</div>
          <div style={{ fontSize: '13px' }}>No {activeTab === 'all' ? '' : activeTab} notifications</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(n => (
            <div
              key={n.id}
              className={`notif-item ${n.read ? 'read' : 'unread'}`}
              style={{ borderRadius: '6px', background: n.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,120,212,0.06)' }}
              onClick={() => !n.read && onMarkRead(n.id)}
            >
              <div className="notif-item-icon">{n.icon}</div>
              <div className="notif-item-body">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-text">{n.body}</div>
                <div className="notif-item-time">{n.timestamp}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                {!n.read && (
                  <button
                    onClick={e => { e.stopPropagation(); onMarkRead(n.id); }}
                    style={{
                      background: 'rgba(96,205,255,0.12)', border: 'none', color: 'var(--accent-light)',
                      padding: '3px 8px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer',
                      fontFamily: 'var(--font-family)'
                    }}
                  >Mark Read</button>
                )}
                <button
                  onClick={e => { e.stopPropagation(); onDismiss && onDismiss(n.id); }}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--text-muted)',
                    padding: '3px 8px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer',
                    fontFamily: 'var(--font-family)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e81123'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
