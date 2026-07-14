import React from 'react';
import DataTable from '../../components/DataTable/DataTable';
import styles from './SalesTable.module.css';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const SalesTable = ({ sales, onEdit, onDelete, deletingId }) => {
  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (val) => <span className={styles.customerName}>{val}</span>,
    },
    {
      key: 'product',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Qty',
      align: 'right',
      sortable: true,
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      align: 'right',
      sortable: true,
      render: (val) => fmt(val),
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right',
      sortable: true,
      render: (val) => <span className={styles.total}>{fmt(val)}</span>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (val) => <span className={styles.muted}>{fmtDate(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: 80,
      render: (_, row) => (
        <div className={styles.actionsCell}>
          <button className={styles.editBtn} onClick={() => onEdit(row.id)} aria-label="Edit sale">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(row.id, row.customerName)}
            disabled={deletingId === row.id}
            aria-label="Delete sale"
          >
            {deletingId === row.id ? (
              <span className={styles.deleteSpinner} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sales}
      keyField="id"
      sortable
      paginated
      pageSize={15}
    />
  );
};

export default SalesTable;
