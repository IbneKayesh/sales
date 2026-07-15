import React, { useState } from 'react';
import { fmtCurrency } from '@/utils/dataFormat';
import { IconSearch } from '@/assets/icons';
import DataTable from '../../components/DataTable/DataTable';
import styles from './OrdersPage.module.css';

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Acme Corp', product: 'Enterprise Suite', qty: 5, total: 6000, status: 'Shipped', date: '2026-07-10' },
  { id: 'ORD-002', customer: 'Globex Inc', product: 'Cloud Compute', qty: 12, total: 3000, status: 'Processing', date: '2026-07-11' },
  { id: 'ORD-003', customer: 'Initech LLC', product: 'Dev Subscription', qty: 8, total: 792, status: 'Pending', date: '2026-07-12' },
  { id: 'ORD-004', customer: 'Umbrella Corp', product: 'DB Replication', qty: 2, total: 900, status: 'Delivered', date: '2026-07-09' },
  { id: 'ORD-005', customer: 'Stark Industries', product: 'AI Unit', qty: 1, total: 2900, status: 'Processing', date: '2026-07-13' },
];

const statusStyles = {
  Pending: styles.statusPending,
  Processing: styles.statusProcessing,
  Shipped: styles.statusShipped,
  Delivered: styles.statusDelivered,
};

const OrdersPage = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_ORDERS.filter(
    (o) => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true, render: (val) => <code className={styles.orderId}>{val}</code> },
    { key: 'customer', label: 'Customer', sortable: true, render: (val) => <span className={styles.customer}>{val}</span> },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'qty', label: 'Qty', align: 'right', sortable: true },
    { key: 'total', label: 'Total', align: 'right', sortable: true, render: (val) => <span className={styles.total}>{fmtCurrency(val)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <span className={`${styles.statusBadge} ${statusStyles[val]}`}>{val}</span> },
    { key: 'date', label: 'Date', sortable: true, render: (val) => <span className={styles.muted}>{val}</span> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Orders</h2>
          <p className={styles.subtitle}>Manage and track customer orders</p>
        </div>
        <div className={styles.searchWrapper}>
          <IconSearch className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className={styles.content}>
        <DataTable columns={columns} data={filtered} keyField="id" sortable paginated pageSize={15} />
      </div>
    </div>
  );
};

export default OrdersPage;
