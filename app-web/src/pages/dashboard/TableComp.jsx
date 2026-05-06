import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const TableComp = ({ title, data, columns }) => {
    return (
        <div className="surface-card shadow-2 p-3 border-round h-full">
            <div className="text-xl font-medium text-900 mb-3">{title}</div>
            <DataTable value={data} className="p-datatable-sm" responsiveLayout="scroll">
                {columns && columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
        </div>
    );
}

export default TableComp;