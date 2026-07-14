import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
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
  return (
    <div className={styles.container}>
      {view === 'list' ? (
        <>
          {/* ── Toolbar ────────────────────────────────────────────────── */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <h2 className={styles.title}>Inventory</h2>
            </div>
            <div className={styles.toolbarControls}>
              <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.addIcon}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Product
              </button>
            </div>
          </div>

          {/* ── Stats bar ──────────────────────────────────────────────── */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{items.length}</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalItems.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Stock</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{fmtCurrency(totalValue)}</span>
              <span className={styles.statLabel}>Inventory Value</span>
            </div>
            <div className={`${styles.statItem} ${lowStockCount > 0 ? styles.statWarning : ''}`}>
              <span className={styles.statValue}>{lowStockCount}</span>
              <span className={styles.statLabel}>Low Stock Items</span>
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────────── */}
          <div className={styles.content}>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
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
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
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
          </div>
        </>
      ) : (
        /* ── Form ─────────────────────────────────────────────────────── */
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{view === 'add' ? 'Add Product' : 'Edit Product'}</h2>
            <button className={styles.backBtn} onClick={cancelForm}>Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
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

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? (
                  <span className={styles.spinner} />
                ) : (
                  view === 'add' ? 'Add Product' : 'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
