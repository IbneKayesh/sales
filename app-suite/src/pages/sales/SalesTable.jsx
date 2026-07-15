import React from 'react';
import { IconEdit, IconDelete } from '@/assets/icons';
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
            <IconEdit />
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
              <IconDelete />
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
