import { useState, useRef } from 'react'
import { IconChevronDown } from '@/icons'

/* ─── Single Accordion Item ─── */
function AccordionItem({
  title,
  children,
  expanded,
  onToggle,
  disabled,
  defaultExpanded,
  keepMounted = true,
  itemIndex,
}) {
  const [localExpanded, setLocalExpanded] = useState(!!defaultExpanded)
  const isExpanded = expanded !== undefined ? !!expanded : localExpanded
  const contentRef = useRef(null)

  const handleToggle = () => {
    if (disabled) return
    if (onToggle) {
      onToggle(itemIndex, !isExpanded)
    } else {
      setLocalExpanded((prev) => !prev)
    }
  }

  return (
    <div className={`accordion-card__item${isExpanded ? ' accordion-card__item--expanded' : ''}${disabled ? ' accordion-card__item--disabled' : ''}`}>
      <button
        type="button"
        className="accordion-card__header"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-controls={`acc-content-${itemIndex}`}
      >
        <span className="accordion-card__title">{title}</span>
        <span className={`accordion-card__chevron${isExpanded ? ' accordion-card__chevron--open' : ''}`}>
          <IconChevronDown size={16} />
        </span>
      </button>

      <div
        id={`acc-content-${itemIndex}`}
        className="accordion-card__content"
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        {(isExpanded || keepMounted) && (
          <div className="accordion-card__body">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── AccordionCard Group ─── */
export default function AccordionCard({
  items = [],
  defaultExpandedIndex,
  allowMultiple = false,
  className = '',
  keepMounted = true,
}) {
  const [expandedSet, setExpandedSet] = useState(() => {
    if (defaultExpandedIndex !== undefined) {
      return new Set(Array.isArray(defaultExpandedIndex) ? defaultExpandedIndex : [defaultExpandedIndex])
    }
    return new Set()
  })

  const handleToggle = (index, expanding) => {
    if (allowMultiple) {
      setExpandedSet((prev) => {
        const next = new Set(prev)
        if (expanding) next.add(index)
        else next.delete(index)
        return next
      })
    } else {
      setExpandedSet(new Set(expanding ? [index] : []))
    }
  }

  if (!items.length) return null

  return (
    <div className={`accordion-card${className ? ' ' + className : ''}`}>
      {items.map((item, i) => (
        <AccordionItem
          key={item.key ?? i}
          title={item.title}
          expanded={item.expanded ?? (item.controlled === false ? undefined : expandedSet.has(i))}
          onToggle={(item.controlled !== false) ? handleToggle : item.onToggle}
          disabled={item.disabled}
          defaultExpanded={item.defaultExpanded}
          keepMounted={item.keepMounted ?? keepMounted}
          itemIndex={i}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}
