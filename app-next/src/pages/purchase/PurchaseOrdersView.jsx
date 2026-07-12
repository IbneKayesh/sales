import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSlidePanel } from '../../components/ui/SlidePanel';
import PanelDetail from '../../components/ui/PanelDetail';
import DataTable from '../../components/ui/DataTable';
import GridView from '../../components/ui/GridView';
import FormModal from '../../components/ui/FormModal';
import { useToast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { getPOColumns, poFormFields, renderPOCard } from './purchaseConfig';

const PurchaseOrdersView = forwardRef(function PurchaseOrdersView({ pos, setPos, viewMode }, ref) {
  const { toast } = useToast();
  const { openPanel, closePanel } = useSlidePanel();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPO, setEditingPO] = useState(null);

  const handleAdd = () => { setEditingPO(null); setFormOpen(true); };
  const handleEdit = (po) => { setEditingPO(po); setFormOpen(true); };

  const handleDelete = async (po) => {
    const confirmed = await confirm(`Delete purchase order ${po.id} from ${po.supplier}?`, {
      title: 'Delete Purchase Order', confirmText: 'Delete', variant: 'danger', icon: 'danger',
    });
    if (confirmed) {
      setPos(prev => prev.filter(p => p.id !== po.id));
      toast.success(`Purchase order ${po.id} deleted`);
    }
    return confirmed;
  };

  const poPanelFields = [
    { key: 'supplier', label: 'Supplier', render: (v) => <span style={{ fontWeight: 700 }}>{v}</span> },
    { key: 'items', label: 'Items', render: (v) => `${v} pcs` },
    { key: 'total', label: 'Total', render: (v) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Ordered' },
    { key: 'expected', label: 'Expected' },
  ];

  const openPOPanel = (po) => {
    const idx = pos.findIndex(p => p.id === po.id);
    const prev = idx > 0 ? pos[idx - 1] : null;
    const next = idx < pos.length - 1 ? pos[idx + 1] : null;

    openPanel(
      <PanelDetail
        item={po}
        title={`PO: ${po.supplier}`}
        status={po.status}
        fields={poPanelFields}
        formFields={poFormFields}
        onBack={closePanel}
        onSave={(formData) => {
          const updated = { ...po, ...formData };
          setPos(prev => prev.map(p => (p.id === po.id ? updated : p)));
          toast.success(`PO ${po.id} updated`);
        }}
        onDelete={async () => { if (await handleDelete(po)) closePanel(); }}
      />,
      po.id,
      { label: 'Purchase', color: '#f59e0b', bg: '#f59e0b15' },
      {
        linkPath: `/purchase/${po.id}`,
        nav: {
          onPrev: prev ? () => openPOPanel(prev) : null,
          onNext: next ? () => openPOPanel(next) : null,
          hasPrev: !!prev,
          hasNext: !!next,
        }
      }
    );
  };

  const columns = useMemo(() => getPOColumns(handleEdit, handleDelete), [pos.length]);

  const handleSubmit = async (formData) => {
    if (editingPO) {
      const updatedPO = { ...editingPO, ...formData };
      setPos(prev => prev.map(p => p.id === editingPO.id ? updatedPO : p));
      toast.success(`PO ${editingPO.id} updated`, {
        action: { label: 'View', onClick: () => openPOPanel(updatedPO) }
      });
    } else {
      const newId = `PO-${String(pos.length + 1).padStart(3, '0')}`;
      const newPO = { id: newId, ...formData };
      setPos(prev => [newPO, ...prev]);
      toast.success(`PO ${newId} created`, {
        action: { label: 'View', onClick: () => openPOPanel(newPO) }
      });
    }
    setFormOpen(false);
  };

  useImperativeHandle(ref, () => ({ openForm: handleAdd }), [handleAdd]);

  return (
    <>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={pos}
          searchable
          searchPlaceholder="Search PO..."
          onRowClick={openPOPanel}
          expandable
          renderExpanded={(row) => (
            <div className="expanded-fields">
              {poPanelFields.map(f => (
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
          data={pos}
          renderCard={(p) => renderPOCard(p, handleEdit, handleDelete)}
          searchable
          searchPlaceholder="Search PO..."
          columns={3}
          onCardClick={openPOPanel}
        />
      )}

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title={editingPO ? `Edit ${editingPO.id}` : 'New Purchase Order'}
        fields={poFormFields}
        initialData={editingPO || {}}
        submitLabel={editingPO ? 'Update' : 'Create'}
        size={480}
      />
    </>
  );
});

export default PurchaseOrdersView;
