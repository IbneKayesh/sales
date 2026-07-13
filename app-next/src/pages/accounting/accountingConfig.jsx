import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const accounts = [
  { id: 'ACC-001', name: 'Cash & Bank', type: 'asset', balance: 245000, code: '1001' },
  { id: 'ACC-002', name: 'Accounts Receivable', type: 'asset', balance: 128000, code: '1100' },
  { id: 'ACC-003', name: 'Inventory', type: 'asset', balance: 423000, code: '1200' },
  { id: 'ACC-004', name: 'Accounts Payable', type: 'liability', balance: 89000, code: '2001' },
  { id: 'ACC-005', name: 'Short-term Loans', type: 'liability', balance: 50000, code: '2100' },
  { id: 'ACC-006', name: 'Share Capital', type: 'equity', balance: 500000, code: '3001' },
  { id: 'ACC-007', name: 'Retained Earnings', type: 'equity', balance: 320000, code: '3100' },
  { id: 'ACC-008', name: 'Sales Revenue', type: 'revenue', balance: 175000, code: '4001' },
  { id: 'ACC-009', name: 'Cost of Goods Sold', type: 'expense', balance: 105000, code: '5001' },
  { id: 'ACC-010', name: 'Operating Expenses', type: 'expense', balance: 45000, code: '5100' },
];

export const journalEntries = [
  { id: 'JE-001', date: '2026-07-12', description: 'Sales revenue for July', account: 'Accounts Receivable', debit: 35000, credit: 0, reference: 'INV-001' },
  { id: 'JE-002', date: '2026-07-12', description: 'Sales revenue for July', account: 'Sales Revenue', debit: 0, credit: 35000, reference: 'INV-001' },
  { id: 'JE-003', date: '2026-07-11', description: 'Supplier payment', account: 'Accounts Payable', debit: 15000, credit: 0, reference: 'PO-002' },
  { id: 'JE-004', date: '2026-07-11', description: 'Supplier payment', account: 'Cash & Bank', debit: 0, credit: 15000, reference: 'PO-002' },
  { id: 'JE-005', date: '2026-07-10', description: 'Employee salary accrual', account: 'Operating Expenses', debit: 62000, credit: 0, reference: 'PAY-001' },
  { id: 'JE-006', date: '2026-07-10', description: 'Employee salary accrual', account: 'Accounts Payable', debit: 0, credit: 62000, reference: 'PAY-001' },
];

export const invoices = [
  { id: 'INV-001', customer: 'Sarah Johnson', amount: 1299, dueDate: '2026-08-11', status: 'paid', date: '2026-07-12' },
  { id: 'INV-002', customer: 'Michael Chen', amount: 1599, dueDate: '2026-08-11', status: 'pending', date: '2026-07-12' },
  { id: 'INV-003', customer: 'Emily Davis', amount: 249, dueDate: '2026-08-10', status: 'paid', date: '2026-07-11' },
  { id: 'INV-004', customer: 'James Wilson', amount: 749, dueDate: '2026-08-10', status: 'overdue', date: '2026-07-11' },
  { id: 'INV-005', customer: 'Lisa Anderson', amount: 899, dueDate: '2026-08-09', status: 'paid', date: '2026-07-10' },
  { id: 'INV-006', customer: 'David Thompson', amount: 1899, dueDate: '2026-08-09', status: 'cancelled', date: '2026-07-10' },
];

export const invoiceFormFields = [
  { key: 'customer', label: 'Customer', type: 'text', required: true },
  { key: 'amount', label: 'Amount ($)', type: 'number', required: true, min: 1 },
  { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['paid', 'pending', 'overdue', 'cancelled'] },
];

export function getAccountColumns() {
  return [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Account Name' },
    { key: 'type', label: 'Type', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'balance', label: 'Balance', render: (val) => <span style={{ fontWeight: 600, color: val >= 0 ? 'var(--text-h)' : '#dc2626' }}>${Math.abs(val).toLocaleString()}</span> },
  ];
}

export function getJournalColumns() {
  return [
    { key: 'id', label: 'JE #' },
    { key: 'date', label: 'Date' },
    { key: 'description', label: 'Description' },
    { key: 'account', label: 'Account' },
    { key: 'debit', label: 'Debit', render: (val) => val > 0 ? <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> : '—' },
    { key: 'credit', label: 'Credit', render: (val) => val > 0 ? <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> : '—' },
    { key: 'reference', label: 'Reference' },
  ];
}

export const accountingStats = () => {
  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((s, a) => s + a.balance, 0);
  return [
    { title: 'Total Assets', value: totalAssets, change: 4.2, prefix: '$', color: '#059669', icon: '<path d="M12 1v22M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { title: 'Total Liabilities', value: totalLiabilities, change: -2.1, prefix: '$', color: '#dc2626', icon: '<path d="M4 17h16M4 12h16M4 7h16"/>' },
    { title: 'Equity', value: 820000, change: 6.8, prefix: '$', color: '#6366f1', icon: '<path d="M18 20V10M12 20V4M6 20v-6"/>' },
    { title: 'Net Income', value: 25000, change: 15.3, prefix: '$', color: '#a855f7', icon: '<path d="M13 17V9M7 17l5-5 5 5"/><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/>' },
  ];
};

export function renderInvoiceCard(inv, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={inv.status}>{inv.status}</Badge>
        <span className="grid-card-id">{inv.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{inv.customer}</h4>
        <div className="grid-card-meta">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Due: {inv.dueDate}</span>
          <span className="grid-card-amount">${inv.amount.toLocaleString()}</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(inv)} onDelete={() => handleDelete(inv)} compact />
      </div>
    </div>
  );
}
