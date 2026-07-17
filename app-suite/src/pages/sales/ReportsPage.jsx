import { useState } from 'react';

import { fmtCurrency } from '@/utils/dataFormat';
import { IconChevronLeft, IconChevronRight } from '@/assets/icons';
import DataTable from '../../components/DataTable/DataTable';
import './ReportsPage.css';
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

const ReportsPage = () => {
  const [period, setPeriod] = useState('weekly');

  const columns = [
    { key: 'date', label: 'Date', render: (val) => <span className="muted">{val}</span> },
    { key: 'revenue', label: 'Revenue', align: 'right', sortable: true, render: (val) => <span className="revenue">{fmtCurrency(val)}</span> },
    { key: 'orders', label: 'Orders', align: 'right', sortable: true },
    { key: 'topProduct', label: 'Top Product', sortable: true },
  ];

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2 className="title">Reports</h2>
          <p className="subtitle">Sales analytics and performance metrics</p>
        </div>
        <select className="periodSelect" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="content">
        <div className="metricsGrid">
          {MOCK_METRICS.map((m, i) => (
            <div key={i} className="metricCard">
              <span className="metricLabel">{m.label}</span>
              <span className="metricValue">{m.value}</span>
              <span className={`metricChange ${m.positive ? 'changeUp' : 'changeDown'}`}>
                {m.positive ? <IconChevronRight className="changeIcon" /> : <IconChevronLeft className="changeIcon" />}
                {m.change} vs last period
              </span>
            </div>
          ))}
        </div>

        <div className="section">
          <h3 className="sectionTitle">Recent Activity</h3>
          <DataTable columns={columns} data={MOCK_RECENT} keyField="date" sortable paginated pageSize={15} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
