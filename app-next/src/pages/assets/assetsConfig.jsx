import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const fixedAssets = [
  { id: 'AST-001', name: 'Office Building', category: 'Building', value: 2500000, salvage: 250000, life: 30, depreciation: 75000, acquired: '2020-01-01', status: 'active', department: 'Operations' },
  { id: 'AST-002', name: 'Server Rack', category: 'IT Equipment', value: 85000, salvage: 5000, life: 5, depreciation: 16000, acquired: '2023-03-15', status: 'active', department: 'Engineering' },
  { id: 'AST-003', name: 'Forklift A-1', category: 'Equipment', value: 35000, salvage: 3000, life: 8, depreciation: 4000, acquired: '2022-06-01', status: 'active', department: 'Operations' },
  { id: 'AST-004', name: 'Company Vehicles', category: 'Vehicle', value: 180000, salvage: 20000, life: 5, depreciation: 32000, acquired: '2024-01-15', status: 'active', department: 'Sales' },
  { id: 'AST-005', name: 'Manufacturing Equipment', category: 'Equipment', value: 450000, salvage: 25000, life: 10, depreciation: 42500, acquired: '2021-09-01', status: 'maintenance', department: 'Manufacturing' },
  { id: 'AST-006', name: 'Furniture & Fixtures', category: 'Furniture', value: 95000, salvage: 5000, life: 7, depreciation: 12857, acquired: '2023-01-01', status: 'active', department: 'Operations' },
];

export const assetFormFields = [
  { key: 'name', label: 'Asset Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', required: true, options: ['Building', 'IT Equipment', 'Equipment', 'Vehicle', 'Furniture', 'Software'] },
  { key: 'value', label: 'Acquisition Value ($)', type: 'number', required: true, min: 1 },
  { key: 'life', label: 'Useful Life (years)', type: 'number', required: true, min: 1 },
  { key: 'acquired', label: 'Acquisition Date', type: 'date', required: true },
  { key: 'department', label: 'Department', type: 'text', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'maintenance', 'retired'] },
];

export function getAssetColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Asset' },
    { key: 'category', label: 'Category' },
    { key: 'value', label: 'Value', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'depreciation', label: 'Annual Depr.', render: (val) => <span>${Math.round(val).toLocaleString()}</span> },
    { key: 'life', label: 'Life (yrs)' },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'department', label: 'Department' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export const assetsStats = () => {
  const totalValue = fixedAssets.reduce((s, a) => s + a.value, 0);
  const totalDepr = fixedAssets.reduce((s, a) => s + a.depreciation, 0);
  const netBook = totalValue - fixedAssets.reduce((s, a) => s + (a.depreciation * (new Date().getFullYear() - new Date(a.acquired).getFullYear())), 0);
  return [
    { title: 'Total Asset Value', value: totalValue, change: 4.2, prefix: '$', color: '#6366f1', icon: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>' },
    { title: 'Net Book Value', value: Math.max(0, netBook), change: -2.1, prefix: '$', color: '#059669', icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>' },
    { title: 'Annual Depreciation', value: Math.round(totalDepr), change: 3.8, prefix: '$', color: '#d97706', icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    { title: 'Assets in Maintenance', value: fixedAssets.filter(a => a.status === 'maintenance').length, change: 0, color: '#dc2626', icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  ];
};

export function renderAssetCard(asset, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={asset.status}>{asset.status}</Badge>
        <span className="grid-card-id">{asset.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{asset.name}</h4>
        <span className="grid-card-sub">{asset.category} · {asset.department}</span>
        <div className="grid-card-meta">
          <span className="grid-card-amount">${asset.value.toLocaleString()}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{asset.life}yr life</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(asset)} onDelete={() => handleDelete(asset)} compact />
      </div>
    </div>
  );
}
