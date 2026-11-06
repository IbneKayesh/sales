import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import GroupButton from "@/components/GroupButton";
import AccordionCard, { AccordionBody } from "@/components/AccordionCard";
import { DataCardGrid, DataCard } from "@/components/DataCard";
import StatListItem from "@/components/StatListItem";
import { IconClose, IconSave, IconPlus, IconDelete } from "@/icons";

// --------------------------------------------------
// Group-Wise Cost Section Component
// --------------------------------------------------

const GroupCostSection = ({
  stageKey,
  stageType,
  title,
  bnTitle,
  description,
  items = [],
  onAdd,
  onRemove,
  onUpdateField,
  stageTotal,
  stageUnitCost,
  money,
  costInputMode,
  salesQty,
  unitPurchaseCost,
  sellingPrice,
  resolveCost,
  readOnly,
}) => {
  return (
    <div
      className="col-span-12"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-2)",
        marginTop: "var(--sp-3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "var(--sp-1)" }}>
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: "var(--fs-sm)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--text-primary)",
            }}
          >
            {title} {bnTitle && <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-xs)" }}>— {bnTitle}</span>}
          </h4>
          <p style={{ margin: "var(--sp-1) 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
            {description}
          </p>
        </div>
        <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
          Mode: <strong style={{ color: "var(--text-primary)" }}>{costInputMode === "per_unit" ? "Per Unit Wise" : "Total Target Qty"}</strong> ({items.length} item{items.length !== 1 ? "s" : ""})
        </div>
      </div>

      {items.map((item, index) => {
        const isPercent = item.type === "percent";
        const resolved = resolveCost(item, {
          costInputMode,
          salesQty,
          unitPurchaseCost,
          sellingPrice,
          stageType,
        });

        return (
          <div
            key={item.id}
            className="grid"
            style={{
              alignItems: "flex-end",
              padding: "var(--sp-2) var(--sp-3)",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              marginBottom: "var(--sp-1)",
            }}
          >
            {/* 1. Cost Name */}
            <div className="col-span-4">
              <InputText
                label={`Cost Head ${index + 1}`}
                placeholder="e.g. Transport, Toll, Commission..."
                value={item.name}
                onChange={(e) => onUpdateField(stageKey, item.id, "name", e.target.value)}
                disabled={readOnly}
              />
            </div>

            {/* 2. Type Selector (৳ Value vs % Rate) */}
            <div className="col-span-2">
              <label
                className="input-text__label"
                style={{ marginBottom: "var(--sp-1)", display: "block", fontSize: "var(--fs-xs)" }}
              >
                Cost Type
              </label>
              <div
                style={{
                  display: "inline-flex",
                  width: "100%",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  height: "32px",
                }}
              >
                <button
                  type="button"
                  onClick={() => onUpdateField(stageKey, item.id, "type", "value")}
                  disabled={readOnly}
                  style={{
                    flex: 1,
                    border: "none",
                    background: !isPercent ? "var(--primary)" : "var(--surface)",
                    color: !isPercent ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: !isPercent ? "var(--fw-bold)" : "normal",
                    fontSize: "var(--fs-xs)",
                    cursor: readOnly ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  title="Fixed monetary amount in ৳"
                >
                  ৳ Value
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField(stageKey, item.id, "type", "percent")}
                  disabled={readOnly}
                  style={{
                    flex: 1,
                    border: "none",
                    background: isPercent ? "var(--primary)" : "var(--surface)",
                    color: isPercent ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: isPercent ? "var(--fw-bold)" : "normal",
                    fontSize: "var(--fs-xs)",
                    cursor: readOnly ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                  title="Percentage rate (%)"
                >
                  % Rate
                </button>
              </div>
            </div>

            {/* 3. Input Amount / Rate */}
            <div className="col-span-2">
              <InputNumber
                label={
                  isPercent
                    ? "Rate (%)"
                    : costInputMode === "per_unit"
                      ? "Amount / Unit (৳)"
                      : "Total Amount (৳)"
                }
                placeholder={isPercent ? "0.0%" : "0.00"}
                value={item.amount}
                onChange={(e) => onUpdateField(stageKey, item.id, "amount", e.target.value)}
                min={0}
                step={isPercent ? 0.05 : 0.01}
                disabled={readOnly}
              />
            </div>

            {/* 4. Resolved Cost Indicator (Both Unit & Total) */}
            <div
              className="col-span-3"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "var(--sp-1) var(--sp-2)",
                background: "var(--surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px dashed var(--border-light)",
                minHeight: "44px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-muted)" }}>
                <span>Calculated Cost:</span>
                {isPercent && (
                  <span style={{ color: "var(--primary)", fontWeight: "var(--fw-medium)" }}>
                    {stageType === "selling" ? "% of Selling" : "% of Purchase"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
                <span style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)" }}>
                  Unit: ৳{(resolved.unitAmount || 0).toFixed(2)}
                </span>
                <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                  Total: ৳{Math.round(resolved.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* 5. Delete Action */}
            <div className="col-span-1" style={{ display: "flex", justifyContent: "flex-end" }}>
              {!readOnly && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  title="Remove entry"
                  aria-label="Remove entry"
                >
                  <IconDelete size={14} />
                </Button>
              )}
            </div>
          </div>
        );
      })}

      {!readOnly && (
        <div style={{ marginTop: "var(--sp-1)", marginBottom: "var(--sp-2)" }}>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <IconPlus size={14} className="icon-left" />
            Add Custom Cost Field
          </Button>
        </div>
      )}

      {/* Stage Subtotal displaying BOTH Total and Unit */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--sp-2)",
          padding: "var(--sp-2) var(--sp-4)",
          background: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--fs-sm)",
          fontWeight: "var(--fw-medium)",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>{title} Subtotal:</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-3)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-xs)" }}>
            Unit: ৳{(stageUnitCost || 0).toFixed(2)} / unit
          </span>
          <span style={{ color: "var(--text-primary)", fontWeight: "var(--fw-bold)", fontSize: "var(--fs-base)" }}>
            {money(stageTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Main Calculator Form
// --------------------------------------------------

const CalculatorForm = ({
  isBusy,
  readOnly,
  formData = {},
  formErrors = {},
  // Cost Input Mode
  costInputMode,
  handleCostInputModeChange,
  resolveCost,
  // Models
  salesTargetDays,
  setSalesTargetDays,
  productSource,
  setProductSource,
  stockingModel,
  setStockingModel,
  salesModel,
  setSalesModel,
  returnDisposition,
  setReturnDisposition,
  // Active Group Keys
  activeSourcingKey,
  activeStockingKey,
  activeSellingKey,
  // Cost Groups & Handlers
  costs = {},
  updateCostField,
  addCost,
  removeCost,
  getStageTotal,
  getStageUnitCost,
  SOURCING_GROUPS = [],
  STOCKING_GROUPS = [],
  SELLING_GROUPS = [],
  RETURN_GROUP = {},
  // Bulk Pricing
  bulkPrices = [],
  updateBulkPrice,
  addBulkPrice,
  removeBulkPrice,
  // Calculation Results
  calculation = {},
  money = (v) => String(v),
  handleChange,
  handleResetToBDDefault,
  handleCancel,
  handleSubmit,
}) => {
  const get = (key) => formData?.[key] ?? "";
  const salesQty = Number(formData?.sales_qty) || 0;
  const unitPurchaseCost = Number(formData?.unit_purchase_cost) || 0;
  const sellingPrice = calculation?.sellingPriceAfterDiscount || Number(formData?.retail_selling_price) || 0;

  // Active group configs
  const activeSourcingConfig =
    SOURCING_GROUPS.find((g) => g.model === productSource) || SOURCING_GROUPS[0];
  const activeStockingConfig =
    STOCKING_GROUPS.find((g) => g.model === stockingModel) || STOCKING_GROUPS[0];
  const activeSellingConfig =
    SELLING_GROUPS.find((g) => g.model === salesModel) || SELLING_GROUPS[0];

  return (
    <div className="form-wrap">
      <AccordionCard allowMultiple>
        {/* =================================================================== */}
        {/* 01 SALES TARGET                                                     */}
        {/* =================================================================== */}
        <AccordionBody title="01 · Sales Target & Calculation Basis" defaultExpanded>
          <div className="grid">
            {/* Cost Entry Basis: Total for Target Qty vs Per Unit Wise */}
            <div
              className="col-span-12"
              style={{
                marginBottom: "var(--sp-2)",
                padding: "var(--sp-3)",
                background: "var(--surface-alt)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            >
              <label
                className="input-text__label"
                style={{ marginBottom: "var(--sp-2)", display: "block", fontWeight: "var(--fw-semibold)" }}
              >
                Cost Calculation & Entry Basis (ব্যয় নির্ধারণের ভিত্তি নির্বাচন করুন)
              </label>
              <GroupButton
                options={[
                  {
                    value: "total_qty",
                    label: "Total for Target Qty (মোট লক্ষ্যমাত্রা ব্যাচ ভিত্তিক)",
                  },
                  {
                    value: "per_unit",
                    label: "Per Unit Wise (প্রতি একক/ইউনিট ভিত্তিক)",
                  },
                ]}
                value={costInputMode}
                onChange={(e) => handleCostInputModeChange(e.target.value)}
                size="sm"
              />
              <p style={{ margin: "var(--sp-2) 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
                {costInputMode === "per_unit" ? (
                  <span>
                    <strong>Per Unit Wise:</strong> Fixed monetary entries (৳) represent cost per single unit. Total cost is multiplied by Sales Target Qty.
                  </span>
                ) : (
                  <span>
                    <strong>Total for Target Qty:</strong> Fixed monetary entries (৳) represent total batch expenditure. Unit cost is divided by Sales Target Qty.
                  </span>
                )}
                {" "}
                <span>
                  (Percentage entries (%) automatically calculate based on unit price regardless of mode).
                </span>
              </p>
            </div>

            {/* Time Horizon */}
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                Target Time Horizon (সময়কাল)
              </label>
              <GroupButton
                options={[
                  { value: "daily", label: "Daily (দৈনিক)" },
                  { value: "weekly", label: "Weekly (সাপ্তাহিক)" },
                  { value: "monthly", label: "Monthly (মাসিক)" },
                  { value: "half-yearly", label: "Half-Yearly (অর্ধ-বার্ষিক)" },
                  { value: "yearly", label: "Yearly (বার্ষিক)" },
                ]}
                value={salesTargetDays}
                onChange={(e) => setSalesTargetDays(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-3">
              <InputNumber
                label="Sales Target Qty (ইউনিট সংখ্যা)"
                placeholder="0"
                value={get("sales_qty")}
                onChange={(e) => handleChange("sales_qty", e.target.value)}
                error={formErrors.sales_qty}
                min={0}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputNumber
                label="Target Profit Margin (% মার্জিন)"
                placeholder="0.00"
                value={get("profit_margin")}
                onChange={(e) => handleChange("profit_margin", e.target.value)}
                error={formErrors.profit_margin}
                min={0}
                max={100}
                step={0.1}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputNumber
                label="Planned Discount (% ছাড়)"
                placeholder="0.00"
                value={get("discount_percent")}
                onChange={(e) => handleChange("discount_percent", e.target.value)}
                error={formErrors.discount_percent}
                min={0}
                max={100}
                step={0.1}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputNumber
                label="AIT / Trade Tax (৳ কর ও ফি)"
                placeholder="0.00"
                value={get("other_tax_levy")}
                onChange={(e) => handleChange("other_tax_levy", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
              />
            </div>
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 02 SOURCING MODEL & GROUP-WISE COSTS                                */}
        {/* =================================================================== */}
        <AccordionBody title="02 · Sourcing Model & Costs (উৎস ও ক্রয় সংক্রান্ত ব্যয়)" defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                Source Model Selection (উৎস নির্বাচন করুন)
              </label>
              <GroupButton
                options={[
                  { value: "local", label: "Local (স্থানীয় ক্রয়)" },
                  { value: "import", label: "Import (আন্তর্জাতিক আমদানি)" },
                  { value: "manufacture", label: "Manufacture (নিজস্ব উৎপাদন)" },
                ]}
                value={productSource}
                onChange={(e) => setProductSource(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-4">
              <InputNumber
                label={
                  productSource === "manufacture"
                    ? "Base Production Cost / Unit (৳ একক উৎপাদন খরচ)"
                    : "Base Purchase Cost / Unit (৳ একক ক্রয়মূল্য)"
                }
                placeholder="0.00"
                value={get("unit_purchase_cost")}
                onChange={(e) => handleChange("unit_purchase_cost", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
                required
              />
            </div>

            {/* Active Sourcing Group Cost List */}
            {activeSourcingConfig && (
              <GroupCostSection
                stageKey={activeSourcingKey}
                stageType="sourcing"
                title={activeSourcingConfig.title}
                bnTitle={activeSourcingConfig.bnTitle}
                description={activeSourcingConfig.description}
                items={costs[activeSourcingKey] || []}
                onAdd={() => addCost(activeSourcingKey, "", "", "value")}
                onRemove={(id) => removeCost(activeSourcingKey, id)}
                onUpdateField={updateCostField}
                stageTotal={getStageTotal(activeSourcingKey)}
                stageUnitCost={getStageUnitCost(activeSourcingKey)}
                money={money}
                costInputMode={costInputMode}
                salesQty={salesQty}
                unitPurchaseCost={unitPurchaseCost}
                sellingPrice={sellingPrice}
                resolveCost={resolveCost}
                readOnly={readOnly}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 03 STOCKING MODEL & GROUP-WISE COSTS                                */}
        {/* =================================================================== */}
        <AccordionBody title="03 · Stocking Model & Costs (মজুদ ও গুদামজাতকরণ ব্যয়)" defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                Stocking Model Selection (গুদাম মডেল)
              </label>
              <GroupButton
                options={[
                  { value: "own", label: "Own Warehouse (নিজস্ব গুদাম)" },
                  { value: "rent", label: "Rented Warehouse (ভাড়া গুদাম)" },
                  { value: "spot", label: "On Spot / No Stock (সরাসরি স্থানান্তর)" },
                ]}
                value={stockingModel}
                onChange={(e) => setStockingModel(e.target.value)}
                size="sm"
              />
            </div>

            {/* Active Stocking Group Cost List */}
            {activeStockingConfig && (
              <GroupCostSection
                stageKey={activeStockingKey}
                stageType="stocking"
                title={activeStockingConfig.title}
                bnTitle={activeStockingConfig.bnTitle}
                description={activeStockingConfig.description}
                items={costs[activeStockingKey] || []}
                onAdd={() => addCost(activeStockingKey, "", "", "value")}
                onRemove={(id) => removeCost(activeStockingKey, id)}
                onUpdateField={updateCostField}
                stageTotal={getStageTotal(activeStockingKey)}
                stageUnitCost={getStageUnitCost(activeStockingKey)}
                money={money}
                costInputMode={costInputMode}
                salesQty={salesQty}
                unitPurchaseCost={unitPurchaseCost}
                sellingPrice={sellingPrice}
                resolveCost={resolveCost}
                readOnly={readOnly}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 04 SELLING MODEL & GROUP-WISE COSTS                                 */}
        {/* =================================================================== */}
        <AccordionBody title="04 · Selling Model & Costs (বিক্রয় ও বিপণন চ্যানেল ব্যয়)" defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                Sales Channel Selection (বিক্রয় চ্যানেল)
              </label>
              <GroupButton
                options={[
                  { value: "retail", label: "Retail / E-commerce (খুচরা ও অনলাইন)" },
                  { value: "bulk", label: "Bulk / Wholesale (পাইকারি ও ডিলার চ্যানেল)" },
                ]}
                value={salesModel}
                onChange={(e) => setSalesModel(e.target.value)}
                size="sm"
              />
            </div>

            {salesModel === "retail" && (
              <div className="col-span-4">
                <InputNumber
                  label="Retail Selling Price / Unit (৳ খুচরা বিক্রয়মূল্য)"
                  placeholder="0.00"
                  value={get("retail_selling_price")}
                  onChange={(e) => handleChange("retail_selling_price", e.target.value)}
                  min={0}
                  step={0.01}
                  disabled={readOnly}
                />
              </div>
            )}

            {salesModel === "bulk" && (
              <div
                className="col-span-12"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--sp-2)",
                  marginBottom: "var(--sp-3)",
                  padding: "var(--sp-3)",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
                  Bulk Price Levels & Sales Mix (পাইকারি দর ও বিক্রয়ের অনুপাত)
                </div>
                {bulkPrices.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid"
                    style={{
                      alignItems: "flex-end",
                      padding: "var(--sp-2)",
                      background: "var(--surface-alt)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border)",
                      marginBottom: "var(--sp-1)",
                    }}
                  >
                    <div className="col-span-4">
                      <InputText
                        label={`Price Tier ${index + 1}`}
                        value={item.name}
                        onChange={(e) => updateBulkPrice(item.id, "name", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-4">
                      <InputNumber
                        label="Tier Price (৳ বিক্রয়দর)"
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) => updateBulkPrice(item.id, "price", e.target.value)}
                        min={0}
                        step={0.01}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-3">
                      <InputNumber
                        label="Sales Share (% মিশ্রণ)"
                        placeholder="0"
                        value={item.mix}
                        onChange={(e) => updateBulkPrice(item.id, "mix", e.target.value)}
                        min={0}
                        max={100}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                      {!readOnly && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeBulkPrice(item.id)}
                          disabled={bulkPrices.length <= 1}
                          title="Remove level"
                          aria-label="Remove level"
                        >
                          <IconDelete size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {!readOnly && (
                  <div>
                    <Button variant="outline" size="sm" onClick={addBulkPrice}>
                      <IconPlus size={14} className="icon-left" />
                      Add Price Level
                    </Button>
                  </div>
                )}
                <p style={{ margin: "var(--sp-1) 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
                  Note: Total sales mix across tiers should equal 100%. Weighted average selling price will be computed.
                </p>
              </div>
            )}

            <div className="col-span-4">
              <InputNumber
                label="Delivery Income Collected (৳ গ্রাহক ডেলিভারি ফি আয়)"
                placeholder="0.00"
                value={get("delivery_income")}
                onChange={(e) => handleChange("delivery_income", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
              />
            </div>

            {/* Active Selling Group Cost List */}
            {activeSellingConfig && (
              <GroupCostSection
                stageKey={activeSellingKey}
                stageType="selling"
                title={activeSellingConfig.title}
                bnTitle={activeSellingConfig.bnTitle}
                description={activeSellingConfig.description}
                items={costs[activeSellingKey] || []}
                onAdd={() => addCost(activeSellingKey, "", "", "value")}
                onRemove={(id) => removeCost(activeSellingKey, id)}
                onUpdateField={updateCostField}
                stageTotal={getStageTotal(activeSellingKey)}
                stageUnitCost={getStageUnitCost(activeSellingKey)}
                money={money}
                costInputMode={costInputMode}
                salesQty={salesQty}
                unitPurchaseCost={unitPurchaseCost}
                sellingPrice={sellingPrice}
                resolveCost={resolveCost}
                readOnly={readOnly}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 05 RETURNS MANAGEMENT & COSTS                                       */}
        {/* =================================================================== */}
        <AccordionBody title="05 · Return Management (পণ্য ফেরত ও সমাধান)" defaultExpanded>
          <div className="grid">
            <div className="col-span-4">
              <InputNumber
                label="Expected Returned Quantity (ফেরত পণ্যের সংখ্যা)"
                placeholder="0"
                value={get("returned_qty")}
                onChange={(e) => handleChange("returned_qty", e.target.value)}
                min={0}
                disabled={readOnly}
              />
            </div>

            <div className="col-span-8" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                Return Disposition (ফেরত পণ্যের ব্যবস্থাপনা)
              </label>
              <GroupButton
                options={[
                  { value: "resell", label: "Resell (পুনর্বিক্রয়)" },
                  { value: "repack", label: "Repack / Repair (মেরামত)" },
                  { value: "scrap", label: "Scrap (স্ক্র্যাপ)" },
                  { value: "dispose", label: "Dispose (সম্পূর্ণ বিনষ্ট)" },
                ]}
                value={returnDisposition}
                onChange={(e) => setReturnDisposition(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-4">
              <InputNumber
                label="Scrap / Salvage Value (৳ স্ক্র্যাপ পুনরুদ্ধার মূল্য)"
                placeholder="0.00"
                value={get("salvage_value")}
                onChange={(e) => handleChange("salvage_value", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
              />
            </div>

            {/* Return Cost Group */}
            <GroupCostSection
              stageKey={RETURN_GROUP.key}
              stageType="returns"
              title={RETURN_GROUP.title}
              bnTitle={RETURN_GROUP.bnTitle}
              description={RETURN_GROUP.description}
              items={costs[RETURN_GROUP.key] || []}
              onAdd={() => addCost(RETURN_GROUP.key, "", "", "value")}
              onRemove={(id) => removeCost(RETURN_GROUP.key, id)}
              onUpdateField={updateCostField}
              stageTotal={getStageTotal(RETURN_GROUP.key)}
              stageUnitCost={getStageUnitCost(RETURN_GROUP.key)}
              money={money}
              costInputMode={costInputMode}
              salesQty={salesQty}
              unitPurchaseCost={unitPurchaseCost}
              sellingPrice={sellingPrice}
              resolveCost={resolveCost}
              readOnly={readOnly}
            />
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 06 PROFIT & ROI SUMMARY                                             */}
        {/* =================================================================== */}
        <AccordionBody title="06 · Profit & ROI Summary (মুনাফা ও আরওআই বিশ্লেষণ)" defaultExpanded>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <DataCardGrid cols={4}>
              <DataCard
                variant="accent"
                label="Net Revenue (নিট বিক্রয় আয়)"
                value={money(calculation.netRevenue)}
              />
              <DataCard
                variant="warning"
                label="Total Expenses (মোট ব্যয়)"
                value={money(calculation.totalExpenses)}
              />
              <DataCard
                variant={calculation.netProfit >= 0 ? "success" : "danger"}
                label="Net Profit / Loss (নিট লাভ/লোকসান)"
                value={money(calculation.netProfit)}
                badge={calculation.netProfit >= 0 ? "+ Profit" : "- Loss"}
                trend={calculation.netProfit >= 0 ? "up" : "down"}
              >
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  ৳{(calculation.unitNetProfit || 0).toFixed(2)} / unit
                </div>
              </DataCard>
              <DataCard
                variant={calculation.profitMargin >= 0 ? "success" : "danger"}
                label="Profit Margin (মুনাফার হার %)"
                value={`${(calculation.profitMargin || 0).toFixed(2)}%`}
              />
              <DataCard
                variant="secondary"
                label="ROI (বিনিয়োগের রিটার্ন %)"
                value={`${(calculation.roi || 0).toFixed(2)}%`}
              />
              <DataCard
                variant="secondary"
                label="Cost Markup (মার্কআপ %)"
                value={`${(calculation.markup || 0).toFixed(2)}%`}
              />
              <DataCard
                variant="accent"
                label="Unit Inventory Cost (একক মজুদ ব্যয়)"
                value={money(calculation.unitInventoryCost)}
              />
              <DataCard
                variant="success"
                label="Target Selling Price (লক্ষ্য বিক্রয়দর)"
                value={money(calculation.requiredPrice)}
              />
            </DataCardGrid>

            {/* Comprehensive Unit Economics & Breakdown Table */}
            <div
              style={{
                background: "var(--surface-alt)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "var(--sp-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-2)",
              }}
            >
              <h4 style={{ margin: "0 0 var(--sp-2)", fontSize: "var(--fs-base)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)" }}>
                Unit Economics & Comprehensive Breakdown (একক ও মোট হিসাবের বিবরণী)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "var(--sp-3)" }}>
                <StatListItem
                  label="Sales Target Quantity"
                  value={`${(calculation.qty || 0).toLocaleString()} units`}
                />
                <StatListItem
                  label="Net Quantity (After Returns)"
                  value={`${(calculation.netQuantity || 0).toLocaleString()} units`}
                />
                <StatListItem
                  label={`Sourcing Total (${activeSourcingConfig.title})`}
                  value={money(calculation.sourcingTotal)}
                  sub={`Base: ${money(calculation.sourcingBase)} + Extra: ${money(calculation.sourcingExtra)} (৳${(calculation.sourcingUnitExtra || 0).toFixed(2)}/unit)`}
                />
                <StatListItem
                  label={`Stocking Total (${activeStockingConfig.title})`}
                  value={money(calculation.stockingTotal)}
                  sub={`৳${(calculation.stockingUnitTotal || 0).toFixed(2)} / unit`}
                />
                <StatListItem
                  label={`Selling Total (${activeSellingConfig.title})`}
                  value={money(calculation.sellingTotal)}
                  sub={`৳${(calculation.sellingUnitTotal || 0).toFixed(2)} / unit`}
                />
                <StatListItem
                  label="Return Handling & Reprocessing"
                  value={money(calculation.returnTotal)}
                  sub={`৳${(calculation.returnUnitTotal || 0).toFixed(2)} / returned unit`}
                />
                <StatListItem
                  label="Customer Refund Amount"
                  value={money(calculation.refundAmount)}
                  sub={`${calculation.returnedQty || 0} returned @ ${money(calculation.sellingPriceAfterDiscount)}`}
                />
                <StatListItem
                  label="Recovered Inventory Value"
                  value={money(calculation.recoveredInventoryCost)}
                  sub={`Disposed as ${returnDisposition}`}
                />
                <StatListItem
                  label="Lost Inventory Cost (Unrecoverable)"
                  value={money(calculation.lostInventoryCost)}
                />
                <StatListItem
                  label="Cost of Goods Sold (COGS)"
                  value={money(calculation.cogs)}
                  sub={`Net inventory consumed`}
                />
                <StatListItem
                  label="Taxes & Municipal Levies"
                  value={money(formData?.other_tax_levy || 0)}
                />
                <StatListItem
                  label="Customer Delivery Income"
                  value={money(calculation.deliveryIncome)}
                  sub={`Collected shipping income`}
                />
              </div>

              <div
                style={{
                  marginTop: "var(--sp-3)",
                  paddingTop: "var(--sp-3)",
                  borderTop: "2px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--sp-2)",
                  fontSize: "var(--fs-lg)",
                  fontWeight: "var(--fw-bold)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ color: "var(--text-primary)" }}>Net Profit / (Loss) নিট লাভ / (ক্ষতি)</span>
                  <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontWeight: "normal" }}>
                    Net per unit: ৳{(calculation.unitNetProfit || 0).toFixed(2)} / unit
                  </span>
                </div>
                <span style={{ color: calculation.netProfit >= 0 ? "var(--success)" : "var(--danger)" }}>
                  {money(calculation.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </AccordionBody>
      </AccordionCard>

      {/* ACTIONS */}
      <div className="form-actions">
        <Button variant="secondary" onClick={handleResetToBDDefault} disabled={isBusy}>
          Load Bangladesh Defaults (ডিফল্ট রিসেট)
        </Button>

        <Button variant="ghost" onClick={handleCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>

        {!readOnly && (
          <Button variant="primary" onClick={() => handleSubmit()} disabled={isBusy}>
            <IconSave size={16} className="icon-left" />
            Save Calculation
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalculatorForm;
