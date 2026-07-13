import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ExportButton from './ExportButton';
import BulkActionModal from './BulkActionModal';
import { confirm } from './ConfirmDialog';

export default function DataTable({ columns, data, searchable = false, searchPlaceholder = 'Search...', pageSize = 10, onRowClick, expandable = false, renderExpanded, exportable = false, exportFilename, bulkActions }) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const expandedRef = useRef(null);

  const scrollToExpanded = useCallback(() => {
    // Scroll after React has rendered the expanded row
    requestAnimationFrame(() => {
      if (expandedRef.current) {
        expandedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }, []);

  useEffect(() => {
    if (expandedId) {
      // Small delay to let the DOM render the expanded row
      const timer = setTimeout(scrollToExpanded, 50);
      return () => clearTimeout(timer);
    }
  }, [expandedId, scrollToExpanded]);

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  // ── Bulk selection ──────────────────────────────
  const hasBulk = !!(bulkActions && bulkActions.onAction && bulkActions.columns);
  const toggleAll = () => {
    if (selected.length === paged.length) setSelected([]);
    else setSelected(paged.map(r => r.id));
  };
  const toggleItem = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Use the rendered (sorted) data for bulk action preview
  const bulkPreviewData = bulkActions?.columns ? sorted : [];

  const handleBulkConfirm = async (items) => {
    await bulkActions.onAction(items);
    setSelected([]);
  };

  return (
    <div className="data-table-wrapper">
      {(searchable || exportable || hasBulk) && (
        <div className="data-table-toolbar">
          <div className="data-table-toolbar-left">
            {searchable && (
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            )}
          </div>
          <div className="data-table-toolbar-right">
            <span className="table-count">{sorted.length} records</span>
            {hasBulk && selected.length > 0 && (
              <button className="btn-primary btn-sm" onClick={async () => {
                if (bulkActions.confirm) {
                  const confirmed = await confirm(
                    bulkActions.confirm.message || `Are you sure you want to ${(bulkActions.label || 'proceed').toLowerCase()} ${selected.length} selected item${selected.length !== 1 ? 's' : ''}?`,
                    {
                      title: bulkActions.confirm.title || 'Confirm Action',
                      confirmText: bulkActions.confirm.confirmText || 'Continue',
                      variant: bulkActions.confirm.variant || 'warning',
                      icon: bulkActions.confirm.icon || 'warning',
                    }
                  );
                  if (!confirmed) return;
                }
                setBulkOpen(true);
              }}>
                {bulkActions.label || 'Bulk Action'} ({selected.length})
              </button>
            )}
            {exportable && (
              <ExportButton
                data={sorted}
                columns={columns}
                filename={exportFilename || 'export'}
              />
            )}
          </div>
        </div>
      )}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {hasBulk && (
                <th className="bulk-check-col" style={{ cursor: 'default' }}>
                  <input
                    type="checkbox"
                    className="bulk-checkbox"
                    checked={selected.length === paged.length && paged.length > 0}
                    onChange={toggleAll}
                    onClick={e => e.stopPropagation()}
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ cursor: col.sortable !== false ? 'pointer' : 'default' }}
                >
                  <span className="th-content">
                    {col.label}
                    {sortKey === col.key && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{
                        transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }}>
                        <path d="M12 5l7 7H5l7-7z" />
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasBulk ? 1 : 0)} className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>No records found</span>
                </td>
              </tr>
            ) : (
              paged.map((row, i) => {
                const isExpanded = expandable && expandedId === row.id;
                return (
                  <tr
                    key={row.id || i}
                    className={`${onRowClick || hasBulk ? 'clickable-row' : ''} ${expandable ? 'expandable-row' : ''} ${isExpanded ? 'expanded' : ''} ${hasBulk && selected.includes(row.id) ? 'row-selected' : ''}`}
                    onClick={() => {
                      if (hasBulk) return; // let checkbox handle
                      if (expandable) {
                        setExpandedId(prev => prev === row.id ? null : row.id);
                      } else {
                        onRowClick?.(row);
                      }
                    }}
                  >
                    {hasBulk && (
                      <td className="bulk-check-col" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="bulk-checkbox"
                          checked={selected.includes(row.id)}
                          onChange={() => toggleItem(row.id)}
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
            {expandable && expandedId && paged.map((row, i) => (
              expandedId === row.id ? (
                <tr key={`exp-${row.id || i}`} className="expanded-row" ref={expandedRef}>
                  <td colSpan={columns.length + (hasBulk ? 1 : 0)} className="expanded-cell">
                    <div className="expanded-content">
                      <div className="expanded-body">
                        {renderExpanded ? renderExpanded(row) : null}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="data-table-pagination">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            Prev
          </button>
          <span className="page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}

      {/* Bulk Action Modal */}
      {hasBulk && (
        <BulkActionModal
          open={bulkOpen}
          onClose={() => setBulkOpen(false)}
          title={bulkActions.modalTitle || bulkActions.label || 'Bulk Action'}
          actionLabel={bulkActions.actionLabel || bulkActions.label || 'Confirm'}
          actionVariant={bulkActions.actionVariant || 'primary'}
          description={bulkActions.description}
          items={sorted.filter(r => selected.includes(r.id))}
          columns={bulkActions.columns}
          onConfirm={handleBulkConfirm}
          size={bulkActions.size || 'lg'}
        />
      )}
    </div>
  );
}
