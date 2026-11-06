import { Children, createContext, useContext, useId, useState } from 'react'

/**
 * TabPage — Tabbed interface with a compound (Modal/SidePanel style) API.
 *
 * Usage:
 *   <TabPage variant="underline" size="md" defaultActiveTab={0}>
 *     <TabPageHeader>
 *       <TabPageTab label="Overview" icon={<IconUsers size={14} />} />
 *       <TabPageTab label="Billing" badge={3} />
 *       <TabPageTab label="Disabled" disabled />
 *     </TabPageHeader>
 *     <TabPageBody>
 *       <TabPagePanel>Overview content</TabPagePanel>
 *       <TabPagePanel>Billing content</TabPagePanel>
 *       <TabPagePanel>Disabled content</TabPagePanel>
 *     </TabPageBody>
 *   </TabPage>
 *
 * Tabs and panels are paired by order, so keep the two lists in the same order.
 * Pass `activeTab` + `onTabChange` to control the selection, or leave them out
 * and the component keeps its own state (starting at `defaultActiveTab`).
 */

const TabPageContext = createContext(null)
const TabPageIndexContext = createContext(null)
const TabPageNavContext = createContext(null)

export default function TabPage({
  activeTab,
  defaultActiveTab = 0,
  onTabChange,
  variant = 'underline',   // underline | pills | buttons
  size = 'md',             // sm | md | lg
  className = '',
  children,
  ...rest
}) {
  const [localActive, setLocalActive] = useState(defaultActiveTab)
  const activeIndex = activeTab !== undefined ? activeTab : localActive

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const tabId = (i) => `tab-btn-${uid}-${i}`
  const panelId = (i) => `tab-panel-${uid}-${i}`

  const select = (index) => {
    if (onTabChange) onTabChange(index)
    else setLocalActive(index)
  }

  return (
    <TabPageContext.Provider value={{ activeIndex, select, tabId, panelId }}>
      <div
        className={`tab-page tab-page--${variant} tab-page--${size}${className ? ' ' + className : ''}`}
        {...rest}
      >
        {children}
      </div>
    </TabPageContext.Provider>
  )
}

/* ---------- Header (tablist) ---------- */

export function TabPageHeader({ children, className = '', ...rest }) {
  const ctx = useContext(TabPageContext)
  const tabs = Children.toArray(children)

  const selectAndFocus = (index) => {
    ctx.select(index)
    const btn = document.getElementById(ctx.tabId(index))
    if (btn) btn.focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      let next = index + dir
      while (next >= 0 && next < tabs.length && tabs[next]?.props?.disabled) {
        next += dir
      }
      if (next >= 0 && next < tabs.length) selectAndFocus(next)
      return
    }

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const ordered = e.key === 'Home' ? tabs : [...tabs].reverse()
      const found = ordered.findIndex((tab) => !tab?.props?.disabled)
      if (found === -1) return
      selectAndFocus(e.key === 'Home' ? found : tabs.length - 1 - found)
    }
  }

  if (!ctx) return null

  return (
    <TabPageNavContext.Provider value={handleKeyDown}>
      <div
        className={`tab-page__header${className ? ' ' + className : ''}`}
        role="tablist"
        {...rest}
      >
        {tabs.map((tab, index) => (
          <TabPageIndexContext.Provider key={tab.key ?? index} value={index}>
            {tab}
          </TabPageIndexContext.Provider>
        ))}
      </div>
    </TabPageNavContext.Provider>
  )
}

/* ---------- Tab (trigger button) ---------- */

export function TabPageTab({
  label,
  icon,
  badge,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const ctx = useContext(TabPageContext)
  const index = useContext(TabPageIndexContext)
  const handleKeyDown = useContext(TabPageNavContext)

  if (!ctx || index === null) return null

  const isActive = index === ctx.activeIndex

  return (
    <button
      id={ctx.tabId(index)}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      aria-controls={ctx.panelId(index)}
      tabIndex={isActive ? 0 : -1}
      className={`tab-page__tab${isActive ? ' tab-page__tab--active' : ''}${disabled ? ' tab-page__tab--disabled' : ''}${className ? ' ' + className : ''}`}
      onClick={() => !disabled && ctx.select(index)}
      onKeyDown={(e) => handleKeyDown?.(e, index)}
      {...rest}
    >
      {icon && <span className="tab-page__tab-icon">{icon}</span>}
      <span className="tab-page__tab-label">{label ?? children}</span>
      {badge !== undefined && badge !== null && (
        <span className="tab-page__tab-badge">{badge}</span>
      )}
    </button>
  )
}

/* ---------- Body (panel container) ---------- */

export function TabPageBody({ children, className = '', ...rest }) {
  const panels = Children.toArray(children)

  return (
    <div
      className={`tab-page__body${className ? ' ' + className : ''}`}
      {...rest}
    >
      {panels.map((panel, index) => (
        <TabPageIndexContext.Provider key={panel.key ?? index} value={index}>
          {panel}
        </TabPageIndexContext.Provider>
      ))}
    </div>
  )
}

/* ---------- Panel (content for the matching tab) ---------- */

export function TabPagePanel({ children, className = '', ...rest }) {
  const ctx = useContext(TabPageContext)
  const index = useContext(TabPageIndexContext)

  if (!ctx || index === null) return null

  const isActive = index === ctx.activeIndex

  return (
    <div
      id={ctx.panelId(index)}
      role="tabpanel"
      aria-labelledby={ctx.tabId(index)}
      className={`tab-page__panel${className ? ' ' + className : ''}`}
      hidden={!isActive}
      {...rest}
    >
      {isActive && children}
    </div>
  )
}
