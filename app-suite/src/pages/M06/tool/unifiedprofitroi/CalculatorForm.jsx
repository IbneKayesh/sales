import { useState, useMemo, useCallback } from "react";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import GroupButton from "@/components/GroupButton";
import AccordionCard, { AccordionBody } from "@/components/AccordionCard";
import { IconClose, IconSave } from "@/icons";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const number = (value) => Math.max(0, Number(value) || 0);

const money = (value) =>
  `৳${(Number(value) || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const createCost = (name = "") => ({
  id: crypto.randomUUID(),
  name,
  amount: "",
});

const COST_STAGES = [
  {
    key: "sourcing",
    title: "Sourcing Costs",
    description:
      "Purchase, transportation, customs, raw materials, factory overhead, etc.",
  },
  {
    key: "stocking",
    title: "Stocking Costs",
    description: "Warehouse, rent, handling, repacking, damage, storage, etc.",
  },
  {
    key: "selling",
    title: "Selling Costs",
    description: "Order collection, delivery, marketing, commission, etc.",
  },
  {
    key: "returns",
    title: "Return Handling Costs",
    description:
      "Return collection, inspection, repair, repacking, disposal, etc.",
  },
];

// --------------------------------------------------
// Dynamic Cost Entry Component
// --------------------------------------------------

const CostEntrySection = ({
  title,
  description,
  items,
  onChange,
  onAdd,
  readOnly,
}) => {
  const total = items.reduce((sum, item) => sum + number(item.amount), 0);

  const updateItem = (id, key, value) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const removeItem = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="col-span-12">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-12 gap-2 items-end border rounded-lg p-3"
        >
          <div className="col-span-7">
            <InputText
              label={`Cost Head ${index + 1}`}
              placeholder="Enter cost name"
              value={item.name}
              onChange={(e) => updateItem(item.id, "name", e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="col-span-4">
            <InputText
              label="Amount"
              placeholder="Enter amount"
              value={item.amount}
              onChange={(e) => updateItem(item.id, "amount", e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="col-span-1">
            {!readOnly && (
              <Button variant="secondary" onClick={() => removeItem(item.id)}>
                ×
              </Button>
            )}
          </div>
        </div>
      ))}

      {!readOnly && (
        <Button variant="secondary" onClick={onAdd}>
          + Add Cost Entry
        </Button>
      )}

      <div className="flex justify-between border-t pt-2 font-medium">
        <span>{title} Total</span>
        <span>{money(total)}</span>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Calculator Form
// --------------------------------------------------

const CalculatorForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
}) => {
  // Model selections
  const [salesTargetDays, setSalesTargetDays] = useState("monthly");

  const [productSource, setProductSource] = useState("local");

  const [stockingModel, setStockingModel] = useState("rent");

  const [salesModel, setSalesModel] = useState("retail");

  // Dynamic cost entries
  const [costs, setCosts] = useState({
    sourcing: [],
    stocking: [],
    selling: [],
    returns: [],
  });

  // Bulk price levels
  const [bulkPrices, setBulkPrices] = useState([
    { id: crypto.randomUUID(), name: "Level 1", price: "", mix: "100" },
    { id: crypto.randomUUID(), name: "Level 2", price: "", mix: "0" },
  ]);

  // Return configuration
  const [returnDisposition, setReturnDisposition] = useState("resell");

  // --------------------------------------------------
  // Form helpers
  // --------------------------------------------------

  const get = (key) => formData?.[key] ?? "";

  const set = (key, value) => {
    onChange(key, value);
  };

  const updateCosts = (stage, items) => {
    setCosts((previous) => ({
      ...previous,
      [stage]: items,
    }));
  };

  const addCost = (stage) => {
    setCosts((previous) => ({
      ...previous,
      [stage]: [...previous[stage], createCost()],
    }));
  };

  const getStageTotal = useCallback(
    (stage) => costs[stage].reduce((sum, item) => sum + number(item.amount), 0),
    [costs],
  );

  const totalCost = (stage) => getStageTotal(stage);

  // --------------------------------------------------
  // Bulk price helpers
  // --------------------------------------------------

  const updateBulkPrice = (id, key, value) => {
    setBulkPrices((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );
  };

  const addBulkPrice = () => {
    setBulkPrices((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: `Level ${previous.length + 1}`,
        price: "",
        mix: "0",
      },
    ]);
  };

  const removeBulkPrice = (id) => {
    setBulkPrices((previous) => previous.filter((item) => item.id !== id));
  };

  // --------------------------------------------------
  // Calculations
  // --------------------------------------------------

  const calculation = useMemo(() => {
    const qty = number(formData?.sales_qty);

    const unitCost = number(formData?.unit_purchase_cost);

    const discountPercent = Math.min(100, number(formData?.discount_percent));

    const targetMargin = number(formData?.profit_margin);

    const otherTax = number(formData?.other_tax_levy);

    // Sourcing
    const sourcingBase = qty * unitCost;
    const sourcingExtra = getStageTotal("sourcing");

    const sourcingTotal = sourcingBase + sourcingExtra;

    // Stocking
    const stockingTotal = getStageTotal("stocking");

    // Product cost available for sales
    const inventoryCost = sourcingTotal + stockingTotal;

    const unitInventoryCost = qty > 0 ? inventoryCost / qty : 0;

    // Selling price
    let averageSellingPrice = 0;

    if (salesModel === "retail") {
      averageSellingPrice = number(formData?.retail_selling_price);
    } else {
      const mixTotal = bulkPrices.reduce(
        (sum, item) => sum + number(item.mix),
        0,
      );

      averageSellingPrice =
        mixTotal > 0
          ? bulkPrices.reduce(
              (sum, item) => sum + number(item.price) * number(item.mix),
              0,
            ) / mixTotal
          : 0;
    }

    const sellingPriceAfterDiscount =
      averageSellingPrice * (1 - discountPercent / 100);

    const grossSales = qty * sellingPriceAfterDiscount;

    // Return calculation
    const returnedQty = Math.min(qty, number(formData?.returned_qty));

    const refundAmount = returnedQty * sellingPriceAfterDiscount;

    const recoverable =
      returnDisposition === "resell" || returnDisposition === "repack";

    const recoveredInventoryCost = recoverable
      ? returnedQty * unitInventoryCost
      : 0;

    const lostInventoryCost = recoverable ? 0 : returnedQty * unitInventoryCost;

    // COGS
    const cogs = inventoryCost - recoveredInventoryCost;

    // Other costs
    const sellingTotal = getStageTotal("selling");

    const returnTotal = getStageTotal("returns");

    // Revenue
    const deliveryIncome = number(formData?.delivery_income);

    const netRevenue = grossSales - refundAmount + deliveryIncome;

    // Total expenses
    const totalExpenses = cogs + sellingTotal + returnTotal + otherTax;

    // Profit
    const netProfit = netRevenue - totalExpenses;

    // Ratios
    const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

    const markup = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    // Recommended selling price
    // const requiredPrice1 =
    //   targetMargin < 100 && targetMargin >= 0
    //     ? (
    //         unitInventoryCost +
    //         (sellingTotal + returnTotal + otherTax) /
    //           Math.max(q, 1)
    //       ) /
    //       (1 - targetMargin / 100) /
    //       Math.max(0.000001, 1 - discountPercent / 100)
    //     : 0;

    // Recommended selling price
    const requiredPrice =
      targetMargin < 100 && targetMargin >= 0
        ? (unitInventoryCost +
            (sellingTotal + returnTotal + otherTax) / Math.max(qty, 1)) /
          (1 - targetMargin / 100) /
          Math.max(0.000001, 1 - discountPercent / 100)
        : 0;

    return {
      qty,
      sourcingBase,
      sourcingExtra,
      sourcingTotal,
      stockingTotal,
      inventoryCost,
      unitInventoryCost,
      averageSellingPrice,
      sellingPriceAfterDiscount,
      grossSales,
      returnedQty,
      refundAmount,
      recoveredInventoryCost,
      lostInventoryCost,
      cogs,
      sellingTotal,
      returnTotal,
      deliveryIncome,
      netRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      markup,
      roi,
      requiredPrice,
      netQuantity: qty - returnedQty,
    };
  }, [
    formData,
    costs,
    bulkPrices,
    salesModel,
    returnDisposition,
    getStageTotal,
  ]);

  // --------------------------------------------------
  // Render cost stages
  // --------------------------------------------------

  const renderCostStage = (stage) => {
    const config = COST_STAGES.find((item) => item.key === stage);

    return (
      <CostEntrySection
        key={stage}
        title={config.title}
        description={config.description}
        items={costs[stage]}
        onChange={(items) => updateCosts(stage, items)}
        onAdd={() => addCost(stage)}
        readOnly={readOnly}
      />
    );
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="form-wrap">
      <AccordionCard allowMultiple>
        {/* 01 SALES TARGET */}

        <AccordionBody title="01 · Sales target" defaultExpanded>
          <div className="grid">
            <div className="col-span-12">
              <GroupButton
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                  {
                    value: "half-yearly",
                    label: "Half-Yearly",
                  },
                  { value: "yearly", label: "Yearly" },
                ]}
                value={salesTargetDays}
                onChange={(e) => setSalesTargetDays(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-3">
              <InputText
                label="Sales Qty"
                value={get("sales_qty")}
                onChange={(e) => set("sales_qty", e.target.value)}
                error={formErrors.sales_qty}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputText
                label="Target profit margin (%)"
                value={get("profit_margin")}
                onChange={(e) => set("profit_margin", e.target.value)}
                error={formErrors.profit_margin}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputText
                label="Target discount (%)"
                value={get("discount_percent")}
                onChange={(e) => set("discount_percent", e.target.value)}
                error={formErrors.discount_percent}
                required
                disabled={readOnly}
              />
            </div>

            <div className="col-span-3">
              <InputText
                label="Other tax / levy"
                value={get("other_tax_levy")}
                onChange={(e) => set("other_tax_levy", e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </AccordionBody>

        {/* 02 SOURCING */}

        <AccordionBody title="02 · Sourcing model">
          <div className="grid">
            <div className="col-span-12">
              <GroupButton
                options={[
                  { value: "local", label: "Local" },
                  { value: "import", label: "Import" },
                  {
                    value: "manufacture",
                    label: "Manufacture",
                  },
                ]}
                value={productSource}
                onChange={(e) => setProductSource(e.target.value)}
                size="sm"
              />
            </div>

            <div className="col-span-4">
              <InputText
                label={
                  productSource === "manufacture"
                    ? "Base production cost / unit"
                    : "Unit purchase cost"
                }
                value={get("unit_purchase_cost")}
                onChange={(e) => set("unit_purchase_cost", e.target.value)}
                disabled={readOnly}
                required
              />
            </div>
            {renderCostStage("sourcing")}
          </div>
        </AccordionBody>

        {/* 03 STOCKING */}

        <AccordionBody title="03 · Stocking model">
          <div className="space-y-4">
            <GroupButton
              options={[
                { value: "own", label: "Own warehouse" },
                { value: "rent", label: "Rent warehouse" },
                { value: "spot", label: "On spot / No stock" },
              ]}
              value={stockingModel}
              onChange={(e) => setStockingModel(e.target.value)}
              size="sm"
            />

            <p className="text-sm text-gray-500">
              {stockingModel === "own" &&
                "Include warehouse maintenance, utilities, labor and other ownership costs."}

              {stockingModel === "rent" &&
                "Include warehouse rent, utilities, labor and handling costs."}

              {stockingModel === "spot" &&
                "Include direct handling, temporary storage and other on-spot costs."}
            </p>

            {renderCostStage("stocking")}
          </div>
        </AccordionBody>

        {/* 04 SELLING */}

        <AccordionBody title="04 · Selling model">
          <div className="space-y-4">
            <GroupButton
              options={[
                { value: "retail", label: "Retail Sales" },
                { value: "bulk", label: "Bulk Sales" },
              ]}
              value={salesModel}
              onChange={(e) => setSalesModel(e.target.value)}
              size="sm"
            />

            {salesModel === "retail" && (
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <InputText
                    label="Retail selling price"
                    value={get("retail_selling_price")}
                    onChange={(e) =>
                      set("retail_selling_price", e.target.value)
                    }
                    disabled={readOnly}
                  />
                </div>
              </div>
            )}

            {salesModel === "bulk" && (
              <div className="space-y-3">
                <h4 className="font-semibold">Bulk price levels</h4>

                {bulkPrices.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-2 items-end border rounded-lg p-3"
                  >
                    <div className="col-span-4">
                      <InputText
                        label="Price level"
                        value={item.name}
                        onChange={(e) =>
                          updateBulkPrice(item.id, "name", e.target.value)
                        }
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-3">
                      <InputText
                        label="Selling price"
                        value={item.price}
                        onChange={(e) =>
                          updateBulkPrice(item.id, "price", e.target.value)
                        }
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-3">
                      <InputText
                        label="Sales mix (%)"
                        value={item.mix}
                        onChange={(e) =>
                          updateBulkPrice(item.id, "mix", e.target.value)
                        }
                        disabled={readOnly}
                      />
                    </div>

                    <div className="col-span-2">
                      {!readOnly && (
                        <Button
                          variant="secondary"
                          onClick={() => removeBulkPrice(item.id)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {!readOnly && (
                  <Button variant="secondary" onClick={addBulkPrice}>
                    + Add Price Level
                  </Button>
                )}

                <p className="text-sm text-gray-500">
                  Sales mix should total 100%.
                </p>
              </div>
            )}

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <InputText
                  label="Customer delivery income"
                  value={get("delivery_income")}
                  onChange={(e) => set("delivery_income", e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>

            {renderCostStage("selling")}
          </div>
        </AccordionBody>

        {/* 05 RETURNS */}

        <AccordionBody title="05 · Return management">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <InputText
                  label="Expected returned quantity"
                  value={get("returned_qty")}
                  onChange={(e) => set("returned_qty", e.target.value)}
                  disabled={readOnly}
                />
              </div>

              <div className="col-span-12">
                <GroupButton
                  options={[
                    { value: "resell", label: "Resell" },
                    { value: "repack", label: "Repack / Repair" },
                    { value: "scrap", label: "Scrap" },
                    { value: "dispose", label: "Dispose" },
                  ]}
                  value={returnDisposition}
                  onChange={(e) => setReturnDisposition(e.target.value)}
                  size="sm"
                />
              </div>

              <div className="col-span-4">
                <InputText
                  label="Scrap / recovery value"
                  value={get("salvage_value")}
                  onChange={(e) => set("salvage_value", e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>

            {renderCostStage("returns")}
          </div>
        </AccordionBody>

        {/* 06 PROFIT & ROI */}

        <AccordionBody title="06 · Profit & ROI Calculator">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ResultCard
                label="Net Revenue"
                value={money(calculation.netRevenue)}
              />

              <ResultCard
                label="Total Expenses"
                value={money(calculation.totalExpenses)}
              />

              <ResultCard
                label="Net Profit"
                value={money(calculation.netProfit)}
                highlight
                positive={calculation.netProfit >= 0}
              />

              <ResultCard
                label="Profit Margin"
                value={`${calculation.profitMargin.toFixed(2)}%`}
              />

              <ResultCard
                label="ROI"
                value={`${calculation.roi.toFixed(2)}%`}
              />

              <ResultCard
                label="Markup"
                value={`${calculation.markup.toFixed(2)}%`}
              />

              <ResultCard
                label="Unit Inventory Cost"
                value={money(calculation.unitInventoryCost)}
              />

              <ResultCard
                label="Required Selling Price"
                value={money(calculation.requiredPrice)}
              />
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Calculation Breakdown</h4>

              <SummaryRow label="Sales quantity" value={calculation.qty} />

              <SummaryRow
                label="Net quantity after returns"
                value={calculation.netQuantity}
              />

              <SummaryRow
                label="Sourcing total"
                value={money(calculation.sourcingTotal)}
              />

              <SummaryRow
                label="Stocking total"
                value={money(calculation.stockingTotal)}
              />

              <SummaryRow
                label="Selling total"
                value={money(calculation.sellingTotal)}
              />

              <SummaryRow
                label="Return handling"
                value={money(calculation.returnTotal)}
              />

              <SummaryRow
                label="Customer refund"
                value={money(calculation.refundAmount)}
              />

              <SummaryRow
                label="Recovered inventory cost"
                value={money(calculation.recoveredInventoryCost)}
              />

              <SummaryRow
                label="Lost inventory cost"
                value={money(calculation.lostInventoryCost)}
              />

              <SummaryRow label="COGS" value={money(calculation.cogs)} />

              <SummaryRow
                label="Other tax / levy"
                value={money(number(get("other_tax_levy")))}
              />

              <SummaryRow
                label="Net revenue"
                value={money(calculation.netRevenue)}
              />

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Net Profit / Loss</span>
                <span
                  className={
                    calculation.netProfit >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {money(calculation.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </AccordionBody>
      </AccordionCard>

      {/* ACTIONS */}

      <div className="form-actions flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>

        {!readOnly && (
          <Button
            onClick={() =>
              onSubmit({
                ...formData,
                sales_target_period: salesTargetDays,
                sourcing_model: productSource,
                stocking_model: stockingModel,
                sales_model: salesModel,
                return_disposition: returnDisposition,
                bulk_prices: bulkPrices,
                costs,
              })
            }
            disabled={isBusy}
          >
            <IconSave size={16} className="icon-left" />
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------------
// Result Components
// --------------------------------------------------

const ResultCard = ({ label, value, highlight, positive = true }) => (
  <div className={`border rounded-lg p-3 ${highlight ? "bg-gray-50" : ""}`}>
    <div className="text-sm text-gray-500">{label}</div>

    <div
      className={`text-lg font-bold ${
        highlight ? (positive ? "text-green-600" : "text-red-600") : ""
      }`}
    >
      {value}
    </div>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between gap-3 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default CalculatorForm;
