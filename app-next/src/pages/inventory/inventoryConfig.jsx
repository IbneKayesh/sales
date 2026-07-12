import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const productFormFields = [
  { key: 'name', label: 'Product Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'select', required: true, options: ['Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio', 'Desktops', 'Accessories'] },
  { key: 'price', label: 'Unit Price ($)', type: 'number', required: true, min: 1 },
  { key: 'stock', label: 'Stock Quantity', type: 'number', required: true, min: 0 },
  { key: 'minStock', label: 'Min Stock Level', type: 'number', required: true, min: 1 },
  { key: 'unit', label: 'Unit', type: 'select', required: true, options: ['pcs', 'box', 'kg', 'm'], default: 'pcs' },
];

export function StockBar({ stock, minStock }) {
  const color = stock === 0 ? '#dc2626' : stock <= minStock ? '#d97706' : '#059669';
  return (
    <div className="stock-cell">
      <div className="stock-bar-wrapper">
        <div className="stock-bar" style={{ width: `${Math.min(100, (stock / 100) * 100)}%`, background: color }} />
      </div>
      <span style={{ fontWeight: 600, color }}>{stock}</span>
    </div>
  );
}

export function getProductColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Unit Price', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'stock', label: 'In Stock', render: (val, row) => <StockBar stock={val} minStock={row.minStock} /> },
    { key: 'minStock', label: 'Min Stock', render: (val) => <span style={{ color: '#6b7280' }}>{val}</span> },
    { key: 'unit', label: 'Unit' },
    {
      key: 'actions', label: '', sortable: false,
      render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} />,
    },
  ];
}

export const alertColumns = [
  { key: 'name', label: 'Product' },
  { key: 'stock', label: 'Stock', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
  { key: 'minStock', label: 'Min Required' },
  { key: 'status', label: 'Status', render: (_, row) => row.stock === 0 ? <Badge variant="out">Out of Stock</Badge> : <Badge variant="low">Low Stock</Badge> },
];

export const inventoryStats = ({ products }) => {
  const stockValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const currentLow = products.filter((p) => p.stock <= p.minStock && p.stock > 0);
  const currentOut = products.filter((p) => p.stock === 0);
  return [
    { title: 'Stock Value', value: stockValue, change: -3.2, prefix: '$', color: '#a855f7',
      icon: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>' },
    { title: 'Total Products', value: products.length, change: -2.1, color: '#d946ef',
      icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
    { title: 'Total Units', value: totalUnits, change: 4.5, color: '#f43f5e',
      icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>' },
    { title: 'Low Stock Items', value: currentLow.length + currentOut.length, change: 22.5, color: '#f59e0b',
      icon: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  ];
};

export function renderProductCard(product, handleEdit, handleDelete) {
  const stockColor = product.stock === 0 ? '#dc2626' : product.stock <= product.minStock ? '#d97706' : '#059669';
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'completed'}>
          {product.stock === 0 ? 'Out' : product.stock <= product.minStock ? 'Low' : 'In Stock'}
        </Badge>
        <span className="grid-card-id">{product.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{product.name}</h4>
        <span className="grid-card-sub">{product.category}</span>
        <div className="grid-card-meta">
          <span className="grid-card-amount">${product.price.toLocaleString()}</span>
          <span className="grid-card-stock" style={{ color: stockColor }}>Stock: {product.stock} {product.unit}</span>
        </div>
        <div className="stock-bar-wrapper" style={{ marginTop: 4 }}>
          <div className="stock-bar" style={{
            width: `${Math.min(100, (product.stock / 100) * 100)}%`,
            background: stockColor,
          }} />
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(product)} onDelete={() => handleDelete(product)} compact />
      </div>
    </div>
  );
}
