import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const products = [
  { id: 'PRD-001', name: 'iPhone 15 Pro', category: 'Smartphones', price: 1299, stock: 45, minStock: 20, unit: 'pcs' },
  { id: 'PRD-002', name: 'MacBook Air M3', category: 'Laptops', price: 1599, stock: 18, minStock: 10, unit: 'pcs' },
  { id: 'PRD-003', name: 'iPad Air', category: 'Tablets', price: 749, stock: 27, minStock: 15, unit: 'pcs' },
];

export const bomItems = [
  { id: 'BOM-001', product: 'iPhone 15 Pro', component: 'A17 Pro Chip', qty: 1, unit: 'pcs', cost: 45 },
  { id: 'BOM-002', product: 'iPhone 15 Pro', component: 'OLED Display', qty: 1, unit: 'pcs', cost: 120 },
  { id: 'BOM-003', product: 'iPhone 15 Pro', component: 'Titanium Frame', qty: 1, unit: 'pcs', cost: 35 },
  { id: 'BOM-004', product: 'MacBook Air M3', component: 'M3 Chip', qty: 1, unit: 'pcs', cost: 180 },
  { id: 'BOM-005', product: 'MacBook Air M3', component: '13.6" Display', qty: 1, unit: 'pcs', cost: 220 },
  { id: 'BOM-006', product: 'MacBook Air M3', component: 'Magic Keyboard', qty: 1, unit: 'pcs', cost: 65 },
];

export const workOrders = [
  { id: 'WO-001', product: 'iPhone 15 Pro', qty: 100, planned: '2026-07-15', deadline: '2026-07-20', status: 'in_progress', assignedTo: 'Assembly Line A' },
  { id: 'WO-002', product: 'MacBook Air M3', qty: 50, planned: '2026-07-16', deadline: '2026-07-22', status: 'planned', assignedTo: 'Assembly Line B' },
  { id: 'WO-003', product: 'iPad Air', qty: 75, planned: '2026-07-14', deadline: '2026-07-19', status: 'completed', assignedTo: 'Assembly Line A' },
];

export const mfgFormFields = [
  { key: 'product', label: 'Product', type: 'select', required: true, options: products.map(p => p.name) },
  { key: 'qty', label: 'Quantity', type: 'number', required: true, min: 1 },
  { key: 'planned', label: 'Planned Date', type: 'date', required: true },
  { key: 'deadline', label: 'Deadline', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['planned', 'in_progress', 'completed', 'cancelled'] },
  { key: 'assignedTo', label: 'Assigned To', type: 'text', required: true },
];

export function getWorkOrderColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'WO #' }, { key: 'product', label: 'Product' },
    { key: 'qty', label: 'Quantity', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'planned', label: 'Planned' }, { key: 'deadline', label: 'Deadline' },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val.replace('_', ' ')}</Badge> },
    { key: 'assignedTo', label: 'Assigned' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export function getBOMColumns() {
  return [
    { key: 'id', label: 'BOM #' }, { key: 'product', label: 'Product' },
    { key: 'component', label: 'Component' },
    { key: 'qty', label: 'Qty', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'unit', label: 'Unit' },
    { key: 'cost', label: 'Cost', render: (val) => <span style={{ fontWeight: 600 }}>${val}</span> },
  ];
}

export const manufacturingStats = () => {
  const activeWOs = workOrders.filter(w => w.status === 'in_progress' || w.status === 'planned').length;
  return [
    { title: 'Active Work Orders', value: activeWOs, change: 8.2, color: '#6366f1', icon: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>' },
    { title: 'Products in BOM', value: bomItems.length, change: 4.5, color: '#059669', icon: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>' },
    { title: 'Completion Rate', value: '92%', change: 3.1, color: '#a855f7', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
    { title: 'Total Output', value: workOrders.reduce((s, w) => s + w.qty, 0), change: -1.8, color: '#d97706', icon: '<path d="M20 7h-4.5a2.5 2.5 0 0 1 0-5H20"/><path d="M4 7h4.5a2.5 2.5 0 0 0 0-5H4"/><path d="M4 17h4.5a2.5 2.5 0 0 1 0 5H4"/><path d="M20 17h-4.5a2.5 2.5 0 0 0 0 5H20"/>' },
  ];
};

export function renderWorkOrderCard(wo, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={wo.status}>{wo.status.replace('_', ' ')}</Badge>
        <span className="grid-card-id">{wo.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{wo.product}</h4>
        <span className="grid-card-sub">{wo.assignedTo}</span>
        <div className="grid-card-meta">
          <span style={{ fontWeight: 600 }}>{wo.qty} units</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Due: {wo.deadline}</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(wo)} onDelete={() => handleDelete(wo)} compact />
      </div>
    </div>
  );
}
