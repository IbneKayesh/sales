import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSlidePanel } from '../../components/ui/SlidePanel';
import PanelDetail from '../../components/ui/PanelDetail';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import GridView from '../../components/ui/GridView';
import FormModal from '../../components/ui/FormModal';
import { useToast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { getOrderColumns, orderFormFields, renderOrderCard } from './salesConfig';

const paymentColors = { paid: '#059669', pending: '#d97706', unpaid: '#dc2626', refunded: '#6b7280' };
const orderPanelFields = [
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'amount', label: 'Amount', render: (v) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
  { key: 'status', label: 'Status' },
  { key: 'payment', label: 'Payment', render: (v) => <span style={{ color: paymentColors[v] || '#6b7280', fontWeight: 600 }}>{v}</span> },
  { key: 'date', label: 'Date' },
];

const OrdersView = forwardRef(function OrdersView({ orders, setOrders, viewMode }, ref) {
  const { toast } = useToast();
  const { openPanel, closePanel } = useSlidePanel();
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleAdd = () => { setEditingOrder(null); setFormOpen(true); };
  const handleEdit = (order) => { setEditingOrder(order); setFormOpen(true); };

  const handleDelete = async (order) => {
    const confirmed = await confirm(
      `Are you sure you want to delete order ${order.id} from ${order.customer}?`,
      { title: 'Delete Order', confirmText: 'Delete', variant: 'danger', icon: 'danger' }
    );
    if (confirmed) {
      setOrders(prev => prev.filter(o => o.id !== order.id));
      toast.success(`Order ${order.id} deleted successfully`);
    }
    return confirmed;
  };

  const openOrderPanel = (order) => {
    const idx = orders.findIndex(o => o.id === order.id);
    const prev = idx > 0 ? orders[idx - 1] : null;
    const next = idx < orders.length - 1 ? orders[idx + 1] : null;

    openPanel(
      <PanelDetail
        item={order}
        title={`Order from ${order.customer}`}
        status={order.status}
        fields={orderPanelFields}
        formFields={orderFormFields}
        onBack={closePanel}
        onSave={(formData) => {
          const updated = { ...order, ...formData };
          setOrders(prev => prev.map(o => (o.id === order.id ? updated : o)));
          toast.success(`Order ${order.id} updated`);
        }}
        onDelete={async () => { if (await handleDelete(order)) closePanel(); }}
      />,
      `Order ${order.id}`,
      { label: 'Order', color: '#6366f1', bg: '#6366f115' },
      {
        linkPath: `/sales/${order.id}`,
        nav: {
          onPrev: prev ? () => openOrderPanel(prev) : null,
          onNext: next ? () => openOrderPanel(next) : null,
          hasPrev: !!prev,
          hasNext: !!next,
        }
      }
    );
  };

  const columns = useMemo(() => getOrderColumns(handleEdit, handleDelete), [orders.length]);

  const handleSubmit = async (formData) => {
    if (editingOrder) {
      const updatedOrder = { ...editingOrder, ...formData };
      setOrders(prev => prev.map(o => (o.id === editingOrder.id ? updatedOrder : o)));
      toast.success(`Order ${editingOrder.id} updated`, {
        action: { label: 'View', onClick: () => openOrderPanel(updatedOrder) }
      });
    } else {
      const newId = `ORD-${String(orders.length + 1).padStart(3, '0')}`;
      const newOrder = { id: newId, ...formData };
      setOrders(prev => [newOrder, ...prev]);
      toast.success(`Order ${newId} created`, {
        action: { label: 'View', onClick: () => openOrderPanel(newOrder) }
      });
    }
  };

  useImperativeHandle(ref, () => ({ openForm: handleAdd }), [handleAdd]);

  return (
    <>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={orders}
          searchable
          searchPlaceholder="Search orders..."
          onRowClick={openOrderPanel}
          expandable
          renderExpanded={(row) => (
            <div className="expanded-fields">
              {orderPanelFields.map(f => (
                <div key={f.key} className="expanded-field">
                  <span className="expanded-field-label">{f.label}</span>
                  <span className="expanded-field-value">
                    {f.render ? f.render(row[f.key], row) : row[f.key] ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
      ) : (
        <GridView
          data={orders}
          renderCard={(o) => renderOrderCard(o, handleEdit, handleDelete)}
          searchable
          searchPlaceholder="Search orders..."
          columns={3}
          emptyMessage="No orders found"
          onCardClick={openOrderPanel}
        />
      )}

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title={editingOrder ? `Edit Order ${editingOrder.id}` : 'New Order'}
        fields={orderFormFields}
        initialData={editingOrder || {}}
        submitLabel={editingOrder ? 'Update Order' : 'Create Order'}
        size={480}
      />
    </>
  );
});

export default OrdersView;
