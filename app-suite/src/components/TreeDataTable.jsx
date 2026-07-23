import { useState, useCallback } from 'react'
import { IconChevronRight, IconCheckboxCheck, IconCheckboxIndeterminate, IconSort } from '@/icons'

/* ─── Helpers ─── */

function flattenTree(nodes) {
  const result = []
  const walk = (list, depth) => {
    for (const n of list) {
      result.push({ ...n, _depth: depth })
      if (n.children?.length) walk(n.children, depth + 1)
    }
  }
  walk(nodes, 0)
  return result
}

function collectDescendantIds(nodes) {
  const ids = []
  const walk = (list) => {
    for (const n of list) {
      ids.push(n.id)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(nodes)
  return ids
}

function computeParentState(children, checkedSet) {
  let allChecked = true
  let someChecked = false
  const walk = (list) => {
    for (const n of list) {
      if (checkedSet.has(n.id)) someChecked = true
      else allChecked = false
      if (n.children?.length) walk(n.children)
    }
  }
  walk(children)
  if (allChecked) return 'checked'
  if (someChecked) return 'indeterminate'
  return 'unchecked'
}

/* ─── Recursive Row ─── */
function TreeDataRow({
  node,
  columns,
  checkedSet,
  expandedSet,
  onToggleCheck,
  onToggleExpand,
  depth,
  treeColIndex,
  striped,
  hoverable,
}) {
  const hasChildren = node.children?.length > 0
  const isExpanded = expandedSet.has(node.id)

  const parentState = hasChildren
    ? computeParentState(node.children, checkedSet)
    : null
  const isChecked = checkedSet.has(node.id)
  const isIndeterminate = parentState === 'indeterminate'

  return (
    <>
      <tr
        className={`tree-dt__tr${striped ? ' tree-dt__tr--striped' : ''}${hoverable ? ' tree-dt__tr--hoverable' : ''}`}
      >
        {columns.map((col, ci) => {
          const isTreeCol = ci === treeColIndex
          const val = col.accessor ? node[col.accessor] : node[col.key]
          return (
            <td
              key={col.key || col.accessor}
              className="tree-dt__td"
            >
              {isTreeCol ? (
                <span
                  className="tree-dt__cell"
                  style={{ paddingLeft: `${8 + depth * 24}px` }}
                >
                  {/* Expand toggle */}
                  <button
                    type="button"
                    className={`tree-dt__toggle${hasChildren ? '' : ' tree-dt__toggle--spacer'}`}
                    onClick={() => hasChildren && onToggleExpand(node.id)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && hasChildren) {
                        e.preventDefault()
                        onToggleExpand(node.id)
                      }
                    }}
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    tabIndex={0}
                  >
                    {hasChildren && (
                      <IconChevronRight
                        size={14}
                        className={`tree-dt__chevron${isExpanded ? ' tree-dt__chevron--open' : ''}`}
                      />
                    )}
                  </button>

                  {/* Checkbox */}
                  <span
                    className="tree-dt__checkbox"
                    onClick={() => onToggleCheck(node)}
                    role="checkbox"
                    aria-checked={isChecked || (isIndeterminate ? 'mixed' : false)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onToggleCheck(node)
                      }
                    }}
                  >
                    <span className="tree-dt__check-visual">
                      {isChecked ? (
                        <IconCheckboxCheck size={10} />
                      ) : isIndeterminate ? (
                        <IconCheckboxIndeterminate size={10} />
                      ) : null}
                    </span>
                  </span>

                  {/* Cell value */}
                  <span className="tree-dt__cell-text">
                    {col.render ? col.render(val, node) : (val ?? '—')}
                  </span>
                </span>
              ) : (
                <span className="tree-dt__cell">
                  {col.render ? col.render(val, node) : (val ?? '—')}
                </span>
              )}
            </td>
          )
        })}
      </tr>

      {/* Children */}
      {hasChildren && isExpanded && (
        node.children.map((child) => (
          <TreeDataRow
            key={child.id}
            node={child}
            columns={columns}
            checkedSet={checkedSet}
            expandedSet={expandedSet}
            onToggleCheck={onToggleCheck}
            onToggleExpand={onToggleExpand}
            depth={depth + 1}
            treeColIndex={treeColIndex}
            striped={striped}
            hoverable={hoverable}
          />
        ))
      )}
    </>
  )
}

/* ─── Top-level TreeDataTable ─── */
export default function TreeDataTable({
  columns = [],
  data = [],
  treeColumn = 0,
  checked,
  onCheckedChange,
  expanded,
  onExpandedChange,
  sortable = true,
  striped = true,
  hoverable = true,
  dense = false,
  className = '',
  emptyMessage = 'No data available',
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const [localExpanded, setLocalExpanded] = useState(() => {
    const ids = new Set()
    const walk = (list) => {
      for (const n of list) {
        if (n.children?.length) ids.add(n.id)
        if (n.children?.length) walk(n.children)
      }
    }
    walk(data)
    return ids
  })

  const visibleColumns = columns.filter((col) => col.visible !== false)
  if (!visibleColumns.length) return null

  const checkedSet = new Set(checked || [])
  const expandedSet = expanded ? new Set(expanded) : localExpanded

  const handleSort = (key) => {
    if (!sortable) return
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortDir('asc')
      }
      return key
    })
  }

  const handleToggleCheck = useCallback(
    (node) => {
      const ids = [node.id, ...collectDescendantIds(node.children || [])]
      const allChecked = ids.every((id) => checkedSet.has(id))
      const next = new Set(checkedSet)
      if (allChecked) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      onCheckedChange?.(Array.from(next))
    },
    [checkedSet, onCheckedChange]
  )

  const handleToggleExpand = useCallback(
    (id) => {
      if (onExpandedChange) {
        const next = new Set(expandedSet)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        onExpandedChange(Array.from(next))
      } else {
        setLocalExpanded((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }
    },
    [expandedSet, onExpandedChange]
  )

  // Sort flat list
  const flat = flattenTree(data)
  const sorted = sortKey
    ? [...flat].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'number')
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    : flat

  return (
    <div className={`tree-dt${dense ? ' tree-dt--dense' : ''}${className ? ' ' + className : ''}`}>
      <div className="tree-dt__wrap">
        <table className="tree-dt__table">
          <thead>
            <tr>
              {visibleColumns.map((col, ci) => {
                const sortKeyCol = col.key || col.accessor
                return (
                  <th
                    key={sortKeyCol}
                    className={`tree-dt__th${col.sortable !== false && sortable ? ' tree-dt__th--sortable' : ''}${sortKey === sortKeyCol ? ` tree-dt__th--${sortDir}` : ''}`}
                    onClick={() => handleSort(sortKeyCol)}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    <span className="tree-dt__th-inner">
                      <span>{col.header || col.label || col.key}</span>
                      {col.sortable !== false && sortable && (
                        <span className="tree-dt__sort-icon">
                          <IconSort size={12} />
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.length > 0 ? (
              sorted.filter((r) => r._depth === 0).map((row) => (
                <TreeDataRow
                  key={row.id}
                  node={row}
                  columns={visibleColumns}
                  checkedSet={checkedSet}
                  expandedSet={expandedSet}
                  onToggleCheck={handleToggleCheck}
                  onToggleExpand={handleToggleExpand}
                  depth={row._depth}
                  treeColIndex={treeColumn}
                  striped={striped}
                  hoverable={hoverable}
                />
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="tree-dt__empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
