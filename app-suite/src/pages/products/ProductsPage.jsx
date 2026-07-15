import React, { useState, useMemo, useRef } from 'react';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconSearch, IconPlus, IconEdit, IconDelete, IconSave, IconClose,
  IconEyeOpen, IconBackArrow, IconPackage, IconDollar, IconClock,
  IconMinus,
} from '@/assets/icons';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import CollapsiblePanel from '@/components/CollapsiblePanel/CollapsiblePanel';
import DataTable from '@/components/DataTable/DataTable';
import { InputText, InputNumber, Dropdown } from '@/components/Form';
import PageShell from '@/components/PageShell/PageShell';
import useProducts from '@/hooks/useProducts';
import styles from './ProductsPage.module.css';

const EMPTY_FORM = {
  name: '', sku: '', category: 'Software', description: '',
  costPrice: '', sellingPrice: '', taxRate: '8',
  variants: [],
};

const fmtCurrency = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const ProductsPage = () => {
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [view, setView] = useState('list'); // 'list' | 'detail' | 'form'
  const [currentId, setCurrentId] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

  // ── Form helpers ────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.sku.trim()) errs.sku = 'SKU is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (!form.costPrice || isNaN(Number(form.costPrice)) || Number(form.costPrice) < 0) errs.costPrice = 'Enter a valid cost price';
    if (!form.sellingPrice || isNaN(Number(form.sellingPrice)) || Number(form.sellingPrice) <= 0) errs.sellingPrice = 'Enter a valid selling price';
    if (form.taxRate && (isNaN(Number(form.taxRate)) || Number(form.taxRate) < 0 || Number(form.taxRate) > 100)) errs.taxRate = 'Tax rate must be 0–100';
    return errs;
  };

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
      variants: form.variants || [],
    };

    if (currentId) {
      updateProduct(currentId, productData);
      addToast({ message: `Product \"${productData.name}\" updated`, type: 'success' });
      await addActionToast(`\"${productData.name}\" has been updated`, 'success', 'products');
    } else {
      addProduct(productData);
      addToast({ message: `Product \"${productData.name}\" created`, type: 'success' });
      await addActionToast(`\"${productData.name}\" has been created`, 'success', 'products');
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

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  // ── Toolbar button handlers ─────────────────────────────────────────────
  const handleNew = () => {
    if (view === 'form' && currentId) {
      addToast({ message: 'Changes discarded', type: 'info' });
    }
    startAdd();
  };

  // ── Top toolbar buttons for ButtonGroup ─────────────────────────────────
  const searchInputRef = useRef(null);

  const toolbarButtons = useMemo(() => {
    const isForm = view === 'form';
    const isDetail = view === 'detail';
    return [
      ...(!isForm ? [{
        id: 'new',
        label: 'New',
        icon: <IconPlus />,
        onClick: handleNew,
      }] : []),
      ...(isDetail ? [{
        id: 'edit',
        label: 'Edit',
        icon: <IconEdit />,
        onClick: () => currentId && startEdit(currentId),
      }] : []),
      ...(isDetail ? [{
        id: 'delete',
        label: 'Delete',
        icon: <IconDelete />,
        onClick: () => detailProduct && handleDelete(detailProduct.id, detailProduct.name),
      }] : []),
      ...(isForm ? [{
        id: 'save',
        label: 'Save',
        icon: <IconSave />,
        onClick: handleSubmit,
      }] : []),
      ...(!isForm && !isDetail ? [{
        id: 'search',
        label: 'Search',
        icon: <IconSearch />,
        onClick: () => searchInputRef.current?.focus(),
      }] : []),
      ...(isForm || isDetail ? [{
        id: 'back',
        label: isForm ? 'Cancel' : 'Back',
        icon: <IconBackArrow />,
        onClick: isForm ? resetForm : () => { setView('list'); setDetailProduct(null); },
      }] : []),
    ];
  }, [view, currentId, detailProduct, handleDelete]);

  const handleToolbarAction = (id) => {
    const btn = toolbarButtons.find((b) => b.id === id);
    if (btn?.onClick) btn.onClick();
  };

  // ── Stats ───────────────────────────────────────────────────────────────
  const totalProducts = products.length;
  const avgMargin = products.length > 0
    ? Math.round(products.reduce((s, p) => s + (p.margin || 0), 0) / products.length)
    : 0;
  const totalValue = products.reduce((s, p) => s + p.sellingPrice, 0);

  // ── Render ──────────────────────────────────────────────────────────────
  const isListView = view !== 'form' && view !== 'detail';

  return (
    <PageShell
      title="Products"
      subtitle={`${totalProducts} products · ${avgMargin}% avg. margin`}
      compact
    >
      <PageShell.Actions>
        {isListView && (
          <div className={styles.searchRow}>
            <IconSearch className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
                <IconClose />
              </button>
            )}
          </div>
        )}
        <ButtonGroup
          buttons={toolbarButtons}
          activeId={null}
          onChange={handleToolbarAction}
          size="sm"
          variant="filled"
          ariaLabel="Product actions"
        />
      </PageShell.Actions>

      {isListView && (
        <PageShell.Stats>
          <PageShell.Stat label="Total Products" value={totalProducts} />
          <PageShell.Stat
            label="Avg. Margin"
            value={`${avgMargin}%`}
            variant={avgMargin >= 30 ? 'success' : avgMargin >= 10 ? 'warning' : 'danger'}
          />
          <PageShell.Stat label="Portfolio Value" value={fmtCurrency(totalValue)} variant="accent" />
        </PageShell.Stats>
      )}

      <PageShell.Body>
        {view === 'detail' && detailProduct ? (
          <ProductDetailView
            product={detailProduct}
            onEdit={() => startEdit(detailProduct.id)}
            onDelete={async () => {
              const deleted = await handleDelete(detailProduct.id, detailProduct.name);
              if (deleted) {
                setView('list');
                setDetailProduct(null);
              }
            }}
            onBack={() => { setView('list'); setDetailProduct(null); }}
            fmtCurrency={fmtCurrency}
          />
        ) : view === 'form' ? (
          <div className={styles.formArea}>
            {/* Panel 1: Product Info */}
            <CollapsiblePanel
              title="Product Information"
              icon={<IconPackage />}
              defaultOpen
              size="md"
              className={styles.collapsiblePanel}
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <InputText
                    id="prod-name"
                    label="Product Name"
                    required
                    placeholder="e.g. AI Inference Unit"
                    error={formErrors.name}
                    {...field('name')}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <InputText
                    id="prod-sku"
                    label="SKU"
                    required
                    placeholder="e.g. AIU-005"
                    error={formErrors.sku}
                    {...field('sku')}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <Dropdown
                    id="prod-category"
                    label="Category"
                    required
                    options={[
                      { value: 'Software', label: 'Software' },
                      { value: 'Infrastructure', label: 'Infrastructure' },
                      { value: 'Hardware', label: 'Hardware' },
                      { value: 'AI', label: 'AI' },
                      { value: 'Services', label: 'Services' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    value={form.category}
                    onChange={(val) => setForm((p) => ({ ...p, category: val }))}
                    error={formErrors.category}
                    searchable
                    searchPlaceholder="Search categories…"
                  />
                </div>
                <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                  <label className={styles.label} htmlFor="prod-desc">Description</label>
                  <textarea
                    id="prod-desc"
                    className={styles.textarea}
                    placeholder="Brief product description..."
                    rows={3}
                    {...field('description')}
                  />
                </div>
              </div>
            </CollapsiblePanel>

            {/* Panel 2: Price Info */}
            <CollapsiblePanel
              title="Pricing Information"
              icon={<IconDollar />}
              defaultOpen
              size="md"
              className={styles.collapsiblePanel}
            >
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <InputNumber
                    id="prod-cost"
                    label="Cost Price (USD)"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    error={formErrors.costPrice}
                    {...field('costPrice')}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <InputNumber
                    id="prod-sell"
                    label="Selling Price (USD)"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    error={formErrors.sellingPrice}
                    {...field('sellingPrice')}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <InputNumber
                    id="prod-tax"
                    label="Tax Rate (%)"
                    min="0"
                    max="100"
                    step="0.5"
                    placeholder="0"
                    error={formErrors.taxRate}
                    {...field('taxRate')}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Margin</label>
                  <div className={styles.marginDisplay}>
                    <span className={`${styles.marginValue} ${calculatedMargin >= 30 ? styles.marginGood : calculatedMargin >= 10 ? styles.marginOk : styles.marginBad}`}>
                      {calculatedMargin}%
                    </span>
                    {Number(form.sellingPrice) > 0 && (
                      <span className={styles.marginProfit}>
                        +{fmtCurrency(Number(form.sellingPrice) - Number(form.costPrice || 0))}
                      </span>
                    )}
                  </div>
                </div>
                {Number(form.costPrice) > 0 && Number(form.sellingPrice) > 0 && (
                  <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
                    <div className={styles.priceSummary}>
                      <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Cost</span>
                        <span className={styles.priceCost}>{fmtCurrency(Number(form.costPrice))}</span>
                      </div>
                      <div className={styles.priceArrow}>
                        <span>→</span>
                      </div>
                      <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Sell</span>
                        <span className={styles.priceSell}>{fmtCurrency(Number(form.sellingPrice))}</span>
                      </div>
                      <div className={styles.priceArrow}>
                        <span>→</span>
                      </div>
                      <div className={styles.priceItem}>
                        <span className={styles.priceLabel}>Profit</span>
                        <span className={`${styles.priceProfit} ${calculatedMargin >= 0 ? styles.marginGood : styles.marginBad}`}>
                          {fmtCurrency(Number(form.sellingPrice) - Number(form.costPrice))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CollapsiblePanel>

            {/* Panel 3: Variants */}
            <CollapsiblePanel
              title={`Variants (${form.variants.length})`}
              icon={<IconPackage />}
              defaultOpen={form.variants.length > 0}
              size="md"
              className={styles.collapsiblePanel}
            >
              <VariantManager
                variants={form.variants}
                onChange={(variants) => setForm((p) => ({ ...p, variants }))}
              />
            </CollapsiblePanel>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: 'name',
                label: 'Product',
                sortable: true,
                render: (val, row) => {
                  const vCount = row.variants ? row.variants.length : 0;
                  return (
                    <div className={styles.productCell}>
                      <div className={styles.productIcon}><IconPackage /></div>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{val}</span>
                        <div className={styles.productMeta}>
                          <code className={styles.productSku}>{row.sku}</code>
                          {vCount > 0 && (
                            <span className={styles.variantCountBadge}>{vCount} var.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: 'category',
                label: 'Category',
                sortable: true,
                render: (val) => <span className={styles.categoryBadge}>{val}</span>,
              },
              {
                key: 'costPrice',
                label: 'Cost',
                align: 'right',
                sortable: true,
                render: (val) => <span className={styles.muted}>{fmtCurrency(val)}</span>,
              },
              {
                key: 'sellingPrice',
                label: 'Selling Price',
                align: 'right',
                sortable: true,
                render: (val) => <span className={styles.priceVal}>{fmtCurrency(val)}</span>,
              },
              {
                key: 'margin',
                label: 'Margin',
                align: 'right',
                sortable: true,
                render: (val) => (
                  <span className={`${styles.marginBadge} ${val >= 30 ? styles.marginGood : val >= 10 ? styles.marginOk : styles.marginBad}`}>
                    {val}%
                  </span>
                ),
              },
              {
                key: 'createdAt',
                label: 'Created',
                sortable: true,
                render: (val) => <span className={styles.muted}>{new Date(val).toLocaleDateString()}</span>,
              },
              {
                key: 'actions',
                label: '',
                width: 110,
                render: (_, row) => (
                  <div className={styles.actionsCell}>
                    <button className={styles.viewBtn} onClick={() => startView(row.id)} aria-label="View product details">
                      <IconEyeOpen />
                    </button>
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
                        <span className={styles.spinnerSmall} />
                      ) : (
                        <IconDelete />
                      )}
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredProducts}
            keyField="id"
            sortable
            paginated
            pageSize={15}
            emptyMessage="No products found"
            emptyAction={{ label: 'Add Product', onClick: startAdd }}
            searchable={false}
            exportable
            exportFilename="products"
          />
        )}
      </PageShell.Body>

      {view === 'form' && (
        <PageShell.Footer>
          <button className={styles.saveBtn} onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <span className={styles.spinner} />
            ) : (
              <IconSave />
            )}
            {submitting ? 'Saving...' : (currentId ? 'Update Product' : 'Create Product')}
          </button>
          <button className={styles.cancelBtn} onClick={resetForm}>
            Cancel
          </button>
        </PageShell.Footer>
      )}
    </PageShell>
  );
};

// ── Variant Manager (form view) ───────────────────────────────────────────
const VariantManager = ({ variants, onChange }) => {
  const addVariant = () => {
    const newVar = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      sku: '',
      size: '',
      color: '',
      priceAdjustment: 0,
      stock: 0,
    };
    onChange([...variants, newVar]);
  };

  const removeVariant = (id) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id, field, value) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  if (variants.length === 0) {
    return (
      <div className={styles.variantEmpty}>
        <p className={styles.variantEmptyText}>No variants yet. Add size, color, or SKU options.</p>
        <button className={styles.variantAddBtn} onClick={addVariant}>
          <IconPlus />
          Add Variant
        </button>
      </div>
    );
  }

  return (
    <div className={styles.variantMgr}>
      {variants.map((v, idx) => (
        <div key={v.id} className={styles.variantRow}>
          <div className={styles.variantRowHeader}>
            <span className={styles.variantIndex}>#{idx + 1}</span>
            {v.color && (
              <span className={styles.variantSwatch} style={{ backgroundColor: v.color }} />
            )}
            <span className={styles.variantRowTitle}>{v.name || 'New Variant'}</span>
            <button className={styles.variantRemoveBtn} onClick={() => removeVariant(v.id)} aria-label="Remove variant">
              <IconMinus />
            </button>
          </div>
          <div className={styles.variantFields}>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Variant Name</label>
              <input
                type="text"
                className={styles.variantInput}
                placeholder="e.g. Small, Red, Pro"
                value={v.name}
                onChange={(e) => updateVariant(v.id, 'name', e.target.value)}
              />
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>SKU</label>
              <input
                type="text"
                className={styles.variantInput}
                placeholder="e.g. AIU-005-PRO"
                value={v.sku}
                onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
              />
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Size</label>
              <input
                type="text"
                className={styles.variantInput}
                placeholder="e.g. 2GB, XL, 10cm"
                value={v.size}
                onChange={(e) => updateVariant(v.id, 'size', e.target.value)}
              />
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Color</label>
              <div className={styles.variantColorWrap}>
                <input
                  type="text"
                  className={styles.variantInput}
                  placeholder="#hex or name"
                  value={v.color}
                  onChange={(e) => updateVariant(v.id, 'color', e.target.value)}
                />
                {v.color && (
                  <span className={styles.variantSwatchInput} style={{ backgroundColor: v.color }} />
                )}
              </div>
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Price Adj. ($)</label>
              <input
                type="number"
                className={styles.variantInput}
                placeholder="0"
                value={v.priceAdjustment}
                onChange={(e) => updateVariant(v.id, 'priceAdjustment', Number(e.target.value))}
              />
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Stock</label>
              <input
                type="number"
                className={styles.variantInput}
                placeholder="0"
                min="0"
                value={v.stock}
                onChange={(e) => updateVariant(v.id, 'stock', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}
      <button className={`${styles.variantAddBtn} ${styles.variantAddBtnFull}`} onClick={addVariant}>
        <IconPlus />
        Add Another Variant
      </button>
    </div>
  );
};

// ── Product Detail View (read-only) ───────────────────────────────────────
const ProductDetailView = ({ product, onEdit, onDelete, onBack, fmtCurrency }) => {
  const margin = product.margin || 0;
  const marginClass = margin >= 30 ? styles.marginGood : margin >= 10 ? styles.marginOk : styles.marginBad;
  const profit = Number(product.sellingPrice) - Number(product.costPrice || 0);

  return (
    <div className={styles.detailArea}>
      {/* Header card */}
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderIcon}>
          <IconPackage />
        </div>
        <div className={styles.detailHeaderInfo}>
          <h2 className={styles.detailTitle}>{product.name}</h2>
          <div className={styles.detailMeta}>
            <span className={styles.categoryBadge}>{product.category}</span>
            <code className={styles.productSku}>{product.sku}</code>
          </div>
        </div>
      </div>

      {/* Product Info Panel */}
      <CollapsiblePanel title="Product Information" icon={<IconPackage />} defaultOpen size="md" className={styles.collapsiblePanel}>
        <div className={styles.detailGrid}>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Product Name</span>
            <span className={styles.detailValue}>{product.name}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>SKU</span>
            <code className={styles.detailValueMono}>{product.sku}</code>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Category</span>
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>
          {product.description && (
            <div className={`${styles.detailField} ${styles.fieldFull}`}>
              <span className={styles.detailLabel}>Description</span>
              <span className={styles.detailValue}>{product.description}</span>
            </div>
          )}
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Created</span>
            <span className={styles.detailValue}>
              <IconClock className={styles.detailIconInline} />
              {new Date(product.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </CollapsiblePanel>

      {/* Pricing Panel */}
      <CollapsiblePanel title="Pricing Information" icon={<IconDollar />} defaultOpen size="md" className={styles.collapsiblePanel}>
        <div className={styles.detailGrid}>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Cost Price</span>
            <span className={styles.detailValueMuted}>{fmtCurrency(Number(product.costPrice))}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Selling Price</span>
            <span className={styles.detailValue}>{fmtCurrency(Number(product.sellingPrice))}</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Tax Rate</span>
            <span className={styles.detailValue}>{product.taxRate || 0}%</span>
          </div>
          <div className={styles.detailField}>
            <span className={styles.detailLabel}>Margin</span>
            <span className={`${styles.detailMargin} ${marginClass}`}>{margin}%</span>
          </div>
          {Number(product.costPrice) > 0 && Number(product.sellingPrice) > 0 && (
            <div className={`${styles.detailField} ${styles.fieldFull}`}>
              <div className={styles.priceSummary}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Cost</span>
                  <span className={styles.priceCost}>{fmtCurrency(Number(product.costPrice))}</span>
                </div>
                <div className={styles.priceArrow}><span>→</span></div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Sell</span>
                  <span className={styles.priceSell}>{fmtCurrency(Number(product.sellingPrice))}</span>
                </div>
                <div className={styles.priceArrow}><span>→</span></div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Profit</span>
                  <span className={`${styles.priceProfit} ${profit >= 0 ? styles.marginGood : styles.marginBad}`}>
                    {fmtCurrency(profit)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsiblePanel>

      {/* Variants Panel */}
      {product.variants && product.variants.length > 0 && (
        <CollapsiblePanel title={`Variants (${product.variants.length})`} icon={<IconPackage />} defaultOpen size="md" className={styles.collapsiblePanel}>
          <div className={styles.variantsDetailTable}>
            <div className={styles.variantsDetailHeader}>
              <span className={styles.variantsDetailTh}>#</span>
              <span className={styles.variantsDetailTh}>Name</span>
              <span className={styles.variantsDetailTh}>SKU</span>
              <span className={styles.variantsDetailTh}>Size</span>
              <span className={styles.variantsDetailTh}>Color</span>
              <span className={styles.variantsDetailTh}>Price Adj.</span>
              <span className={styles.variantsDetailTh}>Stock</span>
            </div>
            {product.variants.map((v, idx) => (
              <div key={v.id} className={styles.variantsDetailRow}>
                <span className={styles.variantsDetailTd}>{idx + 1}</span>
                <span className={styles.variantsDetailTd}><span className={styles.variantName}>{v.name}</span></span>
                <span className={styles.variantsDetailTd}><code className={styles.variantSku}>{v.sku}</code></span>
                <span className={styles.variantsDetailTd}>{v.size || '—'}</span>
                <span className={styles.variantsDetailTd}>
                  {v.color ? (
                    <><span className={styles.variantSwatchDetail} style={{ backgroundColor: v.color }} />{v.color}</>
                  ) : '—'}
                </span>
                <span className={styles.variantsDetailTd}>
                  {v.priceAdjustment !== 0 ? (
                    <span className={`${styles.variantPriceAdj} ${v.priceAdjustment > 0 ? styles.variantPriceUp : styles.variantPriceDown}`}>
                      {v.priceAdjustment > 0 ? '+' : ''}{fmtCurrency(v.priceAdjustment)}
                    </span>
                  ) : '—'}
                </span>
                <span className={styles.variantsDetailTd}>
                  <span className={`${styles.variantStock} ${v.stock <= 0 ? styles.variantStockNone : v.stock < 10 ? styles.variantStockLow : ''}`}>
                    {v.stock}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </CollapsiblePanel>
      )}

      {/* Action bar */}
      <div className={styles.detailActions}>
        <button className={styles.detailEditBtn} onClick={onEdit}>
          <IconEdit />
          Edit Product
        </button>
        <button className={styles.detailDeleteBtn} onClick={onDelete}>
          <IconDelete />
          Delete
        </button>
        <button className={styles.detailBackBtn} onClick={onBack}>
          <IconBackArrow />
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
