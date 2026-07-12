import { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useSlidePanel } from '../../components/ui/SlidePanel';
import PanelDetail from '../../components/ui/PanelDetail';
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
          renderExpanded={(row) => (
            <div className="expanded-fields">
              {productPanelFields.map(f => (
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
          data={products}
          renderCard={(p) => renderProductCard(p, handleEdit, handleDelete)}
          searchable
          searchPlaceholder="Search products..."
          columns={3}
          emptyMessage="No products found"
          onCardClick={openProductPanel}
        />
      )}

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
