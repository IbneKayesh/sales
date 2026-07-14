import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './DataTable.module.css';

// ── Icons ──────────────────────────────────────────────────────────────────
const SortIcon = ({ active, dir }) => (
  <svg className={`${styles.sortIcon} ${active ? styles.sortIconActive : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'asc' ? (
      <polyline points="18 15 12 9 6 15" />
    ) : (
      <polyline points="6 9 12 15 18 9" />
    )}
  </svg>
);

const SearchIcon = () => (
  <svg className={styles.searchSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ColumnsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Helper ─────────────────────────────────────────────────────────────────
const defaultRender = (value) => {
  if (value === null || value === undefined) return '—';
  return String(value);
};

const getNestedValue = (obj, path) => {
  if (!path) return obj;
  const keys = path.split('.');
  let val = obj;
  for (const key of keys) {
    if (val == null) return undefined;
    val = val[key];
  }
  return val;
};

// ── DataTable Component ─────────────────────────────────────────────────────
const DataTable = ({
  // Required
  columns,
  data = [],
  keyField = 'id',

  // Events
  onRowClick,
  onRowDoubleClick,

  // Selection
  selectable = false,
  selectedIds = [],
  onSelectionChange,

  // Sorting
  sortable = false,
  initialSortKey,
  initialSortDir = 'asc',
  onSort,

  // Search
  searchable = false,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search…',

  // Pagination
  paginated = false,
  pageSize = 25,
  currentPage: controlledPage,
  onPageChange,

  // Column visibility
  columnToggle = false,

  // States
  loading = false,
  emptyMessage = 'No data available',
  emptyAction,

  // Styling
  stickyHeader = true,
  compact = false,
  className,

  // Extra toolbar actions
  toolbarActions,
}) => {
  // ── Internal state ─────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState(initialSortKey || '');
  const [sortDir, setSortDir] = useState(initialSortDir);
  const [internalPage, setInternalPage] = useState(1);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const columnMenuRef = useRef(null);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  const isControlledPage = controlledPage !== undefined;
  const currentPage = isControlledPage ? controlledPage : internalPage;

  // Close column menu on click outside
  useEffect(() => {
    if (!showColumnMenu) return;
    const handleClick = (e) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showColumnMenu]);

  // Auto-focus search on Ctrl+F / Cmd+F
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchable && searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [searchable]);

  // ── Sort ───────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (!sortable) return;
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => {
          const newDir = prevDir === 'asc' ? 'desc' : 'asc';
          onSort?.(key, newDir);
          return newDir;
        });
        return key;
      }
      setSortDir('asc');
      onSort?.(key, 'asc');
      return key;
    });
  };

  // ── Selection ──────────────────────────────────────────────────────────
  const allSelected = useMemo(
    () => data.length > 0 && selectedIds.length === data.length,
    [data, selectedIds]
  );

  const someSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < data.length,
    [data, selectedIds]
  );

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row) => getNestedValue(row, keyField)));
    }
  };

  const handleSelectRow = (rowId) => {
    if (!onSelectionChange) return;
    onSelectionChange(
      selectedIds.includes(rowId)
        ? selectedIds.filter((id) => id !== rowId)
        : [...selectedIds, rowId]
    );
  };

  // ── Pagination ─────────────────────────────────────────────────────────
  const totalPages = paginated ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    if (isControlledPage) {
      onPageChange?.(p);
    } else {
      setInternalPage(p);
    }
  };

  // ── Processed data ────────────────────────────────────────────────────
  const processedData = useMemo(() => {
    let result = [...data];

    // Server-side sort: if onSort is provided, don't sort client-side
    if (sortKey && sortable && !onSort) {
      result.sort((a, b) => {
        const aVal = getNestedValue(a, sortKey);
        const bVal = getNestedValue(b, sortKey);
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const strA = String(aVal).toLowerCase();
        const strB = String(bVal).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortKey, sortDir, sortable, onSort]);

  const paginatedData = useMemo(() => {
    if (!paginated) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginated, currentPage, pageSize]);

  const displayData = paginated ? paginatedData : processedData;

  // ── Visible columns ────────────────────────────────────────────────────
  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.includes(col.key)),
    [columns, hiddenColumns]
  );

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      {(searchable || columnToggle || toolbarActions) && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {toolbarActions}
          </div>
          <div className={styles.toolbarRight}>
            {searchable && (
              <div className={styles.searchWrapper}>
                <SearchIcon />
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
                {searchQuery && (
                  <button className={styles.searchClear} onClick={() => onSearchChange?.('')}>
                    ×
                  </button>
                )}
              </div>
            )}
            {columnToggle && (
              <div className={styles.columnToggle} ref={columnMenuRef}>
                <button
                  className={styles.colToggleBtn}
                  onClick={() => setShowColumnMenu((p) => !p)}
                  title="Toggle columns"
                >
                  <ColumnsIcon />
                  <span>Columns</span>
                </button>
                {showColumnMenu && (
                  <div className={styles.colMenu}>
                    {columns.map((col) => {
                      const isHidden = hiddenColumns.includes(col.key);
                      return (
                        <div
                          key={col.key}
                          className={styles.colMenuItem}
                          role="menuitemcheckbox"
                          aria-checked={!isHidden}
                          onClick={() =>
                            setHiddenColumns((prev) =>
                              prev.includes(col.key)
                                ? prev.filter((k) => k !== col.key)
                                : [...prev, col.key]
                            )
                          }
                        >
                          <span className={`${styles.colCheckbox} ${!isHidden ? styles.colCheckboxChecked : ''}`}>
                            {!isHidden && <CheckIcon />}
                          </span>
                          <span>{col.label || col.key}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Table area ────────────────────────────────────────────────── */}
      <div className={styles.tableScroll}>
        <table className={`${styles.table} ${compact ? styles.tableCompact : ''}`}>
          {/* ── Header ────────────────────────────────────────────────── */}
          <thead ref={headerRef}>
            <tr className={styles.headerRow}>
              {selectable && (
                <th className={`${styles.th} ${styles.thCheckbox}`} onClick={(e) => e.stopPropagation()}>
                  <span
                    className={`${styles.selectCheckbox} ${allSelected ? styles.selectChecked : someSelected ? styles.selectIndeterminate : ''}`}
                    onClick={handleSelectAll}
                  >
                    {allSelected && <CheckIcon />}
                    {someSelected && <span className={styles.indeterminateDash} />}
                  </span>
                </th>
              )}
              {visibleColumns.map((col) => {
                const isSorted = sortable && sortKey === col.key;
                const colSortable = sortable && col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    className={`${styles.th} ${col.className || ''} ${
                      col.align === 'right' ? styles.thRight : col.align === 'center' ? styles.thCenter : ''
                    } ${colSortable ? styles.thSortable : ''} ${isSorted ? styles.thSorted : ''}`}
                    style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                    onClick={colSortable ? () => handleSort(col.key) : undefined}
                    role={colSortable ? 'columnheader' : undefined}
                    aria-sort={isSorted ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <span className={styles.thContent}>
                      {col.label || col.key}
                      {colSortable && (
                        <SortIcon
                          active={isSorted}
                          dir={isSorted ? sortDir : 'asc'}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── Body ──────────────────────────────────────────────────── */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className={styles.loadingCell}>
                  <div className={styles.loader}>
                    <span className={styles.loaderBar} />
                  </div>
                  <span className={styles.loaderText}>Loading data…</span>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                  <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <span className={styles.emptyText}>{emptyMessage}</span>
                  {emptyAction && (
                    <button className={styles.emptyActionBtn} onClick={emptyAction.onClick}>
                      {emptyAction.label}
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              displayData.map((row, idx) => {
                const rowId = getNestedValue(row, keyField);
                const isSelected = selectedIds.includes(rowId);
                const isHovered = hoveredRow === rowId;
                return (
                  <tr
                    key={rowId ?? idx}
                    className={`${styles.row} ${idx % 2 === 0 ? styles.rowEven : ''} ${
                      isSelected ? styles.rowSelected : ''
                    } ${isHovered ? styles.rowHover : ''} ${onRowClick ? styles.rowClickable : ''}`}
                    onClick={() => onRowClick?.(row)}
                    onDoubleClick={() => onRowDoubleClick?.(row)}
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {selectable && (
                      <td className={`${styles.td} ${styles.tdCheckbox}`} onClick={(e) => e.stopPropagation()}>
                        <span
                          className={`${styles.selectCheckbox} ${isSelected ? styles.selectChecked : ''}`}
                          onClick={() => handleSelectRow(rowId)}
                        >
                          {isSelected && <CheckIcon />}
                        </span>
                      </td>
                    )}
                    {visibleColumns.map((col) => {
                      const rawValue = getNestedValue(row, col.key);
                      const rendered = col.render ? col.render(rawValue, row, idx) : defaultRender(rawValue);
                      return (
                        <td
                          key={col.key}
                          className={`${styles.td} ${col.className || ''} ${
                            col.align === 'right' ? styles.tdRight : col.align === 'center' ? styles.tdCenter : ''
                          } ${col.mono ? styles.tdMono : ''} ${col.nowrap ? styles.tdNowrap : ''}`}
                          style={col.width ? { maxWidth: col.width } : undefined}
                        >
                          {rendered}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer / Pagination ────────────────────────────────────────── */}
      {paginated && totalPages > 1 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            {processedData.length} rows · Page {currentPage} of {totalPages}
          </span>
          <div className={styles.pageControls}>
            <button
              className={styles.pageBtn}
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, current, and neighbors
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - currentPage) <= 1) return true;
                return false;
              })
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) {
                  acc.push(<span key={`ellipsis-${p}`} className={styles.pageEllipsis}>…</span>);
                }
                acc.push(
                  <button
                    key={p}
                    className={`${styles.pageNumBtn} ${p === currentPage ? styles.pageNumBtnActive : ''}`}
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </button>
                );
                return acc;
              }, [])}
            <button
              className={styles.pageBtn}
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}

      {!paginated && data.length > 0 && (
        <div className={styles.rowCount}>
          {data.length} row{data.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default DataTable;
