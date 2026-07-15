import React, { useState, useMemo, useRef, useEffect } from 'react';
import { IconSearch, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown, IconCheck, IconGridRect, IconFileExcel } from '@/assets/icons';
import styles from './DataTable.module.css';

// ── Icons ──────────────────────────────────────────────────────────────────
const SortIcon = ({ active, dir }) => {
  const Icon = dir === 'asc' ? IconChevronUp : IconChevronDown;
  return <Icon className={`${styles.sortIcon} ${active ? styles.sortIconActive : ''}`} />;
};

const TableSearchIcon = () => <IconSearch className={styles.searchSvg} />;
const TableChevronLeft = () => <IconChevronLeft width="14" height="14" />;
const TableChevronRight = () => <IconChevronRight width="14" height="14" />;
const TableColumnsIcon = () => <IconGridRect width="14" height="14" />;
const TableCheckIcon = () => <IconCheck width="12" height="12" />;  // ── Helper ─────────────────────────────────────────────────────────────────
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

  // Export
  exportable = false,
  exportFilename = 'export',
  exportData,

  // Column search
  columnSearch = false,

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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [columnQueries, setColumnQueries] = useState({});
  const columnSearchRefs = useRef({});
  const columnMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  const isControlledPage = controlledPage !== undefined;
  const currentPage = isControlledPage ? controlledPage : internalPage;

  // Close dropdowns on click outside
  useEffect(() => {
    if (!showColumnMenu && !showExportMenu) return;
    const handleClick = (e) => {
      if (showColumnMenu && columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
      if (showExportMenu && exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showColumnMenu, showExportMenu]);

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

  // ── Export (CSV) ───────────────────────────────────────────────────────
  const handleExport = (mode = 'all') => {
    setShowExportMenu(false);

    // Determine which data to export
    let dataToExport;
    if (mode === 'page' && paginated) {
      dataToExport = paginatedData;
    } else if (mode === 'full') {
      dataToExport = exportData || data;
    } else {
      dataToExport = exportData || processedData;
    }

    const cols = visibleColumns.filter((c) => c.key !== 'actions');

    // Build header row
    const headers = cols.map((c) => {
      let label = c.label || c.key;
      return /[,"]/.test(label) ? `"${label.replace(/"/g, '""')}"` : label;
    });

    // Build data rows
    const rows = dataToExport.map((row) =>
      cols.map((col) => {
        const rawValue = getNestedValue(row, col.key);
        const strValue = rawValue == null ? '' : String(rawValue);
        return /[,"]/.test(strValue) ? `"${strValue.replace(/"/g, '""')}"` : strValue;
      }).join(',')
    );

    const suffix = mode === 'page' && paginated ? `-page-${currentPage}` : '';
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${exportFilename}${suffix}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // ── Column search handler ────────────────────────────────────────────
  const handleColumnSearch = (colKey, value) => {
    setColumnQueries((prev) => {
      const next = { ...prev };
      if (value) {
        next[colKey] = value.toLowerCase();
      } else {
        delete next[colKey];
      }
      return next;
    });
  };

  // ── Processed data ────────────────────────────────────────────────────
  const processedData = useMemo(() => {
    let result = [...data];

    // Column-level filtering
    const hasColumnFilters = columnSearch && Object.keys(columnQueries).length > 0;
    if (hasColumnFilters) {
      result = result.filter((row) =>
        Object.entries(columnQueries).every(([colKey, query]) => {
          const rawValue = getNestedValue(row, colKey);
          const str = rawValue == null ? '' : String(rawValue).toLowerCase();
          return str.includes(query);
        })
      );
    }

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
  }, [data, sortKey, sortDir, sortable, onSort, columnSearch, columnQueries]);

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
                <TableSearchIcon />
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
            {exportable && (
              <div className={styles.exportDropdown} ref={exportMenuRef}>                    <button
                  className={`${styles.exportBtn} ${showExportMenu ? styles.exportBtnOpen : ''}`}
                  onClick={() => setShowExportMenu((p) => !p)}
                  title="Export data"
                >
                  <IconFileExcel />
                  <span>Export</span>
                </button>
                {showExportMenu && (
                  <div className={styles.exportMenu} role="menu" aria-label="Export options">
                    <button
                      className={styles.exportMenuItem}
                      onClick={() => handleExport('all')}
                      role="menuitem"
                    >
                      <span className={styles.exportMenuIcon}><IconFileExcel /></span>
                      <span className={styles.exportMenuLabel}>Export CSV</span>
                      <span className={styles.exportMenuHint}>Filtered view as CSV</span>
                    </button>
                    {paginated && (
                      <button
                        className={styles.exportMenuItem}
                        onClick={() => handleExport('page')}
                        role="menuitem"
                      >
                        <span className={styles.exportMenuIcon}><IconFileExcel /></span>
                        <span className={styles.exportMenuLabel}>Export Current Page</span>
                        <span className={styles.exportMenuHint}>Page {currentPage} only</span>
                      </button>
                    )}
                    <button
                      className={styles.exportMenuItem}
                      onClick={() => handleExport('full')}
                      role="menuitem"
                    >
                      <span className={styles.exportMenuIcon}><IconFileExcel /></span>
                      <span className={styles.exportMenuLabel}>Export All Pages</span>
                      <span className={styles.exportMenuHint}>Unfiltered full dataset</span>
                    </button>
                  </div>
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
                  <TableColumnsIcon />
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
                            {!isHidden && <TableCheckIcon />}
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
                    {allSelected && <TableCheckIcon />}
                    {someSelected && <span className={styles.indeterminateDash} />}
                  </span>
                </th>
              )}
              {visibleColumns.map((col) => {
                const isSorted = sortable && sortKey === col.key;
                const colSortable = sortable && col.sortable !== false;
                const colSearchable = columnSearch && col.key !== 'actions' && col.searchable !== false;
                const colQuery = columnQueries[col.key] || '';
                return (
                  <th
                    key={col.key}
                    className={`${styles.th} ${col.className || ''} ${
                      col.align === 'right' ? styles.thRight : col.align === 'center' ? styles.thCenter : ''
                    } ${colSortable ? styles.thSortable : ''} ${isSorted ? styles.thSorted : ''} ${colSearchable ? styles.thSearchable : ''}`}
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
                    {colSearchable && (
                      <div className={styles.colSearchWrap}>
                        <input
                          ref={(el) => { columnSearchRefs.current[col.key] = el; }}
                          type="text"
                          className={styles.colSearchInput}
                          placeholder="Filter…"
                          value={colQuery}
                          onChange={(e) => handleColumnSearch(col.key, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {colQuery && (
                          <button
                            className={styles.colSearchClear}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColumnSearch(col.key, '');
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
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
                  <IconMinusCircle className={styles.emptyIcon} />
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
                          {isSelected && <TableCheckIcon />}
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
              <TableChevronLeft />
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
              <TableChevronRight />
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
