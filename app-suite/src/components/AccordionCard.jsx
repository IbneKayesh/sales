import {
  Children,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { IconChevronDown } from '@/icons'

const AccordionContext = createContext(null)
const AccordionItemIndexContext = createContext(null)

/* ─── AccordionCard — groups AccordionBody children ─── */
export function AccordionCard({
  allowMultiple = false,
  className = '',
  children,
}) {
  const items = Children.toArray(children)

  const [expandedIds, setExpandedIds] = useState(() => {
    const initial = new Set()
    items.forEach((child, index) => {
      if (child?.props?.defaultExpanded && !child?.props?.disabled) {
        initial.add(index)
      }
    })
    return initial
  })

  const isExpanded = (id) => expandedIds.has(id)

  const toggle = (id, expanding) => {
    setExpandedIds((prev) => {
      if (allowMultiple) {
        const next = new Set(prev)
        if (expanding) next.add(id)
        else next.delete(id)
        return next
      }
      return expanding ? new Set([id]) : new Set()
    })
  }

  return (
    <AccordionContext.Provider value={{ isExpanded, toggle }}>
      <div className={`accordion-card${className ? ' ' + className : ''}`}>
        {items.map((child, index) => (
          <AccordionItemIndexContext.Provider
            key={child.key ?? index}
            value={index}
          >
            {child}
          </AccordionItemIndexContext.Provider>
        ))}
      </div>
    </AccordionContext.Provider>
  )
}

/* ─── AccordionBody — single collapsible section ─── */
export function AccordionBody({
  title,
  children,
  disabled = false,
  onToggle,
  defaultExpanded = false,
  keepMounted = true,
  className = '',
}) {
  const group = useContext(AccordionContext)
  const index = useContext(AccordionItemIndexContext)
  const autoId = useId()
  const id = index !== null ? index : autoId

  const [standaloneExpanded, setStandaloneExpanded] = useState(
    !!defaultExpanded,
  )
  const isExpanded = group ? group.isExpanded(id) : standaloneExpanded

  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)
  const contentId = `accordion-content-${String(id).replace(/[^a-zA-Z0-9_-]/g, '')}`

  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    setContentHeight(isExpanded ? el.scrollHeight : 0)
  }, [isExpanded, children, title])

  const handleToggle = () => {
    if (disabled) return
    const next = !isExpanded
    if (group) group.toggle(id, next)
    else setStandaloneExpanded(next)
    if (onToggle) onToggle(next)
  }

  return (
    <div
      className={[
        'accordion-card__item',
        isExpanded ? 'accordion-card__item--expanded' : '',
        disabled ? 'accordion-card__item--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        className="accordion-card__header"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={contentId}
      >
        <span className="accordion-card__title">{title}</span>
        <span
          className={`accordion-card__chevron${isExpanded ? ' accordion-card__chevron--open' : ''}`}
        >
          <IconChevronDown size={16} />
        </span>
      </button>

      <div
        id={contentId}
        className="accordion-card__content"
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        {(isExpanded || keepMounted) && (
          <div className="accordion-card__body">{children}</div>
        )}
      </div>
    </div>
  )
}

export default AccordionCard
