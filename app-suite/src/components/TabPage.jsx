import { useState, useRef } from 'react'

export default function TabPage({
  tabs = [],
  activeTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className = '',
  ...rest
}) {
  const [localActive, setLocalActive] = useState(0)
  const activeIdx = activeTab !== undefined ? activeTab : localActive
  const safeIdx = Math.min(activeIdx, tabs.length - 1)
  const uid = useRef(`tp-${Math.random().toString(36).slice(2, 6)}`).current
  const panelId = (i) => `tab-panel-${uid}-${i}`
  const tabBtnId = (i) => `tab-btn-${uid}-${i}`

  const handleClick = (i) => {
    if (onTabChange) {
      onTabChange(i)
    } else {
      setLocalActive(i)
    }
    // Programmatically focus the newly selected tab
    const btn = document.getElementById(tabBtnId(i))
    if (btn) btn.focus()
  }

  const handleKeyDown = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) {
      if (e.key === 'Home') {
        e.preventDefault()
        const first = tabs.findIndex((t) => !t.disabled)
        if (first !== -1) handleClick(first)
      } else if (e.key === 'End') {
        e.preventDefault()
        const last = tabs.length - 1 - [...tabs].reverse().findIndex((t) => !t.disabled)
        if (last >= 0) handleClick(last)
      }
      return
    }
    e.preventDefault()
    let next = i + dir
    while (next >= 0 && next < tabs.length && tabs[next].disabled) {
      next += dir
    }
    if (next >= 0 && next < tabs.length) {
      handleClick(next)
    }
  }

  if (!tabs.length) return null

  return (
    <div className={`tab-page tab-page--${variant} tab-page--${size}${className ? ' ' + className : ''}`} {...rest}>
      <div className="tab-page__header" role="tablist">
        {tabs.map((tab, i) => {
          const isActive = i === safeIdx
          const disabled = tab.disabled || false
          const tabId = tabBtnId(i)
          const pId = panelId(i)
          return (
            <button
              key={tab.key ?? i}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={disabled}
              aria-controls={pId}
              tabIndex={isActive ? 0 : -1}
              className={`tab-page__tab${isActive ? ' tab-page__tab--active' : ''}${disabled ? ' tab-page__tab--disabled' : ''}`}
              onClick={() => !disabled && handleClick(i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            >
              {tab.icon && <span className="tab-page__tab-icon">{tab.icon}</span>}
              <span className="tab-page__tab-label">{tab.label || tab.title}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span className="tab-page__tab-badge">{tab.badge}</span>
              )}
            </button>
          )
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.key ?? i}
          id={panelId(i)}
          role="tabpanel"
          aria-labelledby={tabBtnId(i)}
          className="tab-page__body"
          hidden={i !== safeIdx}
        >
          {i === safeIdx && tab.content}
        </div>
      ))}
    </div>
  )
}
