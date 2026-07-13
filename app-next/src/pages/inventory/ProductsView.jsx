import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSlidePanel } from '../../components/ui/SlidePanel';
import PanelDetail from '../../components/ui/PanelDetail';
import DetailModal from '../../components/ui/DetailModal';
import Badge from '../../components/ui/Badge';
import { StockBar } from './inventoryConfig';
import DataTable from '../../components/ui/DataTable';
import GridView from '../../components/ui/GridView';
import FormModal from '../../components/ui/FormModal';
import { useToast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { getProductColumns, productFormFields, renderProductCard } from './inventoryConfig';

const ProductsView = forwardRef(function ProductsView({ products, setProducts, viewMode }, ref) {
  const { toast } = useToast();
  const { openPanel, closePanel } = useSlidePanel();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  const productDetailFields = [
    { key: 'name', label: 'Product', render: (v) => <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (v) => <strong style={{ color: 'var(--accent)' }}>${v?.toLocaleString()}</strong> },
    { key: 'stock', label: 'In Stock', render: (v, row) => <StockBar stock={v} minStock={row.minStock} /> },
    { key: 'minStock', label: 'Min Stock' },
    { key: 'unit', label: 'Unit' },
  ];

  const bulkProductColumns = [
    { key: 'id', label: 'SKU' },
    { key: 'name', label: 'Product' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (v) => <span style={{ fontWeight: 600 }}>${v?.toLocaleString()}</span> },
    { key: 'stock', label: 'Stock' },
  ];

  const handleAdd = () => { setEditingProduct(null); setFormOpen(true); };
  const handleEdit = (product) => { setEditingProduct(product); setFormOpen(true); };

  const handleDelete = async (product) => {
    const confirmed = await confirm(
      `Are you sure you want to delete "${product.name}" (${product.id})? This action cannot be undone.`,
      { title: 'Delete Product', confirmText: 'Delete', variant: 'danger', icon: 'danger' }
    );
    if (confirmed) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success(`"${product.name}" deleted successfully`);
    }
    return confirmed;
  };

  const productPanelFields = [
    { key: 'name', label: 'Product', render: (v) => <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{v}</span> },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (v) => <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${v?.toLocaleString()}</span> },
    { key: 'stock', label: 'Stock', render: (v, row) => <StockBar stock={v} minStock={row.minStock} /> },
    { key: 'minStock', label: 'Min Stock' },
    { key: 'unit', label: 'Unit' },
  ];

  const openProductPanel = (product) => {
    const idx = products.findIndex(p => p.id === product.id);
    const prev = idx > 0 ? products[idx - 1] : null;
    const next = idx < products.length - 1 ? products[idx + 1] : null;

    openPanel(
      <PanelDetail
        item={product}
        title={product.name}
        status={product.stock === 0 ? 'out' : product.stock <= product.minStock ? 'low' : 'completed'}
        fields={productPanelFields}
        formFields={productFormFields}
        onBack={closePanel}
        onSave={(formData) => {
          const updated = { ...product, ...formData };
          setProducts(prev => prev.map(p => (p.id === product.id ? updated : p)));
          toast.success(`"${formData.name}" updated`);
        }}
        onDelete={async () => { if (await handleDelete(product)) closePanel(); }}
      />,
      `Product ${product.id}`,
      { label: 'Product', color: '#a855f7', bg: '#a855f715' },
      {
        linkPath: `/inventory/${product.id}`,
        nav: {
          onPrev: prev ? () => openProductPanel(prev) : null,
          onNext: next ? () => openProductPanel(next) : null,
          hasPrev: !!prev,
          hasNext: !!next,
        }
      }
    );
  };

  const columns = useMemo(() => getProductColumns(handleEdit, handleDelete), [products.length]);

  const handleSubmit = async (formData) => {
    if (editingProduct) {
      const updated = { ...editingProduct, ...formData };
      setProducts(prev => prev.map(p => (p.id === editingProduct.id ? updated : p)));
      toast.success(`"${formData.name}" updated`, {
        action: { label: 'View', onClick: () => openProductPanel(updated) }
      });
    } else {
      const newId = `PRD-${String(products.length + 1).padStart(3, '0')}`;
      const newProduct = { id: newId, ...formData };
      setProducts(prev => [newProduct, ...prev]);
      toast.success(`"${formData.name}" added`, {
        action: { label: 'View', onClick: () => openProductPanel(newProduct) }
      });
    }
  };

  useImperativeHandle(ref, () => ({ openForm: handleAdd }), [handleAdd]);

  return (
    <>
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={products}
          searchable
          searchPlaceholder="Search products..."
          onRowClick={openProductPanel}
          expandable
          exportable
          exportFilename="inventory-products"
          bulkActions={{
            label: 'Delete',
            modalTitle: 'Delete Products',
            actionLabel: 'Delete',
            actionVariant: 'danger',
            description: 'Select products to remove from inventory. This action cannot be undone.',
            columns: bulkProductColumns,
            size: 'lg',
            confirm: {
              title: 'Delete Products',
              message: 'Are you sure you want to delete the selected products? This will open a preview where you can review and confirm.',
              confirmText: 'Review & Delete',
            },
            onAction: async (items) => {
              await new Promise(resolve => setTimeout(resolve, 500));
              const ids = items.map(i => i.id);
              setProducts(prev => prev.filter(p => !ids.includes(p.id)));
            },
          }}
          renderExpanded={(row) => (
            <div className="expanded-card">
              <div className="expanded-card-header">
                <div className="expanded-card-id">{row.id}</div>
                <Badge variant={row.stock === 0 ? 'out' : row.stock <= row.minStock ? 'low' : 'completed'}>
                  {row.stock === 0 ? 'Out of Stock' : row.stock <= row.minStock ? 'Low Stock' : 'In Stock'}
                </Badge>
              </div>
              <div className="expanded-card-fields">
                <div className="expanded-card-field expanded-card-field-full">
                  <span className="expanded-card-label">Product</span>
                  <span className="expanded-card-value" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{row.name}</span>
                </div>
                {productPanelFields.slice(1).map(f => (
                  <div key={f.key} className="expanded-card-field">
                    <span className="expanded-card-label">{f.label}</span>
                    <span className="expanded-card-value">
                      {f.render ? f.render(row[f.key], row) : row[f.key] ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="expanded-card-actions">
                <button className="expanded-card-btn" onClick={(e) => { e.stopPropagation(); openProductPanel(row); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Full Details
                </button>
                <button className="expanded-card-btn secondary" onClick={(e) => { e.stopPropagation(); setPreviewProduct(row); }}>
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
          data={products}
          renderCard={(p) => renderProductCard(p, handleEdit, handleDelete)}
          searchable
          searchPlaceholder="Search products..."
          columns={3}
          emptyMessage="No products found"
          onCardClick={openProductPanel}
        />
      )}

      {/* Quick Preview DetailModal */}
      <DetailModal
        open={!!previewProduct}
        onClose={() => setPreviewProduct(null)}
        title={previewProduct?.name || 'Product'}
        item={previewProduct}
        fields={productDetailFields}
        badge={{
          label: previewProduct?.stock === 0 ? 'Out of Stock' : previewProduct?.stock <= previewProduct?.minStock ? 'Low Stock' : 'In Stock',
          variant: previewProduct?.stock === 0 ? 'out' : previewProduct?.stock <= previewProduct?.minStock ? 'low' : 'completed',
        }}
        actions={[
          { label: 'Full Details', variant: 'primary', onClick: (item) => { setPreviewProduct(null); openProductPanel(item); } },
        ]}
      />

      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New Product'}
        fields={productFormFields}
        initialData={editingProduct || {}}
        submitLabel={editingProduct ? 'Update Product' : 'Add Product'}
        size={480}
      />
    </>
  );
});

export default ProductsView;
