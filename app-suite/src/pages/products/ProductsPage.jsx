import { useState, useMemo, useEffect, useRef, useCallback } from 'react';

import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconPlus, IconEdit, IconDelete, IconSave, IconSearch, IconBackArrow, IconClose } from '@/assets/icons';
import PageShell from '@/components/PageShell/PageShell';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import useProducts from '@/hooks/useProducts';
import { validateModel, getFormDefaults } from '@/utils/modelValidator';
import { fmtCurrency } from '@/utils/dataFormat';
import productModel from '@/models/products.json';
import variantModel from '@/models/product-variant.json';
import ProductsListView from './ProductsListView';
import ProductsEntryView from './ProductsEntryView';
import ProductsDetailsView from './ProductsDetailsView';
import './ProductsPage.css';
const EMPTY_FORM = getFormDefaults(productModel);
const MODELS = { 'product-variant': variantModel };

const ProductsPage = () => {
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [view, setView] = useState('list'); // 'list' | 'detail' | 'form'
  const [currentId, setCurrentId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Initial loading simulation ──────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const calculatedMargin = useMemo(() => {
    const cost = Number(form.costPrice);
    const sell = Number(form.sellingPrice);
    if (cost > 0 && sell > 0 && sell > cost) {
      return Math.round(((sell - cost) / sell) * 100);
    }
    if (cost > 0 && sell > 0 && sell < cost) {
      return -Math.round(((cost - sell) / sell) * 100);
    }
    return 0;
  }, [form.costPrice, form.sellingPrice]);

  // ── Stats ───────────────────────────────────────────────────────────────
  const totalProducts = products.length;
  const avgMargin = products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.margin || 0), 0) / products.length)
    : 0;
  const totalValue = products.reduce((s, p) => s + p.sellingPrice, 0);

  const stats = useMemo(() => [
    { label: 'Total Products', value: totalProducts },
    { label: 'Avg. Margin', value: `${avgMargin}%`, variant: avgMargin >= 30 ? 'success' : avgMargin >= 10 ? 'warning' : 'danger' },
    { label: 'Portfolio Value', value: fmtCurrency(totalValue), variant: 'accent' },
  ], [totalProducts, avgMargin, totalValue]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const validateForm = () => validateModel(form, productModel, { models: MODELS });

  const handleSubmit = async () => {
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const productData = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      costPrice: form.costPrice,
      sellingPrice: form.sellingPrice,
      taxRate: form.taxRate || '0',
      isActive: form.isActive,
      releaseDate: form.releaseDate || '',
      variants: form.variants || [],
    };

    if (currentId) {
      updateProduct(currentId, productData);
      addToast({ message: `Product "${productData.name}" updated`, type: 'success' });
      await addActionToast(`"${productData.name}" has been updated`, 'success', 'products');
    } else {
      addProduct(productData);
      addToast({ message: `Product "${productData.name}" created`, type: 'success' });
      await addActionToast(`"${productData.name}" has been created`, 'success', 'products');
    }

    setSubmitting(false);
    resetForm();
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setCurrentId(null);
    setView('list');
  };

  const startAdd = () => {
    if (view === 'form' && currentId) {
      addToast({ message: 'Changes discarded', type: 'info' });
    }
    setForm(EMPTY_FORM);
    setFormErrors({});
    setCurrentId(null);
    setView('form');
  };

  const startView = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setDetailProduct(product);
    setCurrentId(id);
    setView('detail');
  };

  const startEdit = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description || '',
      costPrice: String(product.costPrice),
      sellingPrice: String(product.sellingPrice),
      taxRate: String(product.taxRate || 0),
      isActive: product.isActive !== undefined ? product.isActive : true,
      releaseDate: product.releaseDate || '',
      variants: product.variants ? product.variants.map((v) => ({ ...v })) : [],
    });
    setFormErrors({});
    setCurrentId(id);
    setView('form');
  };

  const handleDelete = async (id, name) => {
    return await confirmWithAction(
      'Delete Product',
      `Are you sure you want to permanently remove "${name}"?`,
      async () => {
        setDeletingId(id);
        await new Promise((r) => setTimeout(r, 500));
        deleteProduct(id);
        setDeletingId(null);
        await addActionToast(`"${name}" has been removed from products`, 'info', 'products');
      },
      { confirmLabel: 'Delete', cancelLabel: 'Keep', danger: true, windowId: 'products' }
    );
  };

  const handleBackFromDetail = () => {
    setView('list');
    setDetailProduct(null);
  };

  const handleDeleteFromDetail = async () => {
    const deleted = await handleDelete(detailProduct.id, detailProduct.name);
    if (deleted) {
      setView('list');
      setDetailProduct(null);
    }
  };

  // ── Toolbar buttons ─────────────────────────────────────────────────────
  const toolbarButtons = useMemo(() => [
    { id: 'new', label: 'New', icon: <IconPlus />, onClick: startAdd, views: ['list'] },
    { id: 'edit', label: 'Edit', icon: <IconEdit />, views: ['detail'],
      onClick: () => currentId && startEdit(currentId) },
    { id: 'delete', label: 'Delete', icon: <IconDelete />, views: ['detail'],
      onClick: () => detailProduct && handleDelete(detailProduct.id, detailProduct.name) },
    { id: 'save', label: 'Save', icon: <IconSave />, onClick: handleSubmit, views: ['form'] },
    { id: 'search', label: 'Search', icon: <IconSearch />, views: ['list'] },
    { id: 'back', label: 'Cancel', icon: <IconBackArrow />,
      onClick: view === 'form' ? resetForm : handleBackFromDetail, views: ['form', 'detail'] },
  ], [view, currentId, detailProduct, handleDelete]);

  const searchRef = useRef(null);

  const visibleButtons = useMemo(() => {
    return toolbarButtons.filter((btn) => {
      if (!btn.views) return true;
      return btn.views.includes(view);
    }).map((btn) => {
      if (btn.id === 'search') {
        return { ...btn, onClick: () => searchRef.current?.focus() };
      }
      return btn;
    });
  }, [toolbarButtons, view]);

  const handleToolbarAction = useCallback((id) => {
    const btn = visibleButtons.find((b) => b.id === id);
    if (btn?.onClick) btn.onClick();
  }, [visibleButtons]);

  const isListView = view === 'list';
  const isFormView = view === 'form';

  return (
    <PageShell
      title="Products"
      subtitle={`${totalProducts} products · ${avgMargin}% avg. margin`}
      compact
    >
      {/* ── Actions: Search + Toolbar ────────────────────────────────── */}
      <PageShell.Actions>
        {isListView && (
          <div className="searchRow">
            <IconSearch className="searchIcon" />
            <input
              ref={searchRef}
              type="text"
              className="searchInput"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="searchClear" onClick={() => setSearchQuery('')}>
                <IconClose />
              </button>
            )}
          </div>
        )}
        {visibleButtons.length > 0 && (
          <ButtonGroup
            buttons={visibleButtons}
            activeId={null}
            onChange={handleToolbarAction}
            size="sm"
            variant="filled"
            ariaLabel="Products actions"
          />
        )}
      </PageShell.Actions>

      {/* ── Stats (list view only) ───────────────────────────────────── */}
      {isListView && stats.length > 0 && (
        <PageShell.Stats>
          {stats.map((stat, idx) => (
            <PageShell.Stat
              key={idx}
              label={stat.label}
              value={stat.value}
              variant={stat.variant}
            />
          ))}
        </PageShell.Stats>
      )}

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <PageShell.Body>
        {view === 'detail' && detailProduct ? (
          <ProductsDetailsView
            loading={loading}
            product={detailProduct}
            onEdit={() => startEdit(detailProduct.id)}
            onDelete={handleDeleteFromDetail}
            onBack={handleBackFromDetail}
          />
        ) : view === 'form' ? (
          <ProductsEntryView
            form={form}
            setForm={setForm}
            formErrors={formErrors}
            calculatedMargin={calculatedMargin}
          />
        ) : (
          <ProductsListView
            loading={loading}
            products={filteredProducts}
            onAdd={startAdd}
            onView={startView}
            onEdit={startEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            totalProducts={totalProducts}
            avgMargin={avgMargin}
            totalValue={totalValue}
          />
        )}
      </PageShell.Body>

      {/* ── Footer (form view only) ──────────────────────────────────── */}
      {isFormView && (
        <PageShell.Footer>
          <button className="saveBtn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <span className="spinner" />
            ) : (
              <IconSave />
            )}
            {currentId ? 'Update Product' : 'Create Product'}
          </button>
          <button className="cancelBtn" onClick={resetForm}>
            Cancel
          </button>
        </PageShell.Footer>
      )}
    </PageShell>
  );
};

export default ProductsPage;
