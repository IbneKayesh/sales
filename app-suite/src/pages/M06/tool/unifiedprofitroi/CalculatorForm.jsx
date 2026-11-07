import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import GroupButton from "@/components/GroupButton";
import AccordionCard, { AccordionBody } from "@/components/AccordionCard";
import { DataCardGrid, DataCard } from "@/components/DataCard";
import StatListItem from "@/components/StatListItem";
import InfoButton from "@/components/InfoButton";
import { getMetricExplanation } from "@/hooks/M06/profitExplainer";
import { IconClose, IconSave, IconPlus, IconDelete } from "@/icons";

// --------------------------------------------------
// Group-Wise Cost Section Component
// --------------------------------------------------

const GroupCostSection = ({
  stageKey,
  stageType,
  title,
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
  t = (k) => k,
  lang = "EN",
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
            {title}
          </h4>
          {description && (
            <p style={{ margin: "var(--sp-1) 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
          {t("modeNotice")}:{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {costInputMode === "per_unit" ? t("costBasisUnit") : t("costBasisTotal")}
          </strong>{" "}
          ({items.length} {items.length === 1 ? t("itemCountSingular") : t("itemsCount")})
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
                label={`${t("costHeadPrefix")} ${index + 1}`}
                placeholder={t("costHeadPlaceholder")}
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
                {t("costType")}
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
                  title={t("typeValue")}
                >
                  {t("typeValue")}
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
                  title={t("typePercent")}
                >
                  {t("typePercent")}
                </button>
              </div>
            </div>

            {/* 3. Input Amount / Rate */}
            <div className="col-span-2">
              <InputNumber
                label={
                  isPercent
                    ? t("amountRate")
                    : costInputMode === "per_unit"
                      ? t("amountPerUnit")
                      : t("amountTotal")
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
                <span>{t("calculatedCost")}</span>
                {isPercent && (
                  <span style={{ color: "var(--primary)", fontWeight: "var(--fw-medium)" }}>
                    {stageType === "selling" || stageType === "returns"
                      ? t("percentOfSelling")
                      : t("percentOfPurchase")}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
                <span style={{ fontSize: "var(--fs-xs)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)" }}>
                  {lang === "BN" ? "একক: ৳" : "Unit: ৳"}{(resolved.unitAmount || 0).toFixed(2)}
                </span>
                <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                  {lang === "BN" ? "মোট: ৳" : "Total: ৳"}{Math.round(resolved.totalAmount || 0).toLocaleString()}
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
            {t("addCustomCost")}
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
        <span style={{ color: "var(--text-secondary)" }}>{title} {t("subtotal")}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-3)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-xs)" }}>
            {lang === "BN" ? "একক: ৳" : "Unit: ৳"}{(stageUnitCost || 0).toFixed(2)} {t("perUnitSuffix")}
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
  // Language
  lang = "EN",
  setLanguage,
  t = (k) => k,
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
  // Output display controls
  outputTimeHorizon,
  setOutputTimeHorizon,
  roiViewMode,
  setRoiViewMode,
  getHorizonMultiplier,
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

  // Horizon multiplier for Section 06 display & explainer calculations
  const currentOutputMultiplier = getHorizonMultiplier
    ? getHorizonMultiplier(salesTargetDays, outputTimeHorizon ?? salesTargetDays)
    : 1;

  // Unified Explainer Popup Modal Helper
  const renderInfo = (key) => {
    const info = getMetricExplanation(key, {
      calculation,
      formData,
      bulkPrices,
      outputMultiplier: currentOutputMultiplier,
      money,
      scaleMoney: (v) => money((v || 0) * currentOutputMultiplier),
      lang,
      t,
    });
    if (!info) return null;
    return (
      <InfoButton
        title={info.title}
        subtitle={info.subtitle}
        explanation={info.explanation}
        formula={info.formula}
        breakdown={info.breakdown}
        tips={info.tips}
        lang={lang}
      />
    );
  };

  // Bulk Wholesale sales mix validation
  const totalBulkShare = bulkPrices.reduce(
    (sum, item) => sum + (Number(item.mix) || 0),
    0,
  );
  const isBulkShareValid = Math.abs(totalBulkShare - 100) < 0.001;

  return (
    <div className="form-wrap">
      {/* Language Switcher Bar */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "var(--sp-2)",
          marginBottom: "var(--sp-2)",
        }}
      >
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", fontWeight: "var(--fw-medium)" }}>
          {t("languageLabel")}:
        </span>
        <GroupButton
          options={[
            { value: "EN", label: "EN" },
            { value: "BN", label: "BN" },
          ]}
          value={lang}
          onChange={(e) => setLanguage && setLanguage(e.target.value)}
          size="sm"
        />
      </div> */}

      <AccordionCard allowMultiple>
        {/* =================================================================== */}
        {/* 01 SALES TARGET                                                     */}
        {/* =================================================================== */}
        <AccordionBody title={t("sec1Title")} defaultExpanded>
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
                style={{ marginBottom: "var(--sp-2)", display: "flex", alignItems: "center", fontWeight: "var(--fw-semibold)" }}
              >
                <span>{t("costBasisLabel")}</span>
                {renderInfo("costBasis")}
              </label>
              <GroupButton
                options={[
                  {
                    value: "total_qty",
                    label: t("costBasisTotal"),
                  },
                  {
                    value: "per_unit",
                    label: t("costBasisUnit"),
                  },
                ]}
                value={costInputMode}
                onChange={(e) => handleCostInputModeChange(e.target.value)}
                size="sm"
              />
              <p style={{ margin: "var(--sp-2) 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
                <span>{costInputMode === "per_unit" ? t("costBasisDescUnit") : t("costBasisDescTotal")}</span>{" "}
                <span>{t("costBasisPercentNote")}</span>
              </p>
            </div>

            {/* Time Horizon */}
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                {t("timeHorizonLabel")}
              </label>
              <GroupButton
                options={[
                  { value: "daily", label: t("freqDaily") },
                  { value: "weekly", label: t("freqWeekly") },
                  { value: "monthly", label: t("freqMonthly") },
                  { value: "half-yearly", label: t("freqHalfYearly") },
                  { value: "yearly", label: t("freqYearly") },
                ]}
                value={salesTargetDays}
                onChange={(e) => setSalesTargetDays(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-3">
              <InputNumber
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("salesQtyLabel")} {renderInfo("targetProfitPlanner")}</span>}
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
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("profitMarginLabel")} {renderInfo("profitMargin")}</span>}
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
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("discountLabel")} {renderInfo("discount")}</span>}
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
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("otherTaxLabel")} {renderInfo("taxes")}</span>}
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
        <AccordionBody title={t("sec2Title")} defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "flex", alignItems: "center" }}>
                <span>{t("sourceModelLabel")}</span>
                {renderInfo("sourcingModel")}
              </label>
              <GroupButton
                options={[
                  { value: "local", label: t("srcLocal") },
                  { value: "import", label: t("srcImport") },
                  { value: "manufacture", label: t("srcManufacture") },
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
                    ? t("productionCostLabel")
                    : t("unitCostLabel")
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
                t={t}
                lang={lang}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 03 STOCKING MODEL & GROUP-WISE COSTS                                */}
        {/* =================================================================== */}
        <AccordionBody title={t("sec3Title")} defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "flex", alignItems: "center" }}>
                <span>{t("stockingModelLabel")}</span>
                {renderInfo("stockingModel")}
              </label>
              <GroupButton
                options={[
                  { value: "own", label: t("stockOwn") },
                  { value: "rent", label: t("stockRent") },
                  { value: "3pl", label: t("stock3pl") },
                  { value: "spot", label: t("stockSpot") },
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
                t={t}
                lang={lang}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 04 SELLING MODEL & GROUP-WISE COSTS                                 */}
        {/* =================================================================== */}
        <AccordionBody title={t("sec4Title")} defaultExpanded>
          <div className="grid">
            <div className="col-span-12" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "flex", alignItems: "center" }}>
                <span>{t("salesModelLabel")}</span>
                {renderInfo("salesModel")}
              </label>
              <GroupButton
                options={[
                  { value: "retail", label: t("sellRetail") },
                  { value: "bulk", label: t("sellBulk") },
                ]}
                value={salesModel}
                onChange={(e) => setSalesModel(e.target.value)}
                size="sm"
              />
            </div>

            {salesModel === "retail" && (
              <div className="col-span-4">
                <InputNumber
                  label={t("retailPriceLabel")}
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
                  border: `1.5px solid ${isBulkShareValid ? "var(--border)" : "var(--danger)"}`,
                }}
              >
                {/* Header with Title, Info Button, and Total Mix Share Pill */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--sp-2)" }}>
                  <div style={{ fontSize: "var(--fs-sm)", fontWeight: "var(--fw-semibold)", color: "var(--text-primary)", display: "flex", alignItems: "center" }}>
                    <span>{t("bulkTiersTitle")}</span>
                    {renderInfo("bulkTiers")}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                    <div
                      style={{
                        fontSize: "var(--fs-xs)",
                        fontWeight: "var(--fw-bold)",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-sm)",
                        background: isBulkShareValid ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                        color: isBulkShareValid ? "var(--success)" : "var(--danger)",
                        border: `1px solid ${isBulkShareValid ? "var(--success)" : "var(--danger)"}`,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{isBulkShareValid ? "✓" : "⚠️"}</span>
                      <span>{t("totalShareLabel")}: {totalBulkShare}%</span>
                      {isBulkShareValid && (
                        <span style={{ fontWeight: "normal", opacity: 0.9 }}>({t("bulkShareValid")})</span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: "var(--fs-xs)",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--surface-alt)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {t("weightedAvgPrice")}: <strong style={{ color: "var(--primary)" }}>{money(calculation.averageSellingPrice)}</strong>
                    </div>
                  </div>
                </div>

                {/* WARNING BANNER WHEN TOTAL SALES SHARE !== 100 */}
                {!isBulkShareValid && (
                  <div
                    style={{
                      padding: "var(--sp-2) var(--sp-3)",
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid var(--danger)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--fs-xs)",
                      color: "var(--danger)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "var(--sp-2)",
                      marginTop: "var(--sp-1)",
                      marginBottom: "var(--sp-1)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "15px" }}>⚠️</span>
                      <span>
                        <strong>{lang === "BN" ? "সতর্কতা:" : "Warning:"}</strong>{" "}
                        {totalBulkShare < 100
                          ? `${t("bulkShareWarningUnder")} (${(100 - totalBulkShare).toFixed(1)}% ${lang === "BN" ? "বাকি" : "remaining"})`
                          : `${t("bulkShareWarningOver")} (${(totalBulkShare - 100).toFixed(1)}% ${lang === "BN" ? "অতিরিক্ত" : "over 100%"})`}
                      </span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                      {lang === "BN" ? "যোগফল ১০০% হওয়া আবশ্যক" : "Must sum to 100%"}
                    </span>
                  </div>
                )}

                {/* Bulk Price Tiers Rows */}
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
                        label={`${t("tierNameLabel")} ${index + 1}`}
                        value={item.name}
                        onChange={(e) => updateBulkPrice(item.id, "name", e.target.value)}
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-4">
                      <InputNumber
                        label={t("tierPriceLabel")}
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
                        label={t("tierMixLabel")}
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
                      {t("addPriceTier")}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="col-span-4">
              <InputNumber
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("deliveryIncomeLabel")} {renderInfo("netRevenue")}</span>}
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
                t={t}
                lang={lang}
              />
            )}
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 05 RETURNS MANAGEMENT & COSTS                                       */}
        {/* =================================================================== */}
        <AccordionBody title={t("sec5Title")} defaultExpanded>
          <div className="grid">
            {/* 1. Returned Qty & Disposition Selector */}
            <div className="col-span-4">
              <InputNumber
                label={t("returnedQtyLabel")}
                placeholder="0"
                value={get("returned_qty")}
                onChange={(e) => handleChange("returned_qty", e.target.value)}
                min={0}
                disabled={readOnly}
              />
            </div>

            <div className="col-span-8" style={{ marginBottom: "var(--sp-2)" }}>
              <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "flex", alignItems: "center" }}>
                <span>{t("returnDispLabel")}</span>
                {renderInfo("returnDisposition")}
              </label>
              <GroupButton
                options={[
                  { value: "resell_repack", label: t("dispResellRepack") },
                  { value: "scrap", label: t("dispScrap") },
                  { value: "dispose", label: t("dispDispose") },
                ]}
                value={
                  returnDisposition === "resell" || returnDisposition === "repack"
                    ? "resell_repack"
                    : returnDisposition
                }
                onChange={(e) => setReturnDisposition(e.target.value)}
                size="sm"
              />
            </div>

            {/* 2. Contextual Solution Notice */}
            <div
              className="col-span-12"
              style={{
                padding: "var(--sp-2) var(--sp-3)",
                background: "var(--surface)",
                border: "1px dashed var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--fs-xs)",
                color: "var(--text-secondary)",
                marginBottom: "var(--sp-2)",
              }}
            >
              {(returnDisposition === "resell_repack" ||
                returnDisposition === "resell" ||
                returnDisposition === "repack") && (
                <div>
                  <strong style={{ color: "var(--primary)" }}>✓ {t("dispResellRepack")}: </strong>
                  {t("resellNotice")}
                </div>
              )}
              {returnDisposition === "scrap" && (
                <div>
                  <strong style={{ color: "var(--warning)" }}>⚠️ {t("dispScrap")}: </strong>
                  {t("scrapNotice")}
                </div>
              )}
              {returnDisposition === "dispose" && (
                <div>
                  <strong style={{ color: "var(--danger)" }}>✕ {t("dispDispose")}: </strong>
                  {t("disposeNotice")}
                </div>
              )}
            </div>

            {/* 3. Return Courier Logistics */}
            <div className="col-span-4">
              <InputNumber
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("returnFeeCollectedLabel")} {renderInfo("returnLogistics")}</span>}
                placeholder="0.00"
                value={get("return_fee_collected")}
                onChange={(e) => handleChange("return_fee_collected", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
              />
            </div>

            <div className="col-span-4">
              <InputNumber
                label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("returnCourierCostLabel")} {renderInfo("returnLogistics")}</span>}
                placeholder="0.00"
                value={get("return_courier_cost")}
                onChange={(e) => handleChange("return_courier_cost", e.target.value)}
                min={0}
                step={0.01}
                disabled={readOnly}
              />
            </div>

            {/* 4. Conditional Fields: Resell/Repack Refund vs Scrap Selling vs Disposal Cost */}
            {(returnDisposition === "resell_repack" ||
              returnDisposition === "resell" ||
              returnDisposition === "repack") && (
              <div className="col-span-4">
                <InputNumber
                  label={t("refundValueLabel")}
                  placeholder="0.00"
                  value={get("refund_value_per_unit")}
                  onChange={(e) => handleChange("refund_value_per_unit", e.target.value)}
                  min={0}
                  step={0.01}
                  disabled={readOnly}
                />
              </div>
            )}

            {returnDisposition === "scrap" && (
              <div
                className="col-span-12 grid"
                style={{
                  alignItems: "flex-end",
                  padding: "var(--sp-2) var(--sp-3)",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  marginBottom: "var(--sp-2)",
                }}
              >
                <div className="col-span-4">
                  <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                    {t("scrapInputBasisLabel")}
                  </label>
                  <GroupButton
                    options={[
                      { value: "per_unit", label: t("scrapBasisUnit") },
                      { value: "total", label: t("scrapBasisTotal") },
                    ]}
                    value={formData?.scrap_recovery_basis || "per_unit"}
                    onChange={(e) => handleChange("scrap_recovery_basis", e.target.value)}
                    size="sm"
                  />
                </div>

                {(formData?.scrap_recovery_basis || "per_unit") === "per_unit" ? (
                  <div className="col-span-4">
                    <InputNumber
                      label={t("scrapUnitPriceLabel")}
                      placeholder="0.00"
                      value={get("scrap_value_per_unit")}
                      onChange={(e) => handleChange("scrap_value_per_unit", e.target.value)}
                      min={0}
                      step={0.01}
                      disabled={readOnly}
                    />
                  </div>
                ) : (
                  <div className="col-span-4">
                    <InputNumber
                      label={t("scrapTotalValueLabel")}
                      placeholder="0.00"
                      value={get("scrap_recovery_total")}
                      onChange={(e) => handleChange("scrap_recovery_total", e.target.value)}
                      min={0}
                      step={0.01}
                      disabled={readOnly}
                    />
                  </div>
                )}

                <div
                  className="col-span-4"
                  style={{
                    padding: "var(--sp-2)",
                    background: "var(--surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--border)",
                    fontSize: "var(--fs-xs)",
                  }}
                >
                  <div style={{ color: "var(--text-muted)" }}>Calculated Scrap Proceeds:</div>
                  <strong style={{ color: "var(--warning)", fontSize: "var(--fs-sm)" }}>
                    {money(calculation.scrapSalesRevenue || 0)}
                  </strong>
                  <div style={{ color: "var(--danger)", fontSize: "11px", marginTop: "2px" }}>
                    Net Scrap Loss: {money(calculation.netScrapLoss || 0)}
                  </div>
                </div>
              </div>
            )}

            {returnDisposition === "dispose" && (
              <div
                className="col-span-12 grid"
                style={{
                  alignItems: "flex-end",
                  padding: "var(--sp-2) var(--sp-3)",
                  background: "var(--surface-alt)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  marginBottom: "var(--sp-2)",
                }}
              >
                <div className="col-span-4">
                  <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                    {t("disposalInputBasisLabel")}
                  </label>
                  <GroupButton
                    options={[
                      { value: "per_unit", label: t("disposalBasisUnit") },
                      { value: "total", label: t("disposalBasisTotal") },
                    ]}
                    value={formData?.disposal_cost_basis || "per_unit"}
                    onChange={(e) => handleChange("disposal_cost_basis", e.target.value)}
                    size="sm"
                  />
                </div>

                {(formData?.disposal_cost_basis || "per_unit") === "per_unit" ? (
                  <div className="col-span-4">
                    <InputNumber
                      label={t("disposalCostUnitLabel")}
                      placeholder="0.00"
                      value={get("disposal_cost_per_unit")}
                      onChange={(e) => handleChange("disposal_cost_per_unit", e.target.value)}
                      min={0}
                      step={0.01}
                      disabled={readOnly}
                    />
                  </div>
                ) : (
                  <div className="col-span-4">
                    <InputNumber
                      label={t("disposalCostTotalLabel")}
                      placeholder="0.00"
                      value={get("disposal_cost_total")}
                      onChange={(e) => handleChange("disposal_cost_total", e.target.value)}
                      min={0}
                      step={0.01}
                      disabled={readOnly}
                    />
                  </div>
                )}

                <div
                  className="col-span-4"
                  style={{
                    padding: "var(--sp-2)",
                    background: "var(--surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px dashed var(--border)",
                    fontSize: "var(--fs-xs)",
                  }}
                >
                  <div style={{ color: "var(--text-muted)" }}>Total Disposal Fee:</div>
                  <strong style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>
                    {money(calculation.disposalCostTotal || 0)}
                  </strong>
                  <div style={{ color: "var(--text-secondary)", fontSize: "11px", marginTop: "2px" }}>
                    Lost Inventory: {money(calculation.lostInventoryCost || 0)}
                  </div>
                </div>
              </div>
            )}

            {/* Return Cost Group - Calculated based on returned units */}
            <GroupCostSection
              stageKey={RETURN_GROUP.key}
              stageType="returns"
              title={RETURN_GROUP.title}
              description={RETURN_GROUP.description}
              items={costs[RETURN_GROUP.key] || []}
              onAdd={() => addCost(RETURN_GROUP.key, "", "", "value")}
              onRemove={(id) => removeCost(RETURN_GROUP.key, id)}
              onUpdateField={updateCostField}
              stageTotal={getStageTotal(RETURN_GROUP.key)}
              stageUnitCost={getStageUnitCost(RETURN_GROUP.key)}
              money={money}
              costInputMode={costInputMode}
              salesQty={Math.min(Number(formData?.returned_qty) || 0, salesQty)}
              unitPurchaseCost={unitPurchaseCost}
              sellingPrice={sellingPrice}
              resolveCost={resolveCost}
              readOnly={readOnly}
              t={t}
              lang={lang}
            />
          </div>
        </AccordionBody>

        {/* =================================================================== */}
        {/* 06 PROFIT & ROI SUMMARY                                             */}
        {/* =================================================================== */}
        <AccordionBody title={t("sec6Title")} defaultExpanded>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>

            {/* Output Time Horizon & ROI View Mode Controls */}
            <div
              style={{
                padding: "var(--sp-3)",
                background: "var(--surface-alt)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-3)",
              }}
            >
              <div>
                <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                  {t("viewResultsAs")}
                </label>
                <GroupButton
                  options={[
                    { value: "daily", label: t("freqDaily") },
                    { value: "weekly", label: t("freqWeekly") },
                    { value: "monthly", label: t("freqMonthly") },
                    { value: "half-yearly", label: t("freqHalfYearly") },
                    { value: "yearly", label: t("freqYearly") },
                  ]}
                  value={outputTimeHorizon ?? salesTargetDays}
                  onChange={(e) => setOutputTimeHorizon && setOutputTimeHorizon(e.target.value)}
                  size="sm"
                />
              </div>

              <div>
                <label className="input-text__label" style={{ marginBottom: "var(--sp-1)", display: "block" }}>
                  {t("roiDisplayMode")}
                </label>
                <GroupButton
                  options={[
                    { value: "total", label: t("totalAmountMode") },
                    { value: "per_unit", label: t("perUnitMode") },
                  ]}
                  value={roiViewMode ?? "total"}
                  onChange={(e) => setRoiViewMode && setRoiViewMode(e.target.value)}
                  size="sm"
                />
              </div>

              {outputTimeHorizon && outputTimeHorizon !== salesTargetDays && getHorizonMultiplier && (
                <p style={{ margin: 0, fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
                  {lang === "BN" ? (
                    <>
                      ইনপুট: <strong>{salesTargetDays}</strong> &rarr; আউটপুট: <strong>{outputTimeHorizon}</strong> (গুণক: {getHorizonMultiplier(salesTargetDays, outputTimeHorizon).toFixed(4)}x)
                    </>
                  ) : (
                    <>
                      Input: <strong>{salesTargetDays}</strong> &rarr; Output: <strong>{outputTimeHorizon}</strong> (multiplier: {getHorizonMultiplier(salesTargetDays, outputTimeHorizon).toFixed(4)}x)
                    </>
                  )}
                </p>
              )}
            </div>

            {(() => {
              const outputMultiplier = getHorizonMultiplier
                ? getHorizonMultiplier(salesTargetDays, outputTimeHorizon ?? salesTargetDays)
                : 1;
              const scaleMoney = (v) => money((v || 0) * outputMultiplier);

              return (
                <>
                  {/* TARGET PROFIT PLANNING (REVERSE GOAL SEEK) */}
                  <div
                    style={{
                      padding: "var(--sp-4)",
                      background: "var(--surface)",
                      borderRadius: "var(--radius-xl)",
                      border: "1.5px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--sp-3)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--sp-2)" }}>
                      <div>
                        <div style={{ fontSize: "var(--fs-md)", fontWeight: "var(--fw-bold)", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
                          <span>🎯</span>
                          <span>{t("secTargetProfitTitle")}</span>
                          {renderInfo("targetProfitPlanner")}
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: "var(--fs-xs)", color: "var(--text-secondary)" }}>
                          {t("secTargetProfitSubtitle")}
                        </p>
                      </div>
                    </div>

                    <div className="grid" style={{ alignItems: "flex-end" }}>
                      <div className="col-span-4">
                        <InputNumber
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("targetProfitLabel")} {renderInfo("targetProfitPlanner")}</span>}
                          placeholder="50,000"
                          value={get("target_profit_amount")}
                          onChange={(e) => handleChange("target_profit_amount", e.target.value)}
                          min={0}
                          step={5000}
                          disabled={readOnly}
                        />
                      </div>

                      {calculation.unitContributionMargin <= 0 ? (
                        <div
                          className="col-span-8"
                          style={{
                            padding: "var(--sp-3)",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid var(--danger)",
                            borderRadius: "var(--radius-md)",
                            fontSize: "var(--fs-xs)",
                            color: "var(--danger)",
                            fontWeight: "var(--fw-medium)",
                          }}
                        >
                          ⚠️ {t("targetProfitInfeasibleNotice")}
                        </div>
                      ) : (
                        <div
                          className="col-span-8"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "var(--sp-2)",
                          }}
                        >
                          {/* Required Quantity Card */}
                          <div
                            style={{
                              padding: "var(--sp-2) var(--sp-3)",
                              background: "var(--surface-alt)",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", marginBottom: "2px", display: "flex", alignItems: "center" }}>
                              <span>{t("targetProfitRequiredQty")}</span>
                              {renderInfo("targetProfitPlanner")}
                            </div>
                            <div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", color: "var(--primary)" }}>
                              {Math.round((calculation.requiredProfitQty || 0) * outputMultiplier).toLocaleString()} {t("units")}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {t("targetProfitUnitMargin")}: {money(calculation.unitContributionMargin)}
                            </div>
                          </div>

                          {/* Required Revenue Card */}
                          <div
                            style={{
                              padding: "var(--sp-2) var(--sp-3)",
                              background: "var(--surface-alt)",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", marginBottom: "2px", display: "flex", alignItems: "center" }}>
                              <span>{t("targetProfitRequiredRevenue")}</span>
                              {renderInfo("targetProfitPlanner")}
                            </div>
                            <div style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-bold)", color: "var(--success)" }}>
                              {scaleMoney(calculation.requiredProfitRevenue)}
                            </div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              @ {money(calculation.sellingPriceAfterDiscount)} / unit
                            </div>
                          </div>

                          {/* Comparison Status Card */}
                          <div
                            style={{
                              padding: "var(--sp-2) var(--sp-3)",
                              background: calculation.isTargetProfitAchieved
                                ? "rgba(34, 197, 94, 0.08)"
                                : "rgba(234, 179, 8, 0.08)",
                              borderRadius: "var(--radius-md)",
                              border: `1px solid ${calculation.isTargetProfitAchieved ? "var(--success)" : "var(--warning)"}`,
                            }}
                          >
                            <div style={{ fontSize: "var(--fs-xs)", color: "var(--text-secondary)", marginBottom: "2px", display: "flex", alignItems: "center" }}>
                              <span>{calculation.isTargetProfitAchieved ? t("targetProfitSurplusLabel") : t("targetProfitShortfallLabel")}</span>
                              {renderInfo("targetProfitPlanner")}
                            </div>
                            <div
                              style={{
                                fontSize: "var(--fs-lg)",
                                fontWeight: "var(--fw-bold)",
                                color: calculation.isTargetProfitAchieved ? "var(--success)" : "var(--warning)",
                              }}
                            >
                              {calculation.isTargetProfitAchieved ? "+" : "-"}
                              {Math.abs(Math.round((calculation.targetProfitQtyDiff || 0) * outputMultiplier)).toLocaleString()} {t("units")}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: calculation.isTargetProfitAchieved ? "var(--success)" : "var(--text-secondary)",
                              }}
                            >
                              {calculation.isTargetProfitAchieved
                                ? `✓ ${t("targetProfitAchievedStatus")}`
                                : `${t("targetProfitShortfallLabel")}: ${scaleMoney(Math.abs(calculation.targetProfitQtyDiff) * calculation.sellingPriceAfterDiscount)}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TOP KPI METRICS: REVENUE, COGS, GROSS PROFIT, EXPENSES */}
                  <DataCardGrid cols={4}>
                    <DataCard
                      variant="accent"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiNetRevenue")} {renderInfo("netRevenue")}</span>}
                      value={scaleMoney(calculation.netRevenue)}
                    />
                    <DataCard
                      variant="secondary"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowCogs")} {renderInfo("cogs")}</span>}
                      value={scaleMoney(calculation.cogs)}
                    >
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        ৳{((calculation.unitCogs || 0) * outputMultiplier).toFixed(2)} {t("perUnitSuffix")}
                      </div>
                    </DataCard>
                    <DataCard
                      variant={calculation.grossProfit >= 0 ? "success" : "danger"}
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiGrossProfit")} {renderInfo("grossProfit")}</span>}
                      value={scaleMoney(calculation.grossProfit)}
                    >
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {t("kpiGrossMargin")}: {(calculation.grossMargin || 0).toFixed(2)}%
                      </div>
                    </DataCard>
                    <DataCard
                      variant="warning"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiTotalExpenses")} {renderInfo("totalExpenses")}</span>}
                      value={scaleMoney(calculation.totalExpenses)}
                    />

                    {/* ROW 2: NET PROFIT, ROI, BREAK-EVEN, CAPITAL */}
                    <DataCard
                      variant={calculation.netProfit >= 0 ? "success" : "danger"}
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiNetProfit")} {renderInfo("netProfit")}</span>}
                      value={scaleMoney(calculation.netProfit)}
                      badge={calculation.netProfit >= 0 ? t("profitBadge") : t("lossBadge")}
                      trend={calculation.netProfit >= 0 ? "up" : "down"}
                    >
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        ৳{((calculation.unitNetProfit || 0) * outputMultiplier).toFixed(2)} {t("perUnitSuffix")} ({((calculation.profitMargin || 0)).toFixed(1)}%)
                      </div>
                    </DataCard>

                    <DataCard
                      variant="secondary"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{roiViewMode === "per_unit" ? t("netProfitPerUnit") : t("kpiRoi")} {renderInfo("roi")}</span>}
                      value={
                        roiViewMode === "per_unit"
                          ? money((calculation.unitNetProfit || 0) * outputMultiplier)
                          : `${(calculation.roi || 0).toFixed(2)}%`
                      }
                    />

                    <DataCard
                      variant={calculation.breakEvenQty ? "accent" : "danger"}
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiBreakEvenUnits")} {renderInfo("breakEven")}</span>}
                      value={
                        calculation.breakEvenQty
                          ? `${Math.round(calculation.breakEvenQty * outputMultiplier).toLocaleString()} ${t("units")}`
                          : "N/A"
                      }
                    >
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                        {calculation.breakEvenQty
                          ? `${scaleMoney(calculation.breakEvenRevenue)}`
                          : t("bepInfinite")}
                      </div>
                    </DataCard>

                    <DataCard
                      variant="accent"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiWorkingCapital")} {renderInfo("workingCapital")}</span>}
                      value={scaleMoney(calculation.workingCapital)}
                    />

                    {/* ROW 3: OPERATING PROFIT, MARKUP, UNIT INVENTORY, REQUIRED TARGET PRICE */}
                    <DataCard
                      variant={calculation.operatingProfit >= 0 ? "success" : "danger"}
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiOperatingProfit")} {renderInfo("operatingProfit")}</span>}
                      value={scaleMoney(calculation.operatingProfit)}
                    />

                    <DataCard
                      variant="secondary"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiMarkup")} {renderInfo("markup")}</span>}
                      value={`${(calculation.markup || 0).toFixed(2)}%`}
                    />

                    <DataCard
                      variant="secondary"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiUnitInventoryCost")} {renderInfo("unitInventoryCost")}</span>}
                      value={scaleMoney(calculation.unitInventoryCost)}
                    />

                    <DataCard
                      variant="success"
                      label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiTargetPrice")} {renderInfo("targetPrice")}</span>}
                      value={scaleMoney(calculation.requiredPrice)}
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
                      gap: "var(--sp-4)",
                    }}
                  >
                    {/* SECTION A: REVENUE & SALES DEDUCTIONS */}
                    <div>
                      <h4 style={{ margin: "0 0 var(--sp-2)", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--primary)", display: "flex", alignItems: "center" }}>
                        <span>1. {lang === "BN" ? "বিক্রয় আয় ও সংগৃহীত অর্থ (Revenue & Incomes)" : "Sales Revenues & Incomes"}</span>
                        {renderInfo("netRevenue")}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-3)" }}>
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowSalesQty")} {renderInfo("targetProfitPlanner")}</span>}
                          value={`${(calculation.qty || 0).toLocaleString()} ${t("units")}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowNetQty")} {renderInfo("returnDisposition")}</span>}
                          value={`${(calculation.effectiveSoldQty || 0).toLocaleString()} ${t("units")}`}
                          sub={
                            returnDisposition === "resell_repack" ||
                            returnDisposition === "resell" ||
                            returnDisposition === "repack"
                              ? lang === "BN"
                                ? "রিপ্যাকিং করে ১০০% বিক্রি"
                                : "100% Sold after repacking"
                              : `${t("rowReturnRate")}: ${(calculation.returnRatePercent || 0).toFixed(1)}%`
                          }
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowGrossSales")} {renderInfo("netRevenue")}</span>}
                          value={scaleMoney(calculation.grossSalesBeforeDiscount)}
                          sub={`@ ${money(calculation.averageSellingPrice)}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowDiscountTotal")} {renderInfo("discount")}</span>}
                          value={`- ${scaleMoney(calculation.discountAmount)}`}
                          sub={`${formData?.discount_percent || 0}% discount applied`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowRefundAmount")} {renderInfo("returnLogistics")}</span>}
                          value={`- ${scaleMoney(calculation.refundAmount)}`}
                          sub={`${calculation.returnedQty || 0} ${t("returnedAt")} ${money(calculation.refundAmount / Math.max(1, calculation.returnedQty))}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowDeliveryIncome")} {renderInfo("netRevenue")}</span>}
                          value={`+ ${scaleMoney(calculation.deliveryIncome)}`}
                          sub={t("collectedShippingIncome")}
                        />
                        {calculation.returnFeeCollected > 0 && (
                          <StatListItem
                            label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("returnFeeCollectedLabel")} {renderInfo("returnLogistics")}</span>}
                            value={`+ ${scaleMoney(calculation.returnFeeCollected)}`}
                            sub="Customer return/advance charge"
                          />
                        )}
                        {calculation.scrapSalesRevenue > 0 && (
                          <StatListItem
                            label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowSalvageIncome")} {renderInfo("returnDisposition")}</span>}
                            value={`+ ${scaleMoney(calculation.scrapSalesRevenue)}`}
                            sub={`${calculation.returnedQty || 0} ${t("units")} scrapped`}
                          />
                        )}
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiNetRevenue")} {renderInfo("netRevenue")}</span>}
                          value={scaleMoney(calculation.netRevenue)}
                          sub={`Net effective revenue`}
                        />
                      </div>
                    </div>

                    {/* SECTION B: COST OF GOODS SOLD (COGS) */}
                    <div>
                      <h4 style={{ margin: "0 0 var(--sp-2)", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--primary)", display: "flex", alignItems: "center" }}>
                        <span>2. {lang === "BN" ? "বিক্রীত পণ্যের প্রত্যক্ষ ব্যয় (Cost of Goods Sold - COGS)" : "Direct Cost of Goods Sold (COGS)"}</span>
                        {renderInfo("cogs")}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-3)" }}>
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{`${t("rowSourcingTotal")} (${activeSourcingConfig.title})`} {renderInfo("sourcingModel")}</span>}
                          value={scaleMoney(calculation.sourcingTotal)}
                          sub={`Base: ${scaleMoney(calculation.sourcingBase)} + Extra: ${scaleMoney(calculation.sourcingExtra)}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{`${t("rowStockingTotal")} (${activeStockingConfig.title})`} {renderInfo("stockingModel")}</span>}
                          value={scaleMoney(calculation.stockingTotal)}
                          sub={`৳${((calculation.stockingUnitTotal || 0) * outputMultiplier).toFixed(2)} ${t("perUnitSuffix")}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>Total Landed Batch Cost {renderInfo("unitInventoryCost")}</span>}
                          value={scaleMoney(calculation.inventoryCost)}
                          sub={`৳${((calculation.unitInventoryCost || 0) * outputMultiplier).toFixed(2)} ${t("perUnitSuffix")}`}
                        />
                        {returnDisposition === "resell_repack" ||
                        returnDisposition === "resell" ||
                        returnDisposition === "repack" ? (
                          <StatListItem
                            label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowRecoveredCost")} {renderInfo("returnDisposition")}</span>}
                            value={`✓ ${scaleMoney(calculation.recoveredInventoryCost)}`}
                            sub="100% inventory sold to customers"
                          />
                        ) : returnDisposition === "scrap" ? (
                          <StatListItem
                            label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowLostCost")} {renderInfo("returnDisposition")}</span>}
                            value={scaleMoney(calculation.lostInventoryCost)}
                            sub={`Net Scrap Loss: ${scaleMoney(calculation.netScrapLoss)}`}
                          />
                        ) : (
                          <StatListItem
                            label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowLostCost")} {renderInfo("returnDisposition")}</span>}
                            value={scaleMoney(calculation.lostInventoryCost)}
                            sub="100% loss write-off"
                          />
                        )}
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowCogs")} {renderInfo("cogs")}</span>}
                          value={scaleMoney(calculation.cogs)}
                          sub={`৳${((calculation.unitCogs || 0) * outputMultiplier).toFixed(2)} / delivered unit`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiGrossProfit")} {renderInfo("grossProfit")}</span>}
                          value={scaleMoney(calculation.grossProfit)}
                          sub={`Gross Margin: ${(calculation.grossMargin || 0).toFixed(2)}%`}
                        />
                      </div>
                    </div>

                    {/* SECTION C: OPERATING EXPENSES (OPEX) & NET PROFIT */}
                    <div>
                      <h4 style={{ margin: "0 0 var(--sp-2)", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--primary)", display: "flex", alignItems: "center" }}>
                        <span>3. {lang === "BN" ? "পরিচালন ব্যয় ও নিট লাভ (OPEX & Net Profit)" : "Operating Expenses (OPEX) & Net Profit"}</span>
                        {renderInfo("totalExpenses")}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-3)" }}>
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{`${t("rowSellingTotal")} (${activeSellingConfig.title})`} {renderInfo("salesModel")}</span>}
                          value={scaleMoney(calculation.sellingTotal)}
                          sub={`৳${((calculation.sellingUnitTotal || 0) * outputMultiplier).toFixed(2)} ${t("perUnitSuffix")}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowReturnCosts")} {renderInfo("returnDisposition")}</span>}
                          value={scaleMoney(calculation.returnTotal)}
                          sub={`Proc: ${scaleMoney(calculation.returnProcessingCost)} + Courier: ${scaleMoney(calculation.returnCourierCost)}${calculation.disposalCostTotal > 0 ? ` + Disp: ${scaleMoney(calculation.disposalCostTotal)}` : ""}`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowTaxes")} {renderInfo("taxes")}</span>}
                          value={scaleMoney(formData?.other_tax_levy || 0)}
                          sub="AIT, VAT, Trade licensing fees"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowOperatingExpenses")} {renderInfo("totalExpenses")}</span>}
                          value={scaleMoney(calculation.opex)}
                          sub="Selling + Returns + Taxes"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiOperatingProfit")} {renderInfo("operatingProfit")}</span>}
                          value={scaleMoney(calculation.operatingProfit)}
                          sub="EBITDA / Operating Income"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiTotalExpenses")} {renderInfo("totalExpenses")}</span>}
                          value={scaleMoney(calculation.totalExpenses)}
                          sub="COGS + OPEX"
                        />
                      </div>
                    </div>

                    {/* SECTION D: BREAK-EVEN & FINANCIAL RISK ANALYSIS */}
                    <div>
                      <h4 style={{ margin: "0 0 var(--sp-2)", fontSize: "var(--fs-sm)", fontWeight: "var(--fw-bold)", color: "var(--primary)", display: "flex", alignItems: "center" }}>
                        <span>4. {lang === "BN" ? "ব্রেক-ইভেন ও আর্থিক সম্ভাব্যতা (Break-Even & Risk Analysis)" : "Break-Even & Financial Viability Analysis"}</span>
                        {renderInfo("breakEven")}
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-3)" }}>
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiContributionMargin")} {renderInfo("breakEven")}</span>}
                          value={`${(calculation.contributionMarginPercent || 0).toFixed(2)}%`}
                          sub={`৳${((calculation.unitContributionMargin || 0) * outputMultiplier).toFixed(2)} / unit margin`}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowBreakEvenQty")} {renderInfo("breakEven")}</span>}
                          value={calculation.breakEvenQty ? `${Math.round(calculation.breakEvenQty * outputMultiplier).toLocaleString()} ${t("units")}` : "N/A"}
                          sub={calculation.breakEvenQty ? t("bepAchieved") : t("bepInfinite")}
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowBreakEvenRevenue")} {renderInfo("breakEven")}</span>}
                          value={calculation.breakEvenQty ? scaleMoney(calculation.breakEvenRevenue) : "N/A"}
                          sub="Sales volume to break even"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("kpiSafetyMargin")} {renderInfo("breakEven")}</span>}
                          value={`${(calculation.safetyMarginPercent || 0).toFixed(2)}%`}
                          sub="Cushion before incurring losses"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowTargetProfit")} {renderInfo("targetProfitPlanner")}</span>}
                          value={scaleMoney(calculation.targetProfit)}
                          sub="Desired net profit goal"
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowRequiredProfitQty")} {renderInfo("targetProfitPlanner")}</span>}
                          value={
                            calculation.requiredProfitQty
                              ? `${Math.round(calculation.requiredProfitQty * outputMultiplier).toLocaleString()} ${t("units")}`
                              : "N/A"
                          }
                          sub={
                            calculation.requiredProfitQty
                              ? `${scaleMoney(calculation.requiredProfitRevenue)} total sales`
                              : t("targetProfitInfeasibleNotice")
                          }
                        />
                        <StatListItem
                          label={<span style={{ display: "inline-flex", alignItems: "center" }}>{t("rowWorkingCapital")} {renderInfo("workingCapital")}</span>}
                          value={scaleMoney(calculation.workingCapital)}
                          sub="Total initial cash required to fund batch"
                        />
                      </div>
                    </div>

                    {/* BOTTOM SUMMARY ROW */}
                    <div
                      style={{
                        marginTop: "var(--sp-2)",
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
                        <span style={{ color: "var(--text-primary)", display: "inline-flex", alignItems: "center" }}>
                          <span>{t("netProfitTotalLabel")}</span>
                          {renderInfo("netProfit")}
                        </span>
                        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontWeight: "normal" }}>
                          {t("netProfitUnitLabel")}: ৳{((calculation.unitNetProfit || 0) * outputMultiplier).toFixed(2)} {t("perUnitSuffix")} (Net Margin: {(calculation.profitMargin || 0).toFixed(2)}%)
                        </span>
                      </div>
                      <span style={{ color: calculation.netProfit >= 0 ? "var(--success)" : "var(--danger)", fontSize: "var(--fs-xl)" }}>
                        {scaleMoney(calculation.netProfit)}
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </AccordionBody>
      </AccordionCard>

      {/* ACTIONS */}
      <div className="form-actions">
        <Button variant="secondary" onClick={handleResetToBDDefault} disabled={isBusy}>
          {t("loadBDDefaults")}
        </Button>

        <Button variant="ghost" onClick={handleCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          {t("cancel")}
        </Button>

        {!readOnly && (
          <Button variant="primary" onClick={() => handleSubmit()} disabled={isBusy}>
            <IconSave size={16} className="icon-left" />
            {t("saveCalculation")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalculatorForm;
