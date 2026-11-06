import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
} from 'react'

/**
 * TabPage — Tabbed interface driven by <TabPagePanel> children.
 *
 * Usage:
 *   <TabPage variant="underline">
 *     <TabPagePanel label="Overview" icon={<IconUsers size={14} />}>
 *       Overview content
 *     </TabPagePanel>
 *     <TabPagePanel label="Billing" badge={3}>
 *       Billing content
 *     </TabPagePanel>
 *     <TabPagePanel label="Disabled" disabled />
 *   </TabPage>
 *
 * The tab list is generated from each panel's `label` (falls back to `title`),
 * `icon`, `badge` and `disabled`; those props are stripped from the rendered
 * panel. Tabs and panels are paired by order. Pass `activeTab` + `onTabChange`
 * to control the selection, or leave them out and the component keeps its own
 * state (starting at `defaultActiveTab`).
 */

const TabPageContext = createContext(null)
const TabPageIndexContext = createContext(null)

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

  // Tab metadata lives on the panels, so collect them (and panels inside
  // fragments) in render order; that order defines the tab list.
  const panels = []
  const collect = (nodes) => {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return
      if (node.type === TabPagePanel) panels.push(node)
      else if (node.type === Fragment) collect(node.props.children)
    })
  }
  collect(children)

  const activeIndex = activeTab !== undefined ? activeTab : localActive
  const safeActive = panels.length
    ? Math.max(0, Math.min(activeIndex, panels.length - 1))
    : 0

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const tabId = (i) => `tab-btn-${uid}-${i}`
  const panelId = (i) => `tab-panel-${uid}-${i}`

  const select = (index) => {
    if (onTabChange) onTabChange(index)
    else setLocalActive(index)
  }

  const selectAndFocus = (index) => {
    select(index)
    const btn = document.getElementById(tabId(index))
    if (btn) btn.focus()
  }

  const isDisabled = (index) => Boolean(panels[index]?.props?.disabled)

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      let next = index + dir
      while (next >= 0 && next < panels.length && isDisabled(next)) {
        next += dir
      }
      if (next >= 0 && next < panels.length) selectAndFocus(next)
      return
    }

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const order =
        e.key === 'Home'
          ? panels.map((_, i) => i)
          : panels.map((_, i) => panels.length - 1 - i)
      const next = order.find((i) => !isDisabled(i))
      if (next !== undefined) selectAndFocus(next)
    }
  }

  return (
    <TabPageContext.Provider
      value={{ activeIndex: safeActive, select, tabId, panelId }}
    >
      <div
        className={`tab-page tab-page--${variant} tab-page--${size}${className ? ' ' + className : ''}`}
        {...rest}
      >
        {panels.length > 0 && (
          <div className="tab-page__header" role="tablist">
            {panels.map((panel, index) => {
              const { label, title, icon, badge, disabled = false } =
                panel.props ?? {}
              const isActive = index === safeActive

              return (
                <button
                  key={panel.key ?? index}
                  id={tabId(index)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={disabled}
                  aria-controls={panelId(index)}
                  tabIndex={isActive ? 0 : -1}
                  className={`tab-page__tab${isActive ? ' tab-page__tab--active' : ''}${disabled ? ' tab-page__tab--disabled' : ''}`}
                  onClick={() => !disabled && select(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                >
                  {icon && <span className="tab-page__tab-icon">{icon}</span>}
                  <span className="tab-page__tab-label">
                    {label || title || `Tab ${index + 1}`}
                  </span>
                  {badge !== undefined && badge !== null && (
                    <span className="tab-page__tab-badge">{badge}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        <div className="tab-page__body">
          {panels.map((panel, index) => (
            <TabPageIndexContext.Provider key={panel.key ?? index} value={index}>
              {panel}
            </TabPageIndexContext.Provider>
          ))}
        </div>
      </div>
    </TabPageContext.Provider>
  )
}

/* ---------- Panel (tab metadata + content) ---------- */

export function TabPagePanel({ children, className = '', ...rest }) {
  const ctx = useContext(TabPageContext)
  const index = useContext(TabPageIndexContext)

  // `label`, `title`, `icon`, `badge` and `disabled` describe the generated
  // tab, so they must not be forwarded to the DOM element.
  const domProps = { ...rest }
  delete domProps.label
  delete domProps.title
  delete domProps.icon
  delete domProps.badge
  delete domProps.disabled

  if (!ctx || index === null) return null

  const isActive = index === ctx.activeIndex

  return (
    <div
      id={ctx.panelId(index)}
      role="tabpanel"
      aria-labelledby={ctx.tabId(index)}
      className={`tab-page__panel${className ? ' ' + className : ''}`}
      hidden={!isActive}
      {...domProps}
    >
      {isActive && children}
    </div>
  )
}
