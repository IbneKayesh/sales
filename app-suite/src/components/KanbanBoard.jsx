import { useState, useRef, useCallback } from 'react'
import { IconPlus, IconMenu } from '@/icons'

/**
 * KanbanBoard — Drag-and-drop task board with configurable columns.
 *
 * Usage:
 *   <KanbanBoard
 *     columns={columns}
 *     onCardMove={(cardId, fromCol, toCol, toIndex) => {}}
 *     onCardClick={(card) => {}}
 *   />
 *
 * Each column: { id, title, cards: [{ id, title, description?, labels?, assignees? }] }
 */
export default function KanbanBoard({
  columns: initialColumns = [],
  onCardMove,
  onCardClick,
  className = '',
}) {
  const [columns, setColumns] = useState(initialColumns)
  const [draggedCard, setDraggedCard] = useState(null)
  const [dragOverCol, setDragOverCol] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const dragCardRef = useRef(null)
  const dragSourceRef = useRef(null)

  // Sync when initialColumns changes
  const prevColsRef = useRef(initialColumns)
  if (initialColumns !== prevColsRef.current) {
    prevColsRef.current = initialColumns
    setColumns(initialColumns)
  }

  // ── Drag handlers ──

  const handleDragStart = useCallback((e, card, colId) => {
    dragCardRef.current = card
    dragSourceRef.current = colId
    setDraggedCard(card.id)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.id)
    // Slight delay for drag ghost
    setTimeout(() => {
      e.target.classList.add('kanban-card--dragging')
    }, 0)
  }, [])

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('kanban-card--dragging')
    setDraggedCard(null)
    setDragOverCol(null)
    setDragOverIdx(null)
    dragCardRef.current = null
    dragSourceRef.current = null
  }, [])

  const handleDragOver = useCallback((e, colId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverCol(colId)

    // Calculate which card position we're over
    const col = columns.find((c) => c.id === colId)
    if (!col) return

    const cardElements = e.currentTarget.querySelectorAll('.kanban-card')
    let insertIdx = col.cards.length
    cardElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect()
      const mid = rect.top + rect.height / 2
      if (e.clientY > mid) {
        insertIdx = i + 1
      }
    })
    setDragOverIdx(insertIdx)
  }, [columns])

  const handleDragLeave = useCallback((e) => {
    // Only clear if leaving the column, not entering a child
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverCol(null)
      setDragOverIdx(null)
    }
  }, [])

  const handleDrop = useCallback(
    (e, targetColId) => {
      e.preventDefault()
      const cardId = dragCardRef.current?.id
      const sourceColId = dragSourceRef.current

      if (!cardId || !sourceColId) return

      // Calculate insert index
      const targetCol = columns.find((c) => c.id === targetColId)
      if (!targetCol) return

      let toIndex = targetCol.cards.length
      const cardElements = e.currentTarget.querySelectorAll('.kanban-card')
      cardElements.forEach((el, i) => {
        const rect = el.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        if (e.clientY > mid) {
          toIndex = i + 1
        }
      })

      // Optimistic local update
      setColumns((prev) => {
        const newCols = prev.map((c) => ({
          ...c,
          cards: [...c.cards],
        }))
        const sourceCol = newCols.find((c) => c.id === sourceColId)
        const targetCol2 = newCols.find((c) => c.id === targetColId)
        if (!sourceCol || !targetCol2) return prev

        const cardIdx = sourceCol.cards.findIndex((c) => c.id === cardId)
        if (cardIdx === -1) return prev

        const [movedCard] = sourceCol.cards.splice(cardIdx, 1)

        // Adjust index if moving within same column and above original position
        let adjustedIdx = toIndex
        if (sourceColId === targetColId && cardIdx < toIndex) {
          adjustedIdx = toIndex - 1
        }

        targetCol2.cards.splice(adjustedIdx, 0, movedCard)
        return newCols
      })

      setDraggedCard(null)
      setDragOverCol(null)
      setDragOverIdx(null)

      // Notify parent
      onCardMove?.(cardId, sourceColId, targetColId, toIndex)
    },
    [columns, onCardMove],
  )

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0)

  return (
    <div className={`kanban-board${className ? ' ' + className : ''}`}>
      <div className="kanban-board__columns">
        {columns.map((col) => (
          <div
            key={col.id}
            className={`kanban-column${dragOverCol === col.id ? ' kanban-column--drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kanban-column__header">
              <div className="kanban-column__header-left">
                <span className="kanban-column__title">{col.title}</span>
                <span className="kanban-column__count">{col.cards.length}</span>
              </div>
              <button
                type="button"
                className="kanban-column__add-btn"
                aria-label={`Add card to ${col.title}`}
                title={`Add to ${col.title}`}
              >
                <IconPlus size={16} />
              </button>
            </div>

            <div className="kanban-column__cards">
              {col.cards.map((card) => (
                <div
                  key={card.id}
                  className={`kanban-card${draggedCard === card.id ? ' kanban-card--dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, col.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onCardClick?.(card)}
                  role="button"
                  tabIndex={0}
                  aria-label={card.title}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onCardClick?.(card)
                    }
                  }}
                >
                  {/* Labels */}
                  {card.labels && card.labels.length > 0 && (
                    <div className="kanban-card__labels">
                      {card.labels.map((label, i) => (
                        <span
                          key={i}
                          className="kanban-card__label"
                          style={
                            label.color
                              ? { background: label.color, color: '#fff' }
                              : undefined
                          }
                        >
                          {label.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <span className="kanban-card__title">{card.title}</span>

                  {/* Description */}
                  {card.description && (
                    <span className="kanban-card__desc">{card.description}</span>
                  )}

                  {/* Footer */}
                  <div className="kanban-card__footer">
                    {card.assignees && card.assignees.length > 0 && (
                      <div className="kanban-card__avatars">
                        {card.assignees.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="kanban-card__avatar"
                            title={a.name}
                          >
                            {a.avatar ? (
                              <img src={a.avatar} alt={a.name} />
                            ) : (
                              <span className="kanban-card__avatar-letter">
                                {a.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </span>
                        ))}
                        {card.assignees.length > 3 && (
                          <span className="kanban-card__avatar-more">
                            +{card.assignees.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <span className="kanban-card__drag-handle" aria-hidden="true">
                      <IconMenu size={14} />
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {col.cards.length === 0 && (
                <div className="kanban-column__empty">
                  <span>No tasks</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {columns.length === 0 && (
        <div className="kanban-board__empty">
          <span>No columns defined</span>
        </div>
      )}
    </div>
  )
}
