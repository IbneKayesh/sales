import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSlidePanel } from '../../components/ui/SlidePanel';
import PanelDetail from '../../components/ui/PanelDetail';
import DetailModal from '../../components/ui/DetailModal';
import Badge from '../../components/ui/Badge';
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
  const [previewPO, setPreviewPO] = useState(null);

  const poDetailFields = [
    { key: 'supplier', label: 'Supplier', render: (v) => <span style={{ fontWeight: 700 }}>{v}</span> },
    { key: 'items', label: 'Items', render: (v) => `${v} pcs` },
    { key: 'total', label: 'Total', render: (v) => <strong style={{ color: 'var(--accent)' }}>${v?.toLocaleString()}</strong> },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={v}>{v}</Badge> },
    { key: 'date', label: 'Ordered' },
    { key: 'expected', label: 'Expected' },
  ];

  const bulkPOColumns = [
    { key: 'id', label: 'PO #' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'items', label: 'Items' },
    { key: 'total', label: 'Total', render: (v) => <span style={{ fontWeight: 600 }}>${v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (v) => <Badge variant={v}>{v}</Badge> },
  ];

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
          exportable
          exportFilename="purchase-orders"
          bulkActions={{
            label: 'Delete',
            modalTitle: 'Delete Purchase Orders',
            actionLabel: 'Delete',
            actionVariant: 'danger',
            description: 'Select purchase orders to remove. This action cannot be undone.',
            columns: bulkPOColumns,
            size: 'lg',
            confirm: {
              title: 'Delete Purchase Orders',
              message: 'Are you sure you want to delete the selected purchase orders? This will open a preview where you can review and confirm.',
              confirmText: 'Review & Delete',
            },
            onAction: async (items) => {
              await new Promise(resolve => setTimeout(resolve, 500));
              const ids = items.map(i => i.id);
              setPos(prev => prev.filter(p => !ids.includes(p.id)));
            },
          }}
          renderExpanded={(row) => (
            <div className="expanded-card">
              <div className="expanded-card-header">
                <div className="expanded-card-id">{row.id}</div>
                <Badge variant={row.status}>{row.status}</Badge>
              </div>
              <div className="expanded-card-fields">
                {poPanelFields.map(f => (
                  <div key={f.key} className="expanded-card-field">
                    <span className="expanded-card-label">{f.label}</span>
                    <span className="expanded-card-value">
                      {f.render ? f.render(row[f.key], row) : row[f.key] ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="expanded-card-actions">
                <button className="expanded-card-btn" onClick={(e) => { e.stopPropagation(); openPOPanel(row); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Full Details
                </button>
                <button className="expanded-card-btn secondary" onClick={(e) => { e.stopPropagation(); setPreviewPO(row); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Quick Preview
                </button>
              </div>
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

      {/* Quick Preview DetailModal */}
      <DetailModal
        open={!!previewPO}
        onClose={() => setPreviewPO(null)}
        title={`PO: ${previewPO?.supplier || ''}`}
        item={previewPO}
        fields={poDetailFields}
        badge={{ label: previewPO?.status, variant: previewPO?.status }}
        actions={[
          { label: 'Full Details', variant: 'primary', onClick: (item) => { setPreviewPO(null); openPOPanel(item); } },
        ]}
      />

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
