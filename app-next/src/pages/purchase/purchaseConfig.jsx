import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const poFormFields = [
  { key: 'supplier', label: 'Supplier', type: 'select', required: true, options: ['Apple Inc.', 'TechDistributors Co.', 'Global Electronics Ltd.', 'Digital Parts Inc.', 'Asian Tech Imports'] },
  { key: 'items', label: 'Items (pcs)', type: 'number', required: true, min: 1 },
  { key: 'total', label: 'Total Amount ($)', type: 'number', required: true, min: 1 },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['pending', 'shipped', 'received', 'cancelled'], default: 'pending' },
  { key: 'date', label: 'Order Date', type: 'date', required: true },
  { key: 'expected', label: 'Expected Date', type: 'date', required: true },
];

export function getPOColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'PO #' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'items', label: 'Items', render: (val) => `${val} pcs` },
    { key: 'total', label: 'Total', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'date', label: 'Ordered' },
    { key: 'expected', label: 'Expected' },
    {
      key: 'actions', label: '', sortable: false,
      render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} />,
    },
  ];
}

export const supplierColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Company' },
  { key: 'contact', label: 'Contact' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
  { key: 'orders', label: 'Orders', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
];

export const purchaseStats = ({ pos, suppliers }) => {
  const totalPO = pos.filter((po) => po.status !== 'cancelled').reduce((sum, po) => sum + po.total, 0);
  const pendingPO = pos.filter((po) => po.status === 'pending' || po.status === 'shipped').length;
  return [
    { title: 'Total Procurement', value: totalPO, change: 6.8, prefix: '$', color: '#8b5cf6',
      icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
    { title: 'Active Suppliers', value: suppliers.filter((s) => s.status === 'active').length, change: 10, color: '#a855f7',
      icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { title: 'Pending Orders', value: pendingPO, change: -15.4, color: '#f59e0b',
      icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
    { title: 'Stock Investment', value: 423000, change: -3.2, prefix: '$', color: '#ec4899',
      icon: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>' },
  ];
};

export function renderPOCard(po, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={po.status}>{po.status}</Badge>
        <span className="grid-card-id">{po.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{po.supplier}</h4>
        <div className="grid-card-meta">
          <span><strong>{po.items}</strong> items</span>
          <span className="grid-card-amount">${po.total.toLocaleString()}</span>
        </div>
        <div className="grid-card-dates">
          <span>Ordered: {po.date}</span>
          <span>Expected: {po.expected}</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(po)} onDelete={() => handleDelete(po)} compact />
      </div>
    </div>
  );
}
