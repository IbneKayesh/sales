import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/ui/DetailCard';
import { products } from '../data/mockData';
import { confirm } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { useState } from 'react';
import { StockBar } from './inventory/inventoryConfig';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(() => products.find((p) => p.id === id));

  if (!product) {
    return (
      <div className="detail-page">
        <div className="detail-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Product {id} does not exist.</p>
          <button className="btn-primary" onClick={() => navigate('/inventory')}>Back to Inventory</button>
        </div>
      </div>
    );
  }

  const stockStyle = product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'completed';
  const stockLabel = product.stock === 0 ? 'Out of Stock' : product.stock <= product.minStock ? 'Low Stock' : 'In Stock';

  const fields = [
    { key: 'name', label: 'Product Name', render: (v) => <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Unit Price', render: (v) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
    { key: 'stock', label: 'In Stock', render: (v, row) => <StockBar stock={v} minStock={row.minStock} /> },
    { key: 'minStock', label: 'Min Stock Level' },
    { key: 'unit', label: 'Unit' },
    { key: 'id', label: 'SKU' },
  ];

  const handleDelete = async () => {
    const confirmed = await confirm(
      `Delete "${product.name}" (${product.id})?`,
      { title: 'Delete Product', confirmText: 'Delete', variant: 'danger', icon: 'danger' }
    );
    if (confirmed) {
      toast.success(`"${product.name}" deleted`);
      navigate('/inventory');
    }
  };

  return (
    <DetailCard
      item={product}
      backPath="/inventory"
      title={product.name}
      status={{ value: stockStyle, label: stockLabel }}
      fields={fields}
      actions={
        <>
          <button className="btn-primary" onClick={() => navigate('/inventory')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button className="detail-btn-danger" onClick={handleDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </>
      }
    />
  );
}
