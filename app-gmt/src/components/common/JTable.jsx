import React, { useState } from 'react';
import { Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import JButton from './JButton';
import JInput from './JInput';
import './JTable.css';

const JTable = ({ 
  columns = [], 
  data = [], 
  className = '',
  compact = true,
  onExport,
  itemsPerPage = 10,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`j-table-wrapper ${className}`}>
      <div className="j-table-toolbar">
        <div className="j-table-toolbar-left">
          <JInput 
            placeholder="Search..." 
            size="sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="j-table-search"
          />
        </div>
        <div className="j-table-toolbar-right">
          {onExport && (
            <JButton variant="ghost" size="sm" icon={<Upload size={14} />} onClick={onExport}>
              Export
            </JButton>
          )}
        </div>
      </div>

      <div className="j-table-container">
        <table className={`j-table ${compact ? 'j-table-compact' : ''}`} {...props}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="j-table-empty">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="j-table-footer">
        <div className="j-table-footer-left">
          <span className="total-count">Total: <strong>{filteredData.length}</strong> items</span>
        </div>
        <div className="j-table-footer-right">
          <div className="j-table-pagination">
            <span className="pagination-info">
              {currentPage} / {totalPages || 1}
            </span>
            <div className="pagination-buttons">
              <JButton 
                variant="ghost" 
                size="sm" 
                icon={<ChevronLeft size={16} />} 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
              />
              <JButton 
                variant="ghost" 
                size="sm" 
                icon={<ChevronRight size={16} />} 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => setCurrentPage(p => p + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JTable;
