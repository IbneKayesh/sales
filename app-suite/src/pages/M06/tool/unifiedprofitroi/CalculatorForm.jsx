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
  title,
  bnTitle,
  description,
  items = [],
  onAdd,
  onRemove,
  onUpdate,
  stageTotal,
  money,
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
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
        <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {items.map((item, index) => (
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
          <div className="col-span-7">
            <InputText
              label={`Cost Head ${index + 1}`}
              placeholder="e.g. Transport, Toll, Commission, Customs..."
              value={item.name}
              onChange={(e) => onUpdate(item.id, "name", e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="col-span-4">
            <InputNumber
              label="Amount (৳)"
              placeholder="0.00"
              value={item.amount}
              onChange={(e) => onUpdate(item.id, "amount", e.target.value)}
              min={0}
              step={0.01}
              disabled={readOnly}
            />
          </div>

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
      ))}

      {!readOnly && (
        <div style={{ marginTop: "var(--sp-1)", marginBottom: "var(--sp-2)" }}>
          <Button variant="outline" size="sm" onClick={onAdd}>
            <IconPlus size={14} className="icon-left" />
            Add Custom Cost Field
          </Button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--sp-2) var(--sp-3)",
          background: "var(--surface)",
          border: "1px dashed var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--fs-sm)",
          fontWeight: "var(--fw-medium)",
        }}
      >
        <span style={{ color: "var(--text-secondary)" }}>{title} Subtotal:</span>
        <span style={{ color: "var(--text-primary)", fontWeight: "var(--fw-bold)" }}>
          {money(stageTotal)}
        </span>
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
  // Cost Groups
  costs = {},
  updateCosts,
  addCost,
  removeCost,
  getStageTotal,
  SOURCING_GROUPS = [],
  STOCKING_GROUPS = [],
  SELLING_GROUPS = [],
  RETURN_GROUP = {},
  // Bulk Pricing
  bulkPrices = [],
  updateBulkPrice,
  addBulkPrice,
  removeBulkPrice,
  // Calculation
  calculation = {},
  money = (v) => String(v),
  handleChange,
  handleResetToBDDefault,
  handleCancel,
  handleSubmit,
}) => {
  const get = (key) => formData?.[key] ?? "";

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
        <AccordionBody title="01 · Sales Target & Parameters" defaultExpanded>
          <div className="grid">
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
                label="AIT / Trade License Tax (৳ অন্যান্য কর)"
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
                title={activeSourcingConfig.title}
                bnTitle={activeSourcingConfig.bnTitle}
                description={activeSourcingConfig.description}
                items={costs[activeSourcingKey] || []}
                onAdd={() => addCost(activeSourcingKey)}
                onRemove={(id) => removeCost(activeSourcingKey, id)}
                onUpdate={(id, key, val) => {
                  const updated = (costs[activeSourcingKey] || []).map((item) =>
                    item.id === id ? { ...item, [key]: val } : item,
                  );
                  updateCosts(activeSourcingKey, updated);
                }}
                stageTotal={getStageTotal(activeSourcingKey)}
                money={money}
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
                title={activeStockingConfig.title}
                bnTitle={activeStockingConfig.bnTitle}
                description={activeStockingConfig.description}
                items={costs[activeStockingKey] || []}
                onAdd={() => addCost(activeStockingKey)}
                onRemove={(id) => removeCost(activeStockingKey, id)}
                onUpdate={(id, key, val) => {
                  const updated = (costs[activeStockingKey] || []).map((item) =>
                    item.id === id ? { ...item, [key]: val } : item,
                  );
                  updateCosts(activeStockingKey, updated);
                }}
                stageTotal={getStageTotal(activeStockingKey)}
                money={money}
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
                  Note: Total sales mix across tiers should equal 100%. Weighted average will be computed.
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
                title={activeSellingConfig.title}
                bnTitle={activeSellingConfig.bnTitle}
                description={activeSellingConfig.description}
                items={costs[activeSellingKey] || []}
                onAdd={() => addCost(activeSellingKey)}
                onRemove={(id) => removeCost(activeSellingKey, id)}
                onUpdate={(id, key, val) => {
                  const updated = (costs[activeSellingKey] || []).map((item) =>
                    item.id === id ? { ...item, [key]: val } : item,
                  );
                  updateCosts(activeSellingKey, updated);
                }}
                stageTotal={getStageTotal(activeSellingKey)}
                money={money}
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
              title={RETURN_GROUP.title}
              bnTitle={RETURN_GROUP.bnTitle}
              description={RETURN_GROUP.description}
              items={costs[RETURN_GROUP.key] || []}
              onAdd={() => addCost(RETURN_GROUP.key)}
              onRemove={(id) => removeCost(RETURN_GROUP.key, id)}
              onUpdate={(id, key, val) => {
                const updated = (costs[RETURN_GROUP.key] || []).map((item) =>
                  item.id === id ? { ...item, [key]: val } : item,
                );
                updateCosts(RETURN_GROUP.key, updated);
              }}
              stageTotal={getStageTotal(RETURN_GROUP.key)}
              money={money}
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
                label="Total Expenses (মোট পরিচালন ব্যয়)"
                value={money(calculation.totalExpenses)}
              />
              <DataCard
                variant={calculation.netProfit >= 0 ? "success" : "danger"}
                label="Net Profit / Loss (নিট লাভ/লোকসান)"
                value={money(calculation.netProfit)}
                badge={calculation.netProfit >= 0 ? "+ Profit" : "- Loss"}
                trend={calculation.netProfit >= 0 ? "up" : "down"}
              />
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
                Bangladesh Business Comprehensive Breakdown (বিস্তারিত হিসাব)
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--sp-3)" }}>
                <StatListItem label="Gross Sales Quantity" value={(calculation.qty || 0).toLocaleString()} />
                <StatListItem label="Net Quantity (After Returns)" value={(calculation.netQuantity || 0).toLocaleString()} />
                <StatListItem label={`Sourcing Total (${activeSourcingConfig.title})`} value={money(calculation.sourcingTotal)} />
                <StatListItem label={`Stocking Total (${activeStockingConfig.title})`} value={money(calculation.stockingTotal)} />
                <StatListItem label={`Selling Total (${activeSellingConfig.title})`} value={money(calculation.sellingTotal)} />
                <StatListItem label="Return Processing Costs" value={money(calculation.returnTotal)} />
                <StatListItem label="Customer Refund Amount" value={money(calculation.refundAmount)} />
                <StatListItem label="Recovered Inventory Value" value={money(calculation.recoveredInventoryCost)} />
                <StatListItem label="Lost Inventory Cost" value={money(calculation.lostInventoryCost)} />
                <StatListItem label="Cost of Goods Sold (COGS)" value={money(calculation.cogs)} />
                <StatListItem label="AIT & Municipal Levies" value={money(formData?.other_tax_levy || 0)} />
                <StatListItem label="Customer Delivery Income" value={money(calculation.deliveryIncome)} />
              </div>

              <div
                style={{
                  marginTop: "var(--sp-3)",
                  paddingTop: "var(--sp-3)",
                  borderTop: "2px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "var(--fs-lg)",
                  fontWeight: "var(--fw-bold)",
                }}
              >
                <span style={{ color: "var(--text-primary)" }}>Net Profit / (Loss) নিট লাভ / (ক্ষতি)</span>
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
