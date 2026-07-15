import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@/assets/icons';
import DataTable from '../../components/DataTable/DataTable';
import styles from './ReportsPage.module.css';

const MOCK_METRICS = [
  { label: 'Total Revenue', value: '$13,592', change: '+12.5%', positive: true },
  { label: 'Orders This Month', value: '45', change: '+8.2%', positive: true },
  { label: 'Avg. Order Value', value: '$302', change: '-3.1%', positive: false },
  { label: 'Conversion Rate', value: '3.8%', change: '+0.6%', positive: true },
];

const MOCK_RECENT = [
  { date: '2026-07-13', revenue: 3200, orders: 8, topProduct: 'Cloud Compute' },
  { date: '2026-07-12', revenue: 4100, orders: 12, topProduct: 'Enterprise Suite' },
  { date: '2026-07-11', revenue: 2890, orders: 6, topProduct: 'Dev Subscription' },
  { date: '2026-07-10', revenue: 5400, orders: 15, topProduct: 'Database Replication' },
  { date: '2026-07-09', revenue: 1980, orders: 5, topProduct: 'AI Inference Unit' },
];

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const ReportsPage = () => {
  const [period, setPeriod] = useState('weekly');

  const columns = [
    { key: 'date', label: 'Date', render: (val) => <span className={styles.muted}>{val}</span> },
    { key: 'revenue', label: 'Revenue', align: 'right', sortable: true, render: (val) => <span className={styles.revenue}>{fmt(val)}</span> },
    { key: 'orders', label: 'Orders', align: 'right', sortable: true },
    { key: 'topProduct', label: 'Top Product', sortable: true },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Reports</h2>
          <p className={styles.subtitle}>Sales analytics and performance metrics</p>
        </div>
        <select className={styles.periodSelect} value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className={styles.content}>
        <div className={styles.metricsGrid}>
          {MOCK_METRICS.map((m, i) => (
            <div key={i} className={styles.metricCard}>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
              <span className={`${styles.metricChange} ${m.positive ? styles.changeUp : styles.changeDown}`}>
                {m.positive ? <IconChevronRight className={styles.changeIcon} /> : <IconChevronLeft className={styles.changeIcon} />}
                {m.change} vs last period
              </span>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <DataTable columns={columns} data={MOCK_RECENT} keyField="date" sortable paginated pageSize={15} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
