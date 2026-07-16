import React from "react";
import { fmtCurrency } from "@/utils/dataFormat";
import CollapsiblePanel from "@/components/CollapsiblePanel/CollapsiblePanel";
import {
  InputText,
  InputNumber,
  TextArea,
  Dropdown,
  Checkbox,
  TextInput,
} from "@/components/Form";
import { getFormDefaults } from "@/utils/modelValidator";
import variantModel from "@/models/product-variant.json";
import { IconPackage, IconDollar, IconPlus, IconMinus } from "@/assets/icons";
import styles from "./ProductsPage.module.css";

// ── Variant Manager ───────────────────────────────────────────────────────
const VariantManager = ({ variants, onChange, variantModel }) => {
  const addVariant = () => {
    const newVar = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...getFormDefaults(variantModel),
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
        <p className={styles.variantEmptyText}>
          No variants yet. Add size, color, or SKU options.
        </p>
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
              <span
                className={styles.variantSwatch}
                style={{ backgroundColor: v.color }}
              />
            )}
            <span className={styles.variantRowTitle}>
              {v.name || "New Variant"}
            </span>
            <button
              className={styles.variantRemoveBtn}
              onClick={() => removeVariant(v.id)}
              aria-label="Remove variant"
            >
              <IconMinus />
            </button>
          </div>
          <div className={styles.variantFields}>
            <div className={styles.variantField}>
              <InputText
                label="Variant Name"
                placeholder="e.g. Small, Red, Pro"
                value={v.name}
                onChange={(val) => updateVariant(v.id, "name", val)}
              />
            </div>
            <div className={styles.variantField}>
              <InputText
                label="SKU"
                placeholder="e.g. AIU-005-PRO"
                value={v.sku}
                onChange={(val) => updateVariant(v.id, "sku", val)}
              />
            </div>
            <div className={styles.variantField}>
              <InputText
                label="Size"
                placeholder="e.g. 2GB, XL, 10cm"
                value={v.size}
                onChange={(val) => updateVariant(v.id, "size", val)}
              />
            </div>
            <div className={styles.variantField}>
              <label className={styles.variantLabel}>Color</label>
              <div className={styles.variantColorWrap}>
                <InputText
                  placeholder="#hex or name"
                  value={v.color}
                  onChange={(val) => updateVariant(v.id, "color", val)}
                />
                {v.color && (
                  <span
                    className={styles.variantSwatchInput}
                    style={{ backgroundColor: v.color }}
                  />
                )}
              </div>
            </div>
            <div className={styles.variantField}>
              <InputNumber
                label="Price Adj. ($)"
                placeholder="0"
                value={v.priceAdjustment}
                onChange={(val) =>
                  updateVariant(v.id, "priceAdjustment", Number(val))
                }
              />
            </div>
            <div className={styles.variantField}>
              <InputNumber
                label="Stock"
                placeholder="0"
                min={0}
                value={v.stock}
                onChange={(val) => updateVariant(v.id, "stock", Number(val))}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        className={`${styles.variantAddBtn} ${styles.variantAddBtnFull}`}
        onClick={addVariant}
      >
        <IconPlus />
        Add Another Variant
      </button>
    </div>
  );
};

// ── Products Entry View (Form) ────────────────────────────────────────────
const ProductsEntryView = ({ form, setForm, formErrors, calculatedMargin }) => {
  const field = (name) => ({
    value: form[name],
    onChange: (val) => setForm((p) => ({ ...p, [name]: val })),
  });

  const [name, setName] = React.useState("");

  const handleChange = (value) => {
    console.log("Hello World", value);
    setName(value);
  };

  return (
    <div className={styles.formArea}>
      {/* Panel 1: Product Info */}
      <CollapsiblePanel
        title="Product Information"
        icon={<IconPackage />}
        defaultOpen
        size="md"
        className={styles.collapsiblePanel}
      >
        <div className="grid">
          <div className="col-2">
            <TextInput
              id="text-input"
              value={name}
              required={true}
              disabled={false}
              onChange={handleChange}
              label="text-input-label"
              error="tes"
              placeholder="Enter text input"
            />
          </div>
          <div className="col-3">
            <TextInput
              id="text-input"
              value={name}
              required={true}
              disabled={false}
              onChange={handleChange}
              label="text-input-label"
              error="tes"
              placeholder="Enter text input"
            />
          </div>
          <div className="col-3">
            <TextInput
              id="text-input"
              value={name}
              required={true}
              disabled={false}
              onChange={handleChange}
              label="text-input-label"
              error="tes"
              placeholder="Enter text input"
            />
          </div>
          <div className="col-3">
            <TextInput
              id="text-input"
              value={name}
              required={true}
              disabled={false}
              onChange={handleChange}
              label="text-input-label"
              error="tes"
              placeholder="Enter text input"
            />
          </div>
          <div className="col-1">
            <TextInput
              id="text-input"
              value={name}
              required={true}
              disabled={false}
              onChange={handleChange}
              label="text-input-label"
              error="tes"
              placeholder="Enter text input"
            />
          </div>
        </div>

        <div className={styles.formGrid}>
          {/* Row 1: Name (wide) + SKU (narrow) */}
          <div className={`${styles.fieldGroup} ${styles.fieldSpan3}`}>
            <InputText
              id="prod-name"
              label="Product Name"
              required
              placeholder="e.g. AI Inference Unit"
              error={formErrors.name}
              {...field("name")}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <InputText
              id="prod-sku"
              label="SKU"
              required
              placeholder="e.g. AIU-005"
              error={formErrors.sku}
              {...field("sku")}
            />
          </div>

          {/* Row 2: Category + Release Date + Active */}
          <div className={`${styles.fieldGroup} ${styles.fieldSpan2}`}>
            <Dropdown
              id="prod-category"
              label="Category"
              required
              options={[
                { value: "Software", label: "Software" },
                { value: "Infrastructure", label: "Infrastructure" },
                { value: "Hardware", label: "Hardware" },
                { value: "AI", label: "AI" },
                { value: "Services", label: "Services" },
                { value: "Other", label: "Other" },
              ]}
              value={form.category}
              onChange={(val) => setForm((p) => ({ ...p, category: val }))}
              error={formErrors.category}
              searchable
              searchPlaceholder="Search categories…"
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <InputText
              id="prod-release"
              label="Release Date"
              type="date"
              value={form.releaseDate || ""}
              onChange={(val) => setForm((p) => ({ ...p, releaseDate: val }))}
              error={formErrors.releaseDate}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <Checkbox
              id="prod-active"
              label="Active"
              checked={!!form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
            />
            {formErrors.isActive && (
              <span className={styles.fieldError}>{formErrors.isActive}</span>
            )}
          </div>

          {/* Row 3: Description (full width) */}
          <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
            <TextArea
              id="prod-desc"
              label="Description"
              placeholder="Brief product description..."
              rows={3}
              value={form.description || ""}
              onChange={(val) => setForm((p) => ({ ...p, description: val }))}
              error={formErrors.description}
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
          {/* Row 1: Cost Price + Selling Price + Tax Rate + Margin */}
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <InputNumber
              id="prod-cost"
              label="Cost Price (USD)"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              error={formErrors.costPrice}
              {...field("costPrice")}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <InputNumber
              id="prod-sell"
              label="Selling Price (USD)"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              error={formErrors.sellingPrice}
              {...field("sellingPrice")}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <InputNumber
              id="prod-tax"
              label="Tax Rate (%)"
              min="0"
              max="100"
              step="0.5"
              placeholder="0"
              error={formErrors.taxRate}
              {...field("taxRate")}
            />
          </div>
          <div className={`${styles.fieldGroup} ${styles.fieldSpan1}`}>
            <label className={styles.label}>Margin</label>
            <div className={styles.marginDisplay}>
              <span
                className={`${styles.marginValue} ${calculatedMargin >= 30 ? styles.marginGood : calculatedMargin >= 10 ? styles.marginOk : styles.marginBad}`}
              >
                {calculatedMargin}%
              </span>
              {Number(form.sellingPrice) > 0 && (
                <span className={styles.marginProfit}>
                  +
                  {fmtCurrency(
                    Number(form.sellingPrice) - Number(form.costPrice || 0),
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Price Summary (full width, conditional) */}
          {Number(form.costPrice) > 0 && Number(form.sellingPrice) > 0 && (
            <div className={`${styles.fieldGroup} ${styles.fieldFull}`}>
              <div className={styles.priceSummary}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Cost</span>
                  <span className={styles.priceCost}>
                    {fmtCurrency(Number(form.costPrice))}
                  </span>
                </div>
                <div className={styles.priceArrow}>
                  <span>→</span>
                </div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Sell</span>
                  <span className={styles.priceSell}>
                    {fmtCurrency(Number(form.sellingPrice))}
                  </span>
                </div>
                <div className={styles.priceArrow}>
                  <span>→</span>
                </div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Profit</span>
                  <span
                    className={`${styles.priceProfit} ${calculatedMargin >= 0 ? styles.marginGood : styles.marginBad}`}
                  >
                    {fmtCurrency(
                      Number(form.sellingPrice) - Number(form.costPrice),
                    )}
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
          variantModel={variantModel}
        />
      </CollapsiblePanel>
    </div>
  );
};

export default ProductsEntryView;
