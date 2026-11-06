import { Children, createContext, useContext, useState } from 'react'
import { IconPlus, IconMenu } from '@/icons'

/**
 * KanbanBoard — Drag-and-drop task board with a compound API.
 *
 * Usage:
 *   <KanbanBoard
 *     onCardMove={(cardId, fromCol, toCol, toIndex) => {}}
 *     onCardClick={(card) => {}}
 *     onAddCard={(columnId) => {}}
 *   >
 *     <KanbanColumn id="todo" title="To Do">
 *       <KanbanCard
 *         id="k1"
 *         title="Design dashboard"
 *         description="Wireframes for the analytics view"
 *         labels={[{ text: 'Design', color: 'var(--primary)' }]}
 *         assignees={[{ name: 'Alice' }]}
 *       />
 *     </KanbanColumn>
 *   </KanbanBoard>
 *
 * Card `id`s must be unique across the whole board — they track the card while
 * it is dragged between columns.
 */

const KanbanBoardContext = createContext(null)
const KanbanColumnContext = createContext(null)
const KanbanCardIdContext = createContext(null)

export default function KanbanBoard({
  onCardMove,
  onCardClick,
  onAddCard,
  className = '',
  children,
  ...rest
}) {
  const columnElements = Children.toArray(children)

  // Model the columns/cards from the children so drag-and-drop can reorder them.
  const columns = columnElements.map((el, i) => {
    const id = el.props?.id ?? `kanban-col-${i}`
    const cards = Children.toArray(el.props?.children).map((card, j) => ({
      id: card.props?.id ?? `kanban-card-${id}-${j}`,
      element: card,
    }))
    return { id, title: el.props?.title, element: el, cards }
  })

  const cardElements = new Map()
  columns.forEach((col) =>
    col.cards.forEach((card) => cardElements.set(card.id, card.element)),
  )

  const [order, setOrder] = useState(() => {
    const initial = {}
    columns.forEach((col) => {
      initial[col.id] = col.cards.map((card) => card.id)
    })
    return initial
  })
  const [dragged, setDragged] = useState(null) // { cardId, columnId }
  const [dragOver, setDragOver] = useState(null) // { columnId, index }

  // Resolve each column's card order: local order first, then any cards it
  // still owns but that are not in the order yet. Ids are deduped so a moved
  // card never renders in two columns.
  const seen = new Set()
  const resolved = columns.map((col) => {
    const ids = []
    for (const id of order[col.id] ?? []) {
      if (!cardElements.has(id) || seen.has(id)) continue
      seen.add(id)
      ids.push(id)
    }
    for (const { id } of col.cards) {
      if (seen.has(id)) continue
      seen.add(id)
      ids.push(id)
    }
    return { ...col, ids }
  })

  const getDropIndex = (e) => {
    const cardNodes = e.currentTarget.querySelectorAll('.kanban-card')
    let index = cardNodes.length
    cardNodes.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      if (e.clientY > rect.top + rect.height / 2) index = i + 1
    })
    return index
  }

  const handleDragStart = (cardId, columnId) => {
    setDragged({ cardId, columnId })
  }

  const handleDragEnd = () => {
    setDragged(null)
    setDragOver(null)
  }

  const handleDragOver = (columnId, e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver({ columnId, index: getDropIndex(e) })
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null)
  }

  const handleDrop = (columnId, e) => {
    e.preventDefault()
    if (!dragged) return

    const { cardId, columnId: fromColumnId } = dragged
    let toIndex = getDropIndex(e)

    const fromIds = order[fromColumnId] ?? []
    const fromIndex = fromIds.indexOf(cardId)
    if (fromColumnId === columnId && fromIndex !== -1 && fromIndex < toIndex) {
      toIndex -= 1
    }

    setOrder((prev) => {
      const next = {}
      Object.keys(prev).forEach((key) => {
        next[key] = prev[key].filter((id) => id !== cardId)
      })
      const target = next[columnId] ? [...next[columnId]] : []
      target.splice(Math.min(toIndex, target.length), 0, cardId)
      next[columnId] = target
      return next
    })

    setDragged(null)
    setDragOver(null)

    onCardMove?.(cardId, fromColumnId, columnId, toIndex)
  }

  return (
    <KanbanBoardContext.Provider
      value={{
        draggedCardId: dragged?.cardId ?? null,
        onCardClick,
        onAddCard,
        handleDragStart,
        handleDragEnd,
      }}
    >
      <div className={`kanban-board${className ? ' ' + className : ''}`} {...rest}>
        <div className="kanban-board__columns">
          {resolved.map((col) => (
            <KanbanColumnContext.Provider
              key={col.id}
              value={{
                columnId: col.id,
                cards: col.ids.map((id) => ({
                  id,
                  element: cardElements.get(id),
                })),
                isDragOver: dragOver?.columnId === col.id,
                onDragOver: (e) => handleDragOver(col.id, e),
                onDragLeave: handleDragLeave,
                onDrop: (e) => handleDrop(col.id, e),
              }}
            >
              {col.element}
            </KanbanColumnContext.Provider>
          ))}
        </div>

        {columns.length === 0 && (
          <div className="kanban-board__empty">
            <span>No columns defined</span>
          </div>
        )}
      </div>
    </KanbanBoardContext.Provider>
  )
}

/* ---------- Column ---------- */

export function KanbanColumn({ id, title, className = '', ...rest }) {
  const board = useContext(KanbanBoardContext)
  const column = useContext(KanbanColumnContext)

  if (!column) return null

  const cards = column.cards.filter((card) => card.element)

  return (
    <div
      className={`kanban-column${column.isDragOver ? ' kanban-column--drag-over' : ''}${className ? ' ' + className : ''}`}
      data-column-id={id ?? column.columnId}
      onDragOver={column.onDragOver}
      onDragLeave={column.onDragLeave}
      onDrop={column.onDrop}
      {...rest}
    >
      <div className="kanban-column__header">
        <div className="kanban-column__header-left">
          <span className="kanban-column__title">{title}</span>
          <span className="kanban-column__count">{cards.length}</span>
        </div>
        <button
          type="button"
          className="kanban-column__add-btn"
          aria-label={`Add card to ${title}`}
          title={`Add to ${title}`}
          onClick={() => board?.onAddCard?.(column.columnId)}
        >
          <IconPlus size={16} />
        </button>
      </div>

      <div className="kanban-column__cards">
        {cards.map(({ id: cardId, element }) => (
          <KanbanCardIdContext.Provider key={cardId} value={cardId}>
            {element}
          </KanbanCardIdContext.Provider>
        ))}

        {cards.length === 0 && (
          <div className="kanban-column__empty">
            <span>No tasks</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Card ---------- */

export function KanbanCard({
  id,
  title,
  description,
  labels,
  assignees,
  className = '',
  ...rest
}) {
  const board = useContext(KanbanBoardContext)
  const column = useContext(KanbanColumnContext)
  const resolvedId = useContext(KanbanCardIdContext) ?? id
  const card = { id: resolvedId, title, description, labels, assignees }
  const isDragging = board?.draggedCardId === resolvedId

  return (
    <div
      className={`kanban-card${isDragging ? ' kanban-card--dragging' : ''}${className ? ' ' + className : ''}`}
      draggable
      data-card-id={resolvedId}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', resolvedId)
        board?.handleDragStart(resolvedId, column?.columnId)
        // Slight delay so the drag ghost keeps the un-styled card
        setTimeout(() => e.target.classList.add('kanban-card--dragging'), 0)
      }}
      onDragEnd={(e) => {
        e.target.classList.remove('kanban-card--dragging')
        board?.handleDragEnd()
      }}
      onClick={() => board?.onCardClick?.(card)}
      role="button"
      tabIndex={0}
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          board?.onCardClick?.(card)
        }
      }}
      {...rest}
    >
      {labels && labels.length > 0 && (
        <div className="kanban-card__labels">
          {labels.map((label, i) => (
            <span
              key={i}
              className="kanban-card__label"
              style={
                label.color ? { background: label.color, color: '#fff' } : undefined
              }
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      <span className="kanban-card__title">{title}</span>

      {description && <span className="kanban-card__desc">{description}</span>}

      <div className="kanban-card__footer">
        {assignees && assignees.length > 0 && (
          <div className="kanban-card__avatars">
            {assignees.slice(0, 3).map((a, i) => (
              <span key={i} className="kanban-card__avatar" title={a.name}>
                {a.avatar ? (
                  <img src={a.avatar} alt={a.name} />
                ) : (
                  <span className="kanban-card__avatar-letter">
                    {a.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
            ))}
            {assignees.length > 3 && (
              <span className="kanban-card__avatar-more">
                +{assignees.length - 3}
              </span>
            )}
          </div>
        )}

        <span className="kanban-card__drag-handle" aria-hidden="true">
          <IconMenu size={14} />
        </span>
      </div>
    </div>
  )
}
