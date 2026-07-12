import { useParams, useNavigate } from 'react-router-dom';
import DetailCard from '../components/ui/DetailCard';
import Badge from '../components/ui/Badge';
import { recentOrders } from '../data/mockData';
import { confirm } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { useState } from 'react';

const paymentColors = {
  paid: '#059669', pending: '#d97706', unpaid: '#dc2626', refunded: '#6b7280',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(() => recentOrders.find((o) => o.id === id));

  if (!order) {
    return (
      <div className="detail-page">
        <div className="detail-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Order Not Found</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Order {id} does not exist.</p>
          <button className="btn-primary" onClick={() => navigate('/sales')}>Back to Sales</button>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'customer', label: 'Customer' },
    { key: 'product', label: 'Product' },
    { key: 'amount', label: 'Amount', render: (v) => <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={v}>{v}</Badge> },
    { key: 'payment', label: 'Payment',
      render: (v) => <span style={{ color: paymentColors[v] || '#6b7280', fontWeight: 600 }}>{v}</span> },
    { key: 'date', label: 'Order Date' },
    { key: 'id', label: 'Order ID' },
  ];

  const handleDelete = async () => {
    const confirmed = await confirm(
      `Delete order ${order.id} from ${order.customer}?`,
      { title: 'Delete Order', confirmText: 'Delete', variant: 'danger', icon: 'danger' }
    );
    if (confirmed) {
      toast.success(`Order ${order.id} deleted`);
      navigate('/sales');
    }
  };

  return (
    <>
      <DetailCard
        item={order}
        backPath="/sales"
        title={`Order from ${order.customer}`}
        status={{ value: order.status, label: order.status }}
        fields={fields}
        actions={
          <>
            <button className="btn-primary" onClick={() => navigate('/sales')}>
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
    </>
  );
}
