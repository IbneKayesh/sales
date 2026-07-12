import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/ui/DetailCard';
import { purchaseOrders } from '../data/mockData';
import { confirm } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { useState } from 'react';

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [po, setPo] = useState(() => purchaseOrders.find((p) => p.id === id));

  if (!po) {
    return (
      <div className="detail-page">
        <div className="detail-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Purchase Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>PO {id} does not exist.</p>
          <button className="btn-primary" onClick={() => navigate('/purchase')}>Back to Purchases</button>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'supplier', label: 'Supplier', render: (v) => <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{v}</span> },
    { key: 'items', label: 'Items', render: (v) => `${v} pcs` },
    { key: 'total', label: 'Total Amount', render: (v) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Order Date' },
    { key: 'expected', label: 'Expected Delivery' },
    { key: 'id', label: 'PO #' },
  ];

  const handleDelete = async () => {
    const confirmed = await confirm(
      `Delete PO ${po.id} from ${po.supplier}?`,
      { title: 'Delete Purchase Order', confirmText: 'Delete', variant: 'danger', icon: 'danger' }
    );
    if (confirmed) {
      toast.success(`PO ${po.id} deleted`);
      navigate('/purchase');
    }
  };

  return (
    <DetailCard
      item={po}
      backPath="/purchase"
      title={`PO: ${po.supplier}`}
      status={{ value: po.status, label: po.status }}
      fields={fields}
      actions={
        <>
          <button className="btn-primary" onClick={() => navigate('/purchase')}>
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
