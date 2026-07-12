import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const orderFormFields = [
  { key: 'customer', label: 'Customer Name', type: 'text', required: true, placeholder: 'e.g. John Smith' },
  { key: 'product', label: 'Product', type: 'text', required: true, placeholder: 'e.g. iPhone 15 Pro' },
  { key: 'amount', label: 'Amount ($)', type: 'number', required: true, min: 1, placeholder: 'e.g. 1299' },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['completed', 'processing', 'pending', 'cancelled'], default: 'pending' },
  { key: 'payment', label: 'Payment', type: 'select', required: true, options: ['paid', 'pending', 'unpaid', 'refunded'], default: 'pending' },
  { key: 'date', label: 'Date', type: 'date', required: true },
];

export function getOrderColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'Order ID', sortable: false },
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    {
      key: 'amount', label: 'Amount',
      render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      key: 'payment', label: 'Payment',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    { key: 'date', label: 'Date' },
    {
      key: 'actions', label: '', sortable: false,
      render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} />,
    },
  ];
}

export const invoiceColumns = [
  { key: 'id', label: 'Invoice #' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
];

export const salesStats = ({ orders, invoices }) => {
  const totalRevenue = orders
    .filter((o) => o.status === 'completed' || o.status === 'processing')
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingAmount = invoices
    .filter((i) => i.status === 'pending' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);
  return [
    { title: 'Total Revenue', value: totalRevenue, change: 12.5, prefix: '$', color: '#6366f1',
      icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { title: 'Pending Invoices', value: pendingAmount, change: -5.2, prefix: '$', color: '#f59e0b',
      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    { title: 'Total Orders', value: orders.length, change: 8.3, color: '#8b5cf6',
      icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>' },
    { title: 'Active Customers', value: 892, change: 15.7, color: '#ec4899',
      icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' },
  ];
};

export function renderOrderCard(order, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={order.status}>{order.status}</Badge>
        <span className="grid-card-id">{order.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{order.product}</h4>
        <span className="grid-card-sub">{order.customer}</span>
        <div className="grid-card-meta">
          <span className="grid-card-amount">${order.amount.toLocaleString()}</span>
          <Badge variant={order.payment} size="sm">{order.payment}</Badge>
        </div>
        <span className="grid-card-date">{order.date}</span>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(order)} onDelete={() => handleDelete(order)} compact />
      </div>
    </div>
  );
}
