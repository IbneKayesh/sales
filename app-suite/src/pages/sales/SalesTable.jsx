import React from 'react';
import styles from './SalesTable.module.css';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const SalesTable = ({ sales, onEdit, onDelete }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Customer</th>
            <th className={styles.th}>Product</th>
            <th className={`${styles.th} ${styles.right}`}>Qty</th>
            <th className={`${styles.th} ${styles.right}`}>Unit Price</th>
            <th className={`${styles.th} ${styles.right}`}>Total</th>
            <th className={styles.th}>Date</th>
            <th className={`${styles.th} ${styles.actionsCol}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, idx) => (
            <tr key={sale.id} className={`${styles.row} ${idx % 2 === 0 ? styles.rowEven : ''}`}>
              <td className={styles.td}>
                <span className={styles.customerName}>{sale.customerName}</span>
              </td>
              <td className={styles.td}>
                <span className={styles.product}>{sale.product}</span>
              </td>
              <td className={`${styles.td} ${styles.right}`}>{sale.quantity}</td>
              <td className={`${styles.td} ${styles.right}`}>{fmt(sale.unitPrice)}</td>
              <td className={`${styles.td} ${styles.right} ${styles.total}`}>{fmt(sale.total)}</td>
              <td className={`${styles.td} ${styles.muted}`}>{fmtDate(sale.createdAt)}</td>
              <td className={`${styles.td} ${styles.actionsCell}`}>
                <button className={styles.editBtn} onClick={() => onEdit(sale.id)} aria-label="Edit sale">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(sale.id, sale.customerName)} aria-label="Delete sale">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
