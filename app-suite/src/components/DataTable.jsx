import { useState } from 'react'
import { IconSearch, IconClose, IconSort, IconChevronLeft, IconChevronRight, IconDownload } from '../icons'

function exportToCsv(data, columns, filename) {
  if (!data.length) return

  // Build header row from data columns (exclude action columns marked sortable: false)
  const dataCols = columns.filter((col) => col.sortable !== false)

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

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || 'export.csv'
  a.click()
  URL.revokeObjectURL(url)
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
  className = '',
  onRowClick,
  emptyMessage = 'No data available',
  toolbarActions,
  exportable = false,
  exportFilename,
  stickyFirst = true,
  ...rest
}) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

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
        columns.some((col) => {
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

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const showToolbar = searchable || exportable || toolbarActions

  return (
    <div className={`data-table${dense ? ' data-table--dense' : ''}${className ? ' ' + className : ''}`} {...rest}>
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
            <span className="data-table__count">{sorted.length} records</span>
            {exportable && (
              <button
                type="button"
                className="data-table__export-btn"
                onClick={() => exportToCsv(sorted, columns, exportFilename)}
                title="Export to CSV"
              >
                <IconDownload size={14} />
                Export CSV
              </button>
            )}
            {toolbarActions}
          </div>
        </div>
      )}
      <div className="data-table__wrap">
        <table className="data-table__table">
          <thead>
            <tr>
              {columns.map((col, ci) => (
                <th
                  key={col.key || col.accessor}
                  className={`data-table__th${col.sortable !== false && sortable ? ' data-table__th--sortable' : ''}${sortKey === (col.key || col.accessor) ? ` data-table__th--${sortDir}` : ''}${stickyFirst && ci === 0 ? ' data-table__th--sticky' : ''}`}
                  onClick={() => handleSort(col.key || col.accessor)}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                >
                  <div className="data-table__th-inner">
                    <span>{col.header || col.label || col.key}</span>
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
            {paged.length > 0 ? (
              paged.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className={`data-table__tr${striped && i % 2 === 1 ? ' data-table__tr--striped' : ''}${hoverable ? ' data-table__tr--hoverable' : ''}${onRowClick ? ' data-table__tr--clickable' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, ci) => {
                    const val = col.accessor ? row[col.accessor] : row[col.key]
                    return (
                      <td key={col.key || col.accessor} className={`data-table__td${stickyFirst && ci === 0 ? ' data-table__td--sticky' : ''}`} style={col.width ? { minWidth: col.width } : undefined}>
                        {col.render ? col.render(val, row) : (val ?? '—')}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="data-table__pagination">
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
        </div>
      )}
    </div>
  )
}