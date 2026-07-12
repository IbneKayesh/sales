import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

const orderColumns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  {
    key: 'amount',
    label: 'Amount',
    render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <Badge variant={val}>{val}</Badge>,
  },
  {
    key: 'payment',
    label: 'Payment',
    render: (val) => <Badge variant={val}>{val}</Badge>,
  },
  { key: 'date', label: 'Date' },
];

export default function RecentOrdersWidget({ orders }) {
  return (
    <div className="chart-card recent-orders-card">
      <div className="card-header">
        <h3>Recent Orders</h3>
        <span className="card-subtitle">Latest transactions</span>
      </div>
      <DataTable columns={orderColumns} data={orders} pageSize={5} />
    </div>
  );
}
