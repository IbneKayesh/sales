import { useState, useEffect, useRef } from 'react'
import {
  IconSearch,
  IconClose,
  IconSort,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconBox,
  IconBar,
  IconColumns,
  IconPin,
  IconUnpin,
  IconRefresh,
} from '../icons'
import Skeleton from './Skeleton'

function exportToCsv(data, columns, filename, totalsRow) {
  if (!data.length) return

  // Build header row from visible data columns (exclude action columns marked sortable: false)
  const dataCols = columns.filter((col) => col.sortable !== false && col.visible !== false)

  const headers = dataCols.map((col) => {
    const val = col.header || col.label || col.key || ''
    return `"${String(val).replace(/"/g, '""')}"`
  })

  // Build data rows — use raw values, not rendered
  const rows = data.map((row) =>
    dataCols.map((col) => {
      const val = col.accessor ? row[col.accessor] : row[col.key]
      const str = val != null ? String(val) : ''
      return `"${str.replace(/"/g, '""')}"`
    }),
  )

  // Optional totals row (aligned with the same column set as `columns`)
  if (totalsRow) {
    const tRow = columns.map((col, ci) => {
      if (ci === 0) return '"Total"'
      const v = totalsRow[ci]
      if (v == null) return '""'
      return `"${Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }).replace(/"/g, '""')}"`
    })
    rows.push(tRow)
  }

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  // BOM so Excel opens UTF-8 values correctly
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Closes the settings popup when clicking outside it.
function useOutsideClose(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, onClose])
  return ref
}

const DENSITY_KEY = 'bsuite_table_density'
const PAGE_SIZE_KEY = 'bsuite_table_pagesize'

const readStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v == null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}

const writeStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export default function DataTable({
  columns = [],
  data = [],
  pageSize = 10,
  sortable = true,
  searchable = false,
  striped = true,
  hoverable = true,
  dense = false,
  autofit = false,
  className = '',
  onRowClick,
  emptyMessage = 'No data available',
  exportable = false,
  exportFilename,
  stickyFirst = true,
  cfColumns = [],
  loading = false,
  loadingRows = 5,
  // Built-in column settings (reorder / pin / visibility / density), persisted
  // per table via localStorage. When set, DataTable manages its own layout.
  columnSettingsKey,
  ...rest
}) {
  const keyOf = (col) => col.key || col.accessor

  // Density — starts from the `dense` prop, then a persisted global preference.
  const [denseState, setDenseState] = useState(() =>
    readStored(DENSITY_KEY, dense),
  )

  // Page size — starts from the `pageSize` prop, then a persisted preference.
  const [pageSizeState, setPageSizeState] = useState(() =>
    readStored(PAGE_SIZE_KEY, pageSize),
  )

  // Per-table layout: { order: [keys], pinned: [keys], hidden: [keys] }
  const layoutKey = columnSettingsKey ? `bsuite_table_layout_${columnSettingsKey}` : null
  const [layout, setLayout] = useState(() =>
    layoutKey ? readStored(layoutKey, null) : null,
  )

  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const columnsRef = useOutsideClose(columnsOpen, () => setColumnsOpen(false))

  const persistLayout = (next) => {
    setLayout(next)
    if (layoutKey) writeStored(layoutKey, next)
  }

  const toggleDense = () => {
    setDenseState((v) => {
      const n = !v
      writeStored(DENSITY_KEY, n)
      return n
    })
  }

  const setPageSize = (n) => {
    const size = Number(n)
    if (!Number.isFinite(size) || size <= 0) return
    setPageSizeState(size)
    writeStored(PAGE_SIZE_KEY, size)
    setPage(0)
  }

  // Apply cfColumns visibility + persisted layout (order / pin / hidden)
  let baseColumns = columns.filter((col) => {
    if (col.visible === false) return false
    if (cfColumns.length > 0) {
      const cfg = cfColumns.find((c) => c.tabcl_colmn === keyOf(col))
      // tabcl_visbl: default value, tabcl_visbu: user defined
      if (cfg) return cfg.tabcl_visbu !== false
    }
    return true
  })

  if (layout) {
    const ordered = [...baseColumns].sort((a, b) => {
      const ia = layout.order.indexOf(keyOf(a))
      const ib = layout.order.indexOf(keyOf(b))
      const oa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia
      const ob = ib === -1 ? Number.MAX_SAFE_INTEGER : ib
      return oa - ob
    })
    const pinned = ordered.filter((c) => layout.pinned.includes(keyOf(c)))
    const rest = ordered.filter((c) => !layout.pinned.includes(keyOf(c)))
    baseColumns = [...pinned, ...rest].filter(
      (c) => !layout.hidden.includes(keyOf(c)),
    )
  }

  const visibleColumns = baseColumns

  // If no columns are visible, render nothing
  if (visibleColumns.length === 0) {
    return null
  }

  const handleSort = (key) => {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(0)
  }

  const filtered = searchable && searchQuery
    ? data.filter((row) =>
        visibleColumns.some((col) => {
          const val = col.accessor ? row[col.accessor] : row[col.key]
          return val != null && String(val).toLowerCase().includes(searchQuery.toLowerCase())
        }),
      )
    : [...data]

  const sorted = sortKey
    ? filtered.sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (typeof aVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
        return sortDir === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    : filtered

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSizeState))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = sorted.slice(currentPage * pageSizeState, (currentPage + 1) * pageSizeState)

  const showToolbar = searchable || exportable || columnSettingsKey

  // Totals footer — driven by each column's `footer` option:
  //   "count"   — number of rows that have a value in this column
  //   "sum"     — sum of the numeric cell values in this column
  //   function  — (values, rows) => node, fully custom footer content. `values`
  //               are the non-empty raw values of this column across the
  //               filtered rows; `rows` are the filtered row objects, so the
  //               renderer can compute across other columns if needed.
  //   none      — no footer cell for this column
  // The footer row renders only when at least one column defines a footer.
  const totalsRow = visibleColumns.map((col) => {
    const key = col.accessor || col.key
    const values = filtered
      .map((row) => row[key])
      .filter((v) => v != null && String(v).trim() !== '')
    if (typeof col.footer === 'function') {
      return col.footer(values, filtered)
    }
    if (col.footer === 'sum') {
      const nums = values.filter((v) => Number.isFinite(Number(v)))
      if (nums.length === 0) return null
      return nums.reduce((a, b) => a + Number(b), 0)
    }
    if (col.footer === 'count') {
      return values.length
    }
    return null
  })

  const hasFooterValues = totalsRow.some((v) => v != null)

  // Reset keyboard row focus when the visible page changes.
  useEffect(() => {
    setFocusedIdx(-1)
  }, [currentPage, searchQuery, paged.length])

  // Keep the focused row in view.
  useEffect(() => {
    if (focusedIdx < 0) return
    document
      .querySelector('.data-table__tr--focused')
      ?.scrollIntoView({ block: 'nearest' })
  }, [focusedIdx])

  const handleTableKeyDown = (e) => {
    if (paged.length === 0) return
    const last = paged.length - 1
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIdx((i) => Math.min(i + 1, last))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIdx((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setFocusedIdx(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIdx(last)
        break
      case 'Enter':
        if (focusedIdx >= 0 && onRowClick) {
          e.preventDefault()
          onRowClick(paged[focusedIdx])
        }
        break
      default:
        break
    }
  }

  const isPinned = (col) => layout?.pinned.includes(keyOf(col))
  const isSticky = (col, ci) => (stickyFirst && ci === 0) || isPinned(col)

  // Column settings handlers (only active when columnSettingsKey is set)
  const settingsCols = columns.filter(
    (col) => col.visible !== false && col.sortable !== false,
  )
  const layoutFor = (col) => {
    const k = keyOf(col)
    const order = layout ? [...layout.order] : []
    const pinned = layout ? [...layout.pinned] : []
    const hidden = layout ? [...layout.hidden] : []
    return { k, order, pinned, hidden }
  }
  const togglePin = (col) => {
    const { k, order, pinned, hidden } = layoutFor(col)
    if (pinned.includes(k)) {
      pinned.splice(pinned.indexOf(k), 1)
    } else {
      pinned.push(k)
    }
    persistLayout({ order, pinned, hidden })
  }
  const toggleHidden = (col) => {
    const { k, order, pinned, hidden } = layoutFor(col)
    if (hidden.includes(k)) {
      hidden.splice(hidden.indexOf(k), 1)
    } else {
      hidden.push(k)
    }
    persistLayout({ order, pinned, hidden })
  }
  const resetLayout = () => {
    persistLayout({ order: [], pinned: [], hidden: [] })
  }

  return (
    <div className={`data-table${denseState ? ' data-table--dense' : ''}${autofit ? ' data-table--autofit' : ''}${className ? ' ' + className : ''}`} {...rest}>
      {showToolbar && (
        <div className="data-table__toolbar">
          <div className="data-table__toolbar-left">
            {searchable && (
              <div className="data-table__search">
                <IconSearch size={16} className="data-table__search-icon" />
                <input
                  type="text"
                  className="data-table__search-input"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="data-table__search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <IconClose size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="data-table__toolbar-right">
            <button
              type="button"
              className="data-table__page-btn"
              onClick={toggleDense}
              title={denseState ? 'Switch to comfortable rows' : 'Switch to compact rows'}
              aria-pressed={denseState}
            >
              <IconBar size={14} />
              <span>{denseState ? 'Compact' : 'Comfortable'}</span>
            </button>
            {columnSettingsKey && (
              <div ref={columnsRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="data-table__page-btn"
                  onClick={() => setColumnsOpen((v) => !v)}
                  aria-expanded={columnsOpen}
                  title="Column settings"
                >
                  <IconColumns size={14} />
                  <span>Columns</span>
                </button>
                {columnsOpen && (
                  <div className="data-table__columns-popup">
                    {settingsCols.map((col) => {
                      const k = keyOf(col)
                      const visible = !(layout?.hidden || []).includes(k)
                      const pinned = isPinned(col)
                      return (
                        <div key={k} className="data-table__columns-row">
                          <button
                            type="button"
                            className={`data-table__columns-move${pinned ? ' data-table__columns-move--active' : ''}`}
                            onClick={() => togglePin(col)}
                            title={pinned ? 'Unpin' : 'Pin left'}
                            aria-pressed={pinned}
                          >
                            {pinned ? <IconPin size={12} /> : <IconUnpin size={12} />}
                          </button>
                          <label className="data-table__columns-label">
                            <input
                              type="checkbox"
                              checked={visible}
                              onChange={() => toggleHidden(col)}
                            />
                            <span>{col.header || col.label || k}</span>
                          </label>
                        </div>
                      )
                    })}
                    <button
                      type="button"
                      className="data-table__columns-reset"
                      onClick={resetLayout}
                      title="Reset column layout to default"
                    >
                      <IconRefresh size={12} />
                      Reset layout
                    </button>
                  </div>
                )}
              </div>
            )}
            <span className="data-table__count">{sorted.length} records</span>
            {exportable && (
              <button
                type="button"
                className="data-table__export-btn"
                onClick={() => exportToCsv(sorted, visibleColumns, exportFilename)}
                title="Export to CSV"
              >
                <IconDownload size={14} />
                CSV
              </button>
            )}
          </div>
        </div>
      )}
      <div className="data-table__wrap">
        <table
          className="data-table__table"
          tabIndex={0}
          onKeyDown={handleTableKeyDown}
          aria-label="Data table — use arrow keys to move row focus, Enter to open"
        >
          <thead>
            <tr>
              {visibleColumns.map((col, ci) => (
                <th
                  key={keyOf(col)}
                  className={`data-table__th${col.sortable !== false && sortable ? ' data-table__th--sortable' : ''}${sortKey === keyOf(col) ? ` data-table__th--${sortDir}` : ''}${isSticky(col, ci) ? ' data-table__th--sticky' : ''}`}
                  onClick={() => handleSort(keyOf(col))}
                  style={{ ...(col.width ? { width: col.width } : {}), ...(col.align ? { textAlign: col.align } : {}) }}
                >
                  <div className="data-table__th-inner">
                    <span>{col.header || col.label || keyOf(col)}</span>
                    {isPinned(col) && (
                      <span className="data-table__pin-icon" title="Pinned column">
                        <IconPin size={10} />
                      </span>
                    )}
                    {col.sortable !== false && sortable && (
                      <span className="data-table__sort-icon">
                        <IconSort size={12} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading rows — shimmer placeholders while data loads.
              Array.from({ length: loadingRows }, (_, ri) => (
                <tr key={`skeleton-${ri}`} className="data-table__tr">
                  {visibleColumns.map((col, ci) => (
                    <td
                      key={keyOf(col)}
                      className={`data-table__td${isSticky(col, ci) ? ' data-table__td--sticky' : ''}`}
                      style={col.width ? { width: col.width } : {}}
                    >
                      <Skeleton width={col.width ? '90%' : `${55 + ((ri * 13 + ci * 29) % 40)}%`} height={12} />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length > 0 ? (
              paged.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className={`data-table__tr${striped && i % 2 === 1 ? ' data-table__tr--striped' : ''}${hoverable ? ' data-table__tr--hoverable' : ''}${onRowClick ? ' data-table__tr--clickable' : ''}${i === focusedIdx ? ' data-table__tr--focused' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {visibleColumns.map((col, ci) => {
                    const val = col.accessor ? row[col.accessor] : row[col.key]
                    return (
                      <td key={keyOf(col)} className={`data-table__td${isSticky(col, ci) ? ' data-table__td--sticky' : ''}`} style={{ ...(col.width ? { width: col.width } : {}), ...(col.align ? { textAlign: col.align } : {}) }}>
                        {col.body ? col.body(val, row) : (val ?? '—')}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length} className="data-table__empty">
                  <span className="data-table__empty-icon">
                    <IconBox size={28} />
                  </span>
                  <div>{emptyMessage}</div>
                </td>
              </tr>
            )}
          </tbody>
          {hasFooterValues && (
            <tfoot>
              <tr className="data-table__tfoot">
                {visibleColumns.map((col, ci) => {
                  const v = totalsRow[ci]
                  return (
                    <td
                      key={keyOf(col)}
                      className={`data-table__tfoot-cell${isSticky(col, ci) ? ' data-table__td--sticky' : ''}`}
                      style={col.align ? { textAlign: col.align } : {}}
                    >
                      {v == null
                        ? ci === 0
                          ? 'Total'
                          : ''
                        : typeof v === 'number'
                          ? String(v)
                          : v}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {totalPages > 1 && (
        <div className="data-table__pagination">
          <span className="data-table__page-size">
            Rows
            <select
              value={pageSizeState}
              onChange={(e) => setPageSize(e.target.value)}
              aria-label="Rows per page"
            >
              {[5, 10, 15, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </span>
          <button
            type="button"
            className="data-table__page-btn"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            <IconChevronLeft size={14} />
            <span>Prev</span>
          </button>
          <div className="data-table__page-info">
            {Array.from({ length: totalPages }, (_, i) => {
              if (totalPages > 7) {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`data-table__page-num${i === currentPage ? ' data-table__page-num--active' : ''}`}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  )
                }
                if (i === currentPage - 2 || i === currentPage + 2) {
                  return <span key={i} className="data-table__page-dots">...</span>
                }
                return null
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={`data-table__page-num${i === currentPage ? ' data-table__page-num--active' : ''}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="data-table__page-btn"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            <span>Next</span>
            <IconChevronRight size={14} />
          </button>
          <span className="data-table__jump">
            Go to
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage + 1}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10)
                if (Number.isFinite(n)) {
                  setPage(Math.min(Math.max(n - 1, 0), totalPages - 1))
                }
              }}
              aria-label="Jump to page"
            />
          </span>
        </div>
      )}
    </div>
  )
}