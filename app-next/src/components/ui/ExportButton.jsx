import { useState, useRef, useEffect } from 'react';
import { exportCSV, exportExcel } from '../../utils/exportData';

/**
 * Export button with dropdown for CSV / Excel export.
 *
 * @param {Object} props
 * @param {Array} props.data      — The data rows to export (filtered, sorted)
 * @param {Array} props.columns   — Column definitions [{ key, label, render?, exportValue? }]
 * @param {string} props.filename — Base filename (without extension)
 * @param {string} props.label    — Optional button label (default: 'Export')
 */
export default function ExportButton({ data, columns, filename = 'export', label = 'Export' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleExport = (format) => {
    setOpen(false);
    if (format === 'csv') {
      exportCSV(data, columns, filename);
    } else {
      exportExcel(data, columns, filename);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="export-btn-wrapper" ref={ref}>
      <button className="export-btn" onClick={() => setOpen(prev => !prev)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {label}
        <svg className={`export-chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="export-dropdown">
          <button className="export-option" onClick={() => handleExport('csv')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <div className="export-option-text">
              <span className="export-option-title">CSV</span>
              <span className="export-option-desc">Comma-separated values</span>
            </div>
          </button>
          <button className="export-option" onClick={() => handleExport('excel')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div className="export-option-text">
              <span className="export-option-title">Excel</span>
              <span className="export-option-desc">Spreadsheet (.xls)</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
