import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const suppliers = [
  { id: 'SUP-001', name: 'Apple Inc.', contact: 'Steve Jobs', email: 'supply@apple.com', phone: '+1 (408) 996-1010', status: 'active', orders: 45, rating: 4.8, category: 'Electronics' },
  { id: 'SUP-002', name: 'TechDistributors Co.', contact: 'John Smith', email: 'orders@techdist.com', phone: '+1 (213) 555-0198', status: 'active', orders: 28, rating: 4.2, category: 'Electronics' },
  { id: 'SUP-003', name: 'Global Logistics Inc.', contact: 'Maria Garcia', email: 'logistics@global.com', phone: '+1 (415) 555-0123', status: 'active', orders: 32, rating: 4.5, category: 'Logistics' },
  { id: 'SUP-004', name: 'Raw Materials Co.', contact: 'Alex Turner', email: 'info@rawmaterials.com', phone: '+1 (310) 555-0456', status: 'inactive', orders: 5, rating: 3.8, category: 'Materials' },
  { id: 'SUP-005', name: 'Asian Tech Imports', contact: 'Kenji Nakamura', email: 'contact@asiantech.asia', phone: '+81 (3) 5550-1234', status: 'active', orders: 18, rating: 4.6, category: 'Electronics' },
];

export const rfqs = [
  { id: 'RFQ-001', supplier: 'Apple Inc.', items: 'iPhone 15 Pro', qty: 200, budget: 259800, deadline: '2026-07-25', status: 'pending' },
  { id: 'RFQ-002', supplier: 'TechDistributors Co.', items: 'MacBook Air M3', qty: 50, budget: 79950, deadline: '2026-07-20', status: 'sent' },
  { id: 'RFQ-003', supplier: 'Global Logistics Inc.', items: 'Warehouse Services', qty: 1, budget: 15000, deadline: '2026-07-30', status: 'negotiating' },
  { id: 'RFQ-004', supplier: 'Asian Tech Imports', items: 'iPad Air', qty: 100, budget: 74900, deadline: '2026-08-01', status: 'draft' },
];

export const supplierFormFields = [
  { key: 'name', label: 'Company Name', type: 'text', required: true },
  { key: 'contact', label: 'Contact Person', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'inactive'] },
];

export const rfqFormFields = [
  { key: 'supplier', label: 'Supplier', type: 'select', required: true, options: suppliers.map(s => s.name) },
  { key: 'items', label: 'Items', type: 'text', required: true },
  { key: 'qty', label: 'Quantity', type: 'number', required: true, min: 1 },
  { key: 'budget', label: 'Budget ($)', type: 'number', required: true, min: 1 },
  { key: 'deadline', label: 'Deadline', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['draft', 'sent', 'negotiating', 'accepted', 'rejected'] },
];

export function getSupplierColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Company' },
    { key: 'contact', label: 'Contact' }, { key: 'email', label: 'Email' },
    { key: 'category', label: 'Category' },
    { key: 'rating', label: 'Rating', render: (val) => <span style={{ fontWeight: 600, color: val >= 4.5 ? '#059669' : val >= 4 ? '#6366f1' : '#d97706' }}>★ {val}</span> },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'orders', label: 'Orders', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export function getRFQColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'RFQ #' }, { key: 'supplier', label: 'Supplier' },
    { key: 'items', label: 'Items' }, { key: 'qty', label: 'Qty', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'budget', label: 'Budget', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'deadline', label: 'Deadline' },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export const supplyChainStats = () => ({
  stats: [
    { title: 'Active Suppliers', value: suppliers.filter(s => s.status === 'active').length, change: 5, color: '#059669', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { title: 'Open RFQs', value: rfqs.filter(r => r.status === 'sent' || r.status === 'negotiating').length, change: 12.5, color: '#6366f1', icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>' },
    { title: 'Avg. Rating', value: '4.4', change: 3.1, color: '#f59e0b', icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
    { title: 'Total Orders', value: suppliers.reduce((s, su) => s + su.orders, 0), change: 8.7, color: '#a855f7', icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  ],
});

export function renderSupplierCard(sup, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={sup.status}>{sup.status}</Badge>
        <span className="grid-card-id">{sup.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{sup.name}</h4>
        <span className="grid-card-sub">{sup.category}</span>
        <div className="grid-card-meta">
          <span style={{ fontWeight: 600, color: sup.rating >= 4.5 ? '#059669' : '#d97706' }}>★ {sup.rating}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sup.orders} orders</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(sup)} onDelete={() => handleDelete(sup)} compact />
      </div>
    </div>
  );
}
