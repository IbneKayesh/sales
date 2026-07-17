import { useState } from 'react';

import { fmtCurrency } from '@/utils/dataFormat';
import { IconSearch } from '@/assets/icons';
import DataTable from '../../components/DataTable/DataTable';
import './InvoicePage.css';
const MOCK_INVOICES = [
  { id: 'INV-001', customer: 'Acme Corp', amount: 6000, status: 'Paid', due: '2026-08-10', issued: '2026-07-10' },
  { id: 'INV-002', customer: 'Globex Inc', amount: 3000, status: 'Pending', due: '2026-08-11', issued: '2026-07-11' },
  { id: 'INV-003', customer: 'Initech LLC', amount: 792, status: 'Overdue', due: '2026-08-05', issued: '2026-07-05' },
  { id: 'INV-004', customer: 'Umbrella Corp', amount: 900, status: 'Paid', due: '2026-08-09', issued: '2026-07-09' },
  { id: 'INV-005', customer: 'Stark Industries', amount: 2900, status: 'Draft', due: '2026-08-20', issued: '2026-07-13' },
];

const statusStyles = {
  Paid: 'statusPaid',
  Pending: 'statusPending',
  Overdue: 'statusOverdue',
  Draft: 'statusDraft',
};

const InvoicePage = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_INVOICES.filter(
    (o) => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'Invoice', sortable: true, render: (val) => <code className="invoiceId">{val}</code> },
    { key: 'customer', label: 'Customer', sortable: true, render: (val) => <span className="customer">{val}</span> },
    { key: 'amount', label: 'Amount', align: 'right', sortable: true, render: (val) => <span className="amount">{fmtCurrency(val)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <span className={`statusBadge ${statusStyles[val]}`}>{val}</span> },
    { key: 'issued', label: 'Issued', render: (val) => <span className="muted">{val}</span> },
    { key: 'due', label: 'Due Date', render: (val) => <span className="muted">{val}</span> },
  ];

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2 className="title">Invoices</h2>
          <p className="subtitle">Track billing and payment status</p>
        </div>
        <div className="searchWrapper">
          <IconSearch className="searchIcon" />
          <input className="searchInput" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="content">
        <div className="statsBar">
          <div className="statItem">
            <span className="statValue">{MOCK_INVOICES.length}</span>
            <span className="statLabel">Total</span>
          </div>
          <div className="statItem">
            <span className="statValue">{fmtCurrency(MOCK_INVOICES.reduce((s, i) => s + i.amount, 0))}</span>
            <span className="statLabel">Outstanding</span>
          </div>
          <div className="statItem">
            <span className="statValue">{MOCK_INVOICES.filter((i) => i.status === 'Overdue').length}</span>
            <span className="statLabel">Overdue</span>
          </div>
        </div>
        <DataTable columns={columns} data={filtered} keyField="id" sortable paginated pageSize={15} />
      </div>
    </div>
  );
};

export default InvoicePage;
