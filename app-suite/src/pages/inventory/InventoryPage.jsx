import React, { useState } from 'react';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconSearch, IconPlus, IconEdit, IconDelete } from '@/assets/icons';
import PageShell from '@/components/PageShell/PageShell';
import useInventory from '../../hooks/useInventory';
import DataTable from '../../components/DataTable/DataTable';
import styles from './InventoryPage.module.css';

const EMPTY_FORM = { name: '', sku: '', category: '', stock: '', price: '' };

// ── Helpers ────────────────────────────────────────────────────────────────
const fmtCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

// ── Inventory App ──────────────────────────────────────────────────────────
const InventoryPage = () => {
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();
  const { items, addItem, updateItem, deleteItem } = useInventory();

  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  // ── Form state ──────────────────────────────────────────────────────────
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = ['All', ...new Set(items.map((i) => i.category))];

  // ── Derived data ────────────────────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = items.filter((i) => i.stock < 20).length;
  const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);
  const totalItems = items.reduce((sum, i) => sum + i.stock, 0);

  // ── Actions ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = 'Enter a valid stock quantity';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Enter a valid price';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const itemData = {
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      category: form.category.trim(),
      stock: Number(form.stock),
      price: Number(form.price),
    };

    if (view === 'add') {
      addItem(itemData);
      addToast({ message: `Product "${itemData.name}" added to inventory`, type: 'success' });
      await addActionToast(`"${itemData.name}" has been added to inventory`, 'success', 'inventory');
    } else {
      updateItem(currentId, itemData);
      addToast({ message: `Product "${itemData.name}" updated`, type: 'success' });
      await addActionToast(`"${itemData.name}" has been updated`, 'success', 'inventory');
    }

    setSubmitting(false);
    setView('list');
    setCurrentId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setView('add');
  };

  const startEdit = (id) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      stock: String(item.stock),
      price: String(item.price),
    });
    setFormErrors({});
    setCurrentId(id);
    setView('edit');
  };

  const handleDelete = async (id, name) => {
    await confirmWithAction(
      'Delete Product',
      `Are you sure you want to permanently remove "${name}" from inventory?`,
      async () => {
        setDeletingId(id);
        await new Promise((r) => setTimeout(r, 500));
        deleteItem(id);
        setDeletingId(null);
        await addActionToast(`"${name}" has been removed from inventory`, 'info', 'inventory');
      },
      { confirmLabel: 'Delete', cancelLabel: 'Keep', danger: true, windowId: 'inventory' }
    );
  };

  const cancelForm = () => {
    setView('list');
    setCurrentId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  const stockColor = (stock) => {
    if (stock === 0) return styles.stockNone;
    if (stock < 10) return styles.stockCritical;
    if (stock < 20) return styles.stockLow;
    return styles.stockOk;
  };

  // ── Render ──────────────────────────────────────────────────────────────
  const isListView = view === 'list';

  return (
    <PageShell
      title={isListView ? 'Inventory' : (view === 'add' ? 'Add Product' : 'Edit Product')}
      subtitle={isListView ? `${items.length} products · ${totalItems.toLocaleString()} units in stock` : undefined}
      compact
    >
      <PageShell.Actions>
        {isListView ? (
          <>
            <div className={styles.searchWrapper}>
              <IconSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search product or SKU…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className={styles.addBtn} onClick={startAdd}>
              <IconPlus className={styles.addIcon} />
              Add Product
            </button>
          </>
        ) : (
          <button className={styles.backBtn} onClick={cancelForm}>
            Cancel
          </button>
        )}
      </PageShell.Actions>

      {isListView && (
        <PageShell.Stats>
          <PageShell.Stat label="Products" value={items.length} />
          <PageShell.Stat label="Total Stock" value={totalItems.toLocaleString()} />
          <PageShell.Stat label="Inventory Value" value={fmtCurrency(totalValue)} />
          <PageShell.Stat
            label="Low Stock Items"
            value={lowStockCount}
            variant={lowStockCount > 0 ? 'warning' : undefined}
          />
        </PageShell.Stats>
      )}

      <PageShell.Body>
        {isListView ? (
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Product',
                sortable: true,
                render: (val) => <span className={styles.productName}>{val}</span>,
              },
              {
                key: 'sku',
                label: 'SKU',
                sortable: true,
                render: (val) => <code className={styles.sku}>{val}</code>,
              },
              {
                key: 'category',
                label: 'Category',
                sortable: true,
                render: (val) => <span className={styles.categoryBadge}>{val}</span>,
              },
              {
                key: 'stock',
                label: 'In Stock',
                align: 'right',
                sortable: true,
                render: (val, row) => (
                  <span className={`${styles.stockBadge} ${stockColor(val)}`}>{val}</span>
                ),
              },
              {
                key: 'price',
                label: 'Unit Price',
                align: 'right',
                sortable: true,
                render: (val) => fmtCurrency(val),
              },
              {
                key: '',
                label: 'Total Value',
                align: 'right',
                render: (_, row) => <span className={styles.totalVal}>{fmtCurrency(row.stock * row.price)}</span>,
              },
              {
                key: 'createdAt',
                label: 'Added',
                sortable: true,
                render: (val) => <span className={styles.muted}>{fmtDate(val)}</span>,
              },
              {
                key: 'actions',
                label: '',
                width: 80,
                render: (_, row) => (
                  <div className={styles.actionsCell}>
                    <button className={styles.editBtn} onClick={() => startEdit(row.id)} aria-label="Edit product">
                      <IconEdit />
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(row.id, row.name)}
                      disabled={deletingId === row.id}
                      aria-label="Delete product"
                    >
                      {deletingId === row.id ? (
                        <span className={styles.deleteSpinner} />
                      ) : (
                        <IconDelete />
                      )}
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredItems}
            keyField="id"
            sortable
            paginated
            pageSize={15}
            emptyMessage="No products found"
            emptyAction={{ label: 'Add Product', onClick: startAdd }}
          />
        ) : (
          <form onSubmit={handleSubmit} id="inv-form" className={styles.form}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="inv-name">Product Name *</label>
                <input id="inv-name" type="text" className={styles.input} placeholder="e.g. AI Inference Unit" {...field('name')} />
                {formErrors.name && <span className={styles.fieldError}>{formErrors.name}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="inv-sku">SKU *</label>
                <input id="inv-sku" type="text" className={styles.input} placeholder="e.g. AIU-005" {...field('sku')} />
                {formErrors.sku && <span className={styles.fieldError}>{formErrors.sku}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="inv-category">Category *</label>
                <input id="inv-category" type="text" className={styles.input} placeholder="e.g. Hardware, Software" {...field('category')} />
                {formErrors.category && <span className={styles.fieldError}>{formErrors.category}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="inv-stock">Stock Quantity *</label>
                <input id="inv-stock" type="number" min="0" className={styles.input} placeholder="0" {...field('stock')} />
                {formErrors.stock && <span className={styles.fieldError}>{formErrors.stock}</span>}
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="inv-price">Unit Price (USD) *</label>
                <input id="inv-price" type="number" min="0.01" step="0.01" className={styles.input} placeholder="0.00" {...field('price')} />
                {formErrors.price && <span className={styles.fieldError}>{formErrors.price}</span>}
              </div>
            </div>

            {Number(form.stock) > 0 && Number(form.price) > 0 && (
              <div className={styles.preview}>
                <span className={styles.previewLabel}>Estimated Value</span>
                <span className={styles.previewValue}>{fmtCurrency(Number(form.stock) * Number(form.price))}</span>
              </div>
            )}
          </form>
        )}
      </PageShell.Body>

      {!isListView && (
        <PageShell.Footer>
          <button type="submit" form="inv-form" className={styles.submitBtn} disabled={submitting}>
            {submitting ? (
              <span className={styles.spinner} />
            ) : (
              view === 'add' ? 'Add Product' : 'Save Changes'
            )}
          </button>
        </PageShell.Footer>
      )}
    </PageShell>
  );
};

export default InventoryPage;
