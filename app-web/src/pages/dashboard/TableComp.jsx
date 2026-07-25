import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableComp = ({ title, data, columns, isLoading }) => {
  if (isLoading) {
    return (
      <div className="surface-card p-3 border-round shadow-2" style={{ minHeight: '300px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
         <div className="flex align-items-center justify-content-center h-full">
            <i className="pi pi-spin pi-spinner text-4xl" style={{ color: 'var(--primary)' }}></i>
         </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const displayColumns = columns || Object.keys(data[0]).map(col => ({
    field: col,
    header: col.charAt(0).toUpperCase() + col.slice(1).replace('_', ' ')
  }));

  return (
    <div className="surface-card p-3 border-round shadow-2 h-full flex flex-column" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="flex justify-content-between align-items-center mb-3">
        <h3 className="text-sm font-medium uppercase tracking-wider m-0" style={{ color: 'var(--text-muted)' }}>
          {title}
        </h3>
        <button className="p-button p-button-text p-button-sm p-0 text-primary">View All</button>
      </div>
      
      <div className="flex-grow-1 overflow-auto">
        <DataTable 
          value={data} 
          size="small" 
          className="custom-dashboard-table"
          responsiveLayout="scroll"
          style={{ fontSize: '11px' }}
        >
          {displayColumns.map((col) => (
            <Column 
              key={col.field} 
              field={col.field} 
              header={col.header} 
              sortable
              style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-light)' }}
            />
          ))}
        </DataTable>
      </div>
      
      <style>
        {`
          .custom-dashboard-table .p-datatable-thead > tr > th {
            background-color: var(--surface-1) !important;
            color: var(--text-muted) !important;
            border-bottom: 1px solid var(--border-color) !important;
            padding: 0.5rem !important;
          }
          .custom-dashboard-table .p-datatable-tbody > tr {
            background-color: transparent !important;
            color: var(--text-main) !important;
          }
          .custom-dashboard-table .p-datatable-tbody > tr > td {
            padding: 0.5rem !important;
            border-bottom: 1px solid var(--border-light) !important;
          }
          .custom-dashboard-table .p-datatable-tbody > tr:hover {
            background-color: var(--hover-bg) !important;
          }
        `}
      </style>
    </div>
  );
};

export default TableComp;
