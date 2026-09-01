import { useState, useCallback, useMemo, useEffect } from 'react'
import { IconChevronRight, IconCheckboxCheck, IconCheckboxIndeterminate, IconSort, IconSearch, IconClose, IconDownload, IconExpand, IconCollapse } from '@/icons'

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

/**
 * Filter a tree to only keep nodes that match the query (case-insensitive)
 * or have descendants that match. Matching nodes keep all their ancestors.
 */
function filterTree(nodes, query, columns) {
  if (!query) return null // signal: no filtering needed

  const q = query.toLowerCase()

  function matches(node) {
    return columns.some((col) => {
      if (col.sortable === false) return false // skip action columns
      const val = col.accessor ? node[col.accessor] : node[col.key]
      return val != null && String(val).toLowerCase().includes(q)
    })
  }

  function filter(list) {
    const result = []
    for (const node of list) {
      const filteredChildren = node.children ? filter(node.children) : []
      if (matches(node) || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren,
        })
      }
    }
    return result
  }

  return filter(nodes)
}

/**
 * Collect IDs of all nodes that have children — used for auto-expand on search.
 */
function collectParentIds(nodes) {
  const ids = new Set()
  const walk = (list) => {
    for (const n of list) {
      if (n.children?.length) {
        ids.add(n.id)
        walk(n.children)
      }
    }
  }
  walk(nodes)
  return ids
}

/* ─── Recursive Row ─── */
function TreeDataRow({
  node,
  columns,
  checkable,
  checkedSet,
  expandedSet,
  onToggleCheck,
  onToggleExpand,
  onRowClick,
  depth,
  treeColIndex,
  striped,
  hoverable,
  connectorState = [],
  isLast = false,
}) {
  const hasChildren = node.children?.length > 0
  const isExpanded = expandedSet.has(node.id)

  const parentState = hasChildren && checkable
    ? computeParentState(node.children, checkedSet)
    : null
  const isChecked = checkable && checkedSet.has(node.id)
  const isIndeterminate = checkable && parentState === 'indeterminate'

  const handleRowClick = (e) => {
    // Don't trigger onRowClick when clicking interactive elements inside the row
    if (
      e.target.closest('.tree-dt__toggle') ||
      e.target.closest('.tree-dt__checkbox') ||
      e.target.closest('button')
    ) return
    onRowClick?.(node)
  }

  return (
    <>
      <tr
        className={`tree-dt__tr${striped ? ' tree-dt__tr--striped' : ''}${hoverable ? ' tree-dt__tr--hoverable' : ''}${onRowClick ? ' tree-dt__tr--clickable' : ''}`}
        onClick={handleRowClick}
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
                  {/* Connector lines */}
                  {depth > 0 && (
                    <span
                      className="tree-dt__connectors"
                      aria-hidden="true"
                      style={{ width: `${8 + depth * 24}px` }}
                    >
                      {connectorState.map((showLine, i) => (
                        <span
                          key={i}
                          className={`tree-dt__connector-line${showLine ? ' tree-dt__connector-line--vis' : ''}`}
                        />
                      ))}
                      <span
                        className={`tree-dt__connector-branch${isLast ? ' tree-dt__connector-branch--last' : ''}`}
                      />
                    </span>
                  )}

                  {/* Expand toggle */}
                  <button
                    type="button"
                    className={`tree-dt__toggle${hasChildren ? '' : ' tree-dt__toggle--spacer'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      hasChildren && onToggleExpand(node.id)
                    }}
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

                  {/* Checkbox (only when checkable) */}
                  {checkable && (
                    <span
                      className="tree-dt__checkbox"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleCheck(node)
                      }}
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
                  )}

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
        node.children.map((child, idx, arr) => {
          const childIsLast = idx === arr.length - 1
          const childConnectorState = [...connectorState, !childIsLast]
          return (
            <TreeDataRow
              key={child.id}
              node={child}
              columns={columns}
              checkable={checkable}
              checkedSet={checkedSet}
              expandedSet={expandedSet}
              onToggleCheck={onToggleCheck}
              onToggleExpand={onToggleExpand}
              onRowClick={onRowClick}
              depth={depth + 1}
              treeColIndex={treeColIndex}
              striped={striped}
              hoverable={hoverable}
              connectorState={childConnectorState}
              isLast={childIsLast}
            />
          )
        })
      )}
    </>
  )
}

/* ─── CSV Export helper ─── */
function exportToCsv(data, columns, filename) {
  if (!data.length) return

  const dataCols = columns.filter((col) => col.sortable !== false && col.visible !== false)

  const headers = dataCols.map((col) => {
    const val = col.header || col.label || col.key || ''
    return `"${String(val).replace(/"/g, '""')}"`
  })

  const rows = data.map((row) =>
    dataCols.map((col) => {
      const val = col.accessor ? row[col.accessor] : row[col.key]
      const str = val != null ? String(val) : ''
      return `"${str.replace(/"/g, '""')}"`
    }),
  )

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Top-level TreeDataTable ─── */
export default function TreeDataTable({
  columns = [],
  data = [],
  treeColumn = 0,
  checkable = false,
  checked,
  onCheckedChange,
  expanded,
  onExpandedChange,
  sortable = true,
  searchable = false,
  searchPlaceholder = 'Search...',
  exportable = false,
  exportFilename,
  expandable = false,
  storageKey,
  striped = true,
  hoverable = true,
  dense = false,
  className = '',
  emptyMessage = 'No data available',
  onRowClick,
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [searchQuery, setSearchQuery] = useState('')

  // Helper: collect all parent IDs from tree data
  const getAllParentIds = useCallback((treeData) => {
    const ids = new Set()
    const walk = (list) => {
      for (const n of list) {
        if (n.children?.length) ids.add(n.id)
        if (n.children?.length) walk(n.children)
      }
    }
    walk(treeData)
    return ids
  }, [])

  // Load expanded state from localStorage or expand all by default
  const [localExpanded, setLocalExpanded] = useState(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) return new Set(JSON.parse(stored))
      } catch {}
    }
    return getAllParentIds(data)
  })

  // Persist expanded state to localStorage
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(localExpanded)))
      } catch {}
    }
  }, [storageKey, localExpanded])

  const visibleColumns = columns.filter((col) => col.visible !== false)
  if (!visibleColumns.length) return null

  const checkedSet = new Set(checked || [])

  // ── Search filtering ──
  const isSearching = searchable && searchQuery.length > 0
  const filteredData = useMemo(
    () => {
      if (!isSearching) return data
      const result = filterTree(data, searchQuery, visibleColumns)
      return result || data
    },
    [data, searchQuery, visibleColumns, isSearching]
  )

  // When searching, auto-expand all parents in the filtered tree
  const searchExpandedSet = useMemo(() => {
    if (!isSearching) return null
    return collectParentIds(filteredData)
  }, [filteredData, isSearching])

  const expandedSet = searchExpandedSet || (expanded ? new Set(expanded) : localExpanded)

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
      if (!checkable) return
      const ids = [node.id, ...collectDescendantIds(node.children || [])]
      const allChecked = ids.every((id) => checkedSet.has(id))
      const next = new Set(checkedSet)
      if (allChecked) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      onCheckedChange?.(Array.from(next))
    },
    [checkable, checkedSet, onCheckedChange]
  )

  const handleToggleExpand = useCallback(
    (id) => {
      // Don't allow collapse during search — auto-expand is enforced
      if (isSearching) return

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
    [expandedSet, onExpandedChange, isSearching]
  )

  const handleExpandAll = useCallback(() => {
    setLocalExpanded(getAllParentIds(data))
  }, [data, getAllParentIds])

  const handleCollapseAll = useCallback(() => {
    setLocalExpanded(new Set())
  }, [])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchClear = () => {
    setSearchQuery('')
  }

  // Sort flat list (use filtered data when searching)
  const flat = flattenTree(isSearching ? filteredData : data)
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

  const displayData = isSearching ? filteredData : data
  const flatDisplay = sortKey
    ? sorted.filter((r) => r._depth === 0)
    : displayData

  const showToolbar = searchable || exportable || expandable

  return (
    <div className={`tree-dt${dense ? ' tree-dt--dense' : ''}${className ? ' ' + className : ''}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="tree-dt__toolbar">
          {searchable && (
            <div className="tree-dt__search">
              <IconSearch size={16} className="tree-dt__search-icon" />
              <input
                type="text"
                className="tree-dt__search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tree-dt__search-clear"
                  onClick={handleSearchClear}
                  aria-label="Clear search"
                >
                  <IconClose size={14} />
                </button>
              )}
            </div>
          )}
          <div className="tree-dt__toolbar-right">
            {expandable && !isSearching && (
              <div className="tree-dt__expand-group">
                <button
                  type="button"
                  className="tree-dt__expand-btn"
                  onClick={handleExpandAll}
                  title="Expand All"
                >
                  <IconExpand size={14} />
                </button>
                <button
                  type="button"
                  className="tree-dt__expand-btn"
                  onClick={handleCollapseAll}
                  title="Collapse All"
                >
                  <IconCollapse size={14} />
                </button>
              </div>
            )}
            <span className="tree-dt__count">
              {flat.length} records{isSearching ? ` (filtered)` : ''}
            </span>
            {exportable && (
              <button
                type="button"
                className="tree-dt__export-btn"
                onClick={() => exportToCsv(flat, visibleColumns, exportFilename)}
                title="Export to CSV"
              >
                <IconDownload size={14} />
                Export CSV
              </button>
            )}
          </div>
        </div>
      )}

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
            {flatDisplay.length > 0 ? (
              flatDisplay.map((row) => (
                <TreeDataRow
                  key={row.id}
                  node={row}
                  columns={visibleColumns}
                  checkable={checkable}
                  checkedSet={checkedSet}
                  expandedSet={expandedSet}
                  onToggleCheck={handleToggleCheck}
                  onToggleExpand={handleToggleExpand}
                  onRowClick={onRowClick}
                  depth={row._depth ?? 0}
                  treeColIndex={treeColumn}
                  striped={striped}
                  hoverable={hoverable}
                />
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="tree-dt__empty">
                  {isSearching ? `No results for "${searchQuery}"` : emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
