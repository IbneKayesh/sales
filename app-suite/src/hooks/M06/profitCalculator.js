/**
 * profitCalculator.js
 *
 * Pure calculation engine for the Unified Profit / ROI Calculator (M06).
 * No React imports so the engine can be unit-tested directly with Node.
 *
 * Accounting identities preserved by computeProfitROI():
 *   netProfit = netRevenue - cogs - opex
 *   netProfit = qty * unitContributionMargin - rawFixedBurden
 *
 * The second identity is what makes break-even and the target-profit planner
 * trustworthy for every return disposition (resell, scrap, dispose): a returned
 * unit never earns the full selling price, so its scrap recovery (or nothing)
 * is baked into the per-unit contribution instead of being counted as fixed
 * income.
 */

export const number = (value) => Math.max(0, Number(value) || 0);

// Calendar-consistent day counts for the time-horizon converter. Deriving the
// monthly/half-yearly lengths from 365 keeps monthly ↔ yearly at exactly 12x
// and yearly ↔ half-yearly at exactly 2x (30/182/365 drifted by ~2%).
export const HORIZON_DAYS = {
  daily: 1,
  weekly: 7,
  monthly: 365 / 12,
  "half-yearly": 365 / 2,
  yearly: 365,
};

export const resolveCost = (
  item,
  {
    costInputMode = "total_qty",
    salesQty = 0,
    unitPurchaseCost = 0,
    sellingPrice = 0,
    stageType = "sourcing",
  },
) => {
  const raw = number(item?.amount);
  const isPercent = item?.type === "percent";
  const qty = Math.max(0, salesQty);

  if (isPercent) {
    let unitBase = unitPurchaseCost;
    if (stageType === "selling" || stageType === "returns") {
      unitBase = sellingPrice;
    } else if (stageType === "stocking") {
      unitBase = unitPurchaseCost;
    }

    const unitAmount = (raw / 100) * unitBase;
    const totalAmount = unitAmount * qty;
    return {
      unitAmount,
      totalAmount,
      rate: raw,
      isPercent: true,
    };
  }

  if (costInputMode === "per_unit") {
    const unitAmount = raw;
    const totalAmount = unitAmount * qty;
    return {
      unitAmount,
      totalAmount,
      rate: 0,
      isPercent: false,
    };
  }

  const totalAmount = qty > 0 ? raw : 0;
  const unitAmount = qty > 0 ? totalAmount / qty : 0;
  return {
    unitAmount,
    totalAmount,
    rate: 0,
    isPercent: false,
  };
};

const sumCosts = (items, context) =>
  (items || []).reduce(
    (sum, item) => sum + resolveCost(item, context).totalAmount,
    0,
  );

export const computeProfitROI = ({
  formData = {},
  costs = {},
  bulkPrices = [],
  productSource = "local",
  stockingModel = "rent",
  salesModel = "retail",
  returnDisposition = "resell_repack",
  costInputMode = "total_qty",
  salesTargetDays = "monthly",
} = {}) => {
  const qty = number(formData?.sales_qty);
  const unitCost = number(formData?.unit_purchase_cost);
  const discountPercent = Math.min(100, number(formData?.discount_percent));
  const targetMargin = number(formData?.profit_margin);
  const otherTax = number(formData?.other_tax_levy);

  const horizonDays = HORIZON_DAYS[salesTargetDays] || HORIZON_DAYS.monthly;

  // --------------------------------------------------
  // 1. Price, revenue mix & discount
  // --------------------------------------------------

  const bulkMixTotal = bulkPrices.reduce(
    (sum, item) => sum + number(item.mix),
    0,
  );
  const averageSellingPrice =
    salesModel === "retail"
      ? number(formData?.retail_selling_price)
      : bulkMixTotal > 0
        ? bulkPrices.reduce(
            (sum, item) => sum + number(item.price) * number(item.mix),
            0,
          ) / bulkMixTotal
        : 0;

  const netPriceFactor = Math.max(0, 1 - discountPercent / 100);
  const sellingPriceAfterDiscount = averageSellingPrice * netPriceFactor;

  const resolverContext = {
    costInputMode,
    salesQty: qty,
    unitPurchaseCost: unitCost,
    sellingPrice: sellingPriceAfterDiscount,
  };

  // --------------------------------------------------
  // 2. Sourcing & stocking (batch inventory cost)
  // --------------------------------------------------

  const sourcingItems = costs[`sourcing_${productSource}`] || [];
  const sourcingExtra = sumCosts(sourcingItems, {
    ...resolverContext,
    stageType: "sourcing",
  });
  const sourcingBase = qty * unitCost;
  const sourcingTotal = sourcingBase + sourcingExtra;
  const unitSourcingCost = qty > 0 ? sourcingTotal / qty : 0;

  const stockingItems = costs[`stocking_${stockingModel}`] || [];
  const stockingTotal = sumCosts(stockingItems, {
    ...resolverContext,
    stageType: "stocking",
  });
  const unitStockingCost = qty > 0 ? stockingTotal / qty : 0;

  const inventoryCost = sourcingTotal + stockingTotal;
  const unitInventoryCost = qty > 0 ? inventoryCost / qty : 0;

  // --------------------------------------------------
  // 3. Returns & real disposition economics
  // --------------------------------------------------

  const returnedQty = Math.min(qty, number(formData?.returned_qty));
  const hasReturns = returnedQty > 0;
  const returnShare = qty > 0 ? returnedQty / qty : 0;
  const returnRatePercent = returnShare * 100;

  const refundPerUnit = number(formData?.refund_value_per_unit);
  const refundAmount = returnedQty * refundPerUnit;

  // Courier logistics only exist when something is actually returned.
  const returnFeeCollected = hasReturns
    ? number(formData?.return_fee_collected)
    : 0;
  const returnCourierCost = hasReturns
    ? number(formData?.return_courier_cost)
    : 0;

  const isResell =
    returnDisposition === "resell_repack" ||
    returnDisposition === "resell" ||
    returnDisposition === "repack";

  let effectiveSoldQty;
  let scrapSalesRevenue = 0;
  let disposalCostTotal = 0;
  let recoveredInventoryCost;
  let lostInventoryCost;
  let netScrapLoss = 0;

  if (isResell) {
    // Resell / repack: every returned unit re-enters normal sales.
    effectiveSoldQty = qty;
    recoveredInventoryCost = returnedQty * unitInventoryCost;
    lostInventoryCost = 0;
  } else if (returnDisposition === "scrap") {
    // Scrap: returned units leave the batch at scrap value.
    effectiveSoldQty = Math.max(0, qty - returnedQty);
    lostInventoryCost = returnedQty * unitInventoryCost;
    recoveredInventoryCost = 0;

    const scrapBasis = formData?.scrap_recovery_basis || "per_unit";
    if (hasReturns) {
      scrapSalesRevenue =
        scrapBasis === "per_unit"
          ? returnedQty * number(formData?.scrap_value_per_unit)
          : number(formData?.scrap_recovery_total);
    }
    netScrapLoss = Math.max(0, lostInventoryCost - scrapSalesRevenue);
  } else {
    // Dispose: zero recovery, optional disposal fee.
    effectiveSoldQty = Math.max(0, qty - returnedQty);
    scrapSalesRevenue = 0;
    lostInventoryCost = returnedQty * unitInventoryCost;
    recoveredInventoryCost = 0;

    const dispBasis = formData?.disposal_cost_basis || "per_unit";
    if (dispBasis === "per_unit") {
      disposalCostTotal = returnedQty * number(formData?.disposal_cost_per_unit);
    } else {
      disposalCostTotal = hasReturns
        ? number(formData?.disposal_cost_total)
        : 0;
    }
  }

  // --------------------------------------------------
  // 4. Sales & net revenue
  // --------------------------------------------------

  const retailSoldQty = effectiveSoldQty;
  const grossSalesBeforeDiscount = retailSoldQty * averageSellingPrice;
  const discountAmount = grossSalesBeforeDiscount * (discountPercent / 100);
  const grossSales = retailSoldQty * sellingPriceAfterDiscount;
  const regularSalesRevenue = grossSales;

  // The whole batch cost is consumed: sold units plus scrapped or written-off
  // returns. Scrap proceeds are income, so subtracting them from COGS as well
  // would count the recovery twice.
  const cogs = inventoryCost;

  const deliveryIncome = number(formData?.delivery_income);
  const netRevenue =
    regularSalesRevenue +
    scrapSalesRevenue +
    deliveryIncome +
    returnFeeCollected -
    refundAmount;

  // --------------------------------------------------
  // 5. Selling, returns & operating expenses
  // --------------------------------------------------

  const sellingItems = costs[`selling_${salesModel}`] || [];
  const sellingPercentageSum = sellingItems
    .filter((item) => item?.type === "percent")
    .reduce((sum, item) => sum + number(item.amount), 0);
  const sellingTotal = sumCosts(sellingItems, {
    ...resolverContext,
    stageType: "selling",
  });

  const returnItems = costs.returns || [];
  const returnProcessingCost = hasReturns
    ? sumCosts(returnItems, {
        ...resolverContext,
        stageType: "returns",
        salesQty: returnedQty,
      })
    : 0;
  const returnPercentageSum = hasReturns
    ? returnItems
        .filter((item) => item?.type === "percent")
        .reduce((sum, item) => sum + number(item.amount), 0)
    : 0;

  const returnTotal = returnProcessingCost + returnCourierCost + disposalCostTotal;

  // Percentage-based return handling moves with the price; keep it out of the
  // fixed burden so the target price and BEP are not circular.
  const variableReturnTotal =
    (returnPercentageSum / 100) * sellingPriceAfterDiscount * returnedQty;
  const fixedReturnTotal = Math.max(0, returnTotal - variableReturnTotal);

  const opex = sellingTotal + returnTotal + otherTax;
  const totalExpenses = cogs + opex;

  // --------------------------------------------------
  // 6. Profitability
  // --------------------------------------------------

  const grossProfit = netRevenue - cogs;
  const grossMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;
  const operatingProfit = grossProfit - sellingTotal - returnTotal;
  const netProfit = netRevenue - totalExpenses;
  const unitNetProfit = qty > 0 ? netProfit / qty : 0;
  const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
  const isOperatingAtLoss = netProfit < 0;

  // Classic price markup on landed inventory: (selling price - landed cost) /
  // landed cost. The old ratio (net profit / total expenses) was a return on
  // cost, not a markup, and contradicted its own explanation.
  const markup =
    unitInventoryCost > 0
      ? ((sellingPriceAfterDiscount - unitInventoryCost) / unitInventoryCost) *
        100
      : 0;

  // --------------------------------------------------
  // 7. Capital, ROI & payback
  // --------------------------------------------------

  const workingCapital =
    sourcingTotal + stockingTotal + sellingTotal + returnTotal + otherTax;
  const roi = workingCapital > 0 ? (netProfit / workingCapital) * 100 : 0;
  const annualizedRoi = roi * (365 / horizonDays);
  const paybackPeriods =
    netProfit > 0 && qty > 0 ? workingCapital / netProfit : null;
  const paybackDays =
    paybackPeriods !== null ? paybackPeriods * horizonDays : null;

  // --------------------------------------------------
  // 8. Exact unit contribution model
  // --------------------------------------------------

  // Per purchased unit, a returned unit earns scrap value (scrap) or nothing
  // (dispose), so revenue per purchased unit is (regular sales + scrap) / qty.
  // This is exactly `sellingPrice` for resell and lower for scrap / dispose.
  const unitRevenuePerUnit = qty > 0 ? (grossSales + scrapSalesRevenue) / qty : 0;
  const unitScrapRecovery = hasReturns ? scrapSalesRevenue / returnedQty : 0;

  const unitValueSellingCost =
    costInputMode === "per_unit"
      ? Math.max(0, sellingTotal - (sellingPercentageSum / 100) * sellingPriceAfterDiscount * qty) /
        Math.max(qty, 1)
      : 0;
  const fixedSellingTotal =
    costInputMode === "per_unit"
      ? 0
      : Math.max(
          0,
          sellingTotal -
            (sellingPercentageSum / 100) * sellingPriceAfterDiscount * qty,
        );

  const percentSellingCostPerUnit =
    (sellingPercentageSum / 100) * sellingPriceAfterDiscount;
  const percentReturnCostPerUnit =
    (returnPercentageSum / 100) * sellingPriceAfterDiscount * returnShare;

  const unitVariableCost =
    unitInventoryCost +
    percentSellingCostPerUnit +
    unitValueSellingCost +
    percentReturnCostPerUnit;

  const unitContributionMargin = unitRevenuePerUnit - unitVariableCost;
  const contributionMarginPercent =
    unitRevenuePerUnit > 0
      ? (unitContributionMargin / unitRevenuePerUnit) * 100
      : 0;

  // Profit from an extra sold unit without buying more inventory (a unit that
  // is already in the batch). Used for the committed-inventory downside case.
  const unitSunkContribution =
    unitContributionMargin + unitInventoryCost;

  const fixedCostsTotal = fixedSellingTotal + fixedReturnTotal + otherTax;
  const fixedIncomeOffsets =
    deliveryIncome + returnFeeCollected - refundAmount;
  const rawFixedBurden = fixedCostsTotal - fixedIncomeOffsets;
  const netFixedBurden = Math.max(0, rawFixedBurden);

  const breakEvenQty =
    unitContributionMargin > 0
      ? Math.ceil(netFixedBurden / unitContributionMargin)
      : null;
  const breakEvenRevenue =
    breakEvenQty !== null ? breakEvenQty * unitRevenuePerUnit : 0;
  const safetyMarginPercent =
    breakEvenQty !== null && qty > 0
      ? Math.max(0, ((qty - breakEvenQty) / qty) * 100)
      : 0;

  // --------------------------------------------------
  // 9. Target selling price & discount floor
  // --------------------------------------------------

  // Price-sensitive share of each purchased unit: 100% for resell, only the
  // non-returned share for scrap / dispose.
  const priceSensitiveShare = qty > 0 ? effectiveSoldQty / qty : 0;
  const unitScrapContribution = returnShare * unitScrapRecovery;
  const variableRatePercent = sellingPercentageSum + returnPercentageSum * returnShare;
  const variableRate = variableRatePercent / 100;
  const marginAndFeePercent = (targetMargin + variableRatePercent) / 100;

  const requiredNetPrice =
    marginAndFeePercent < 1 &&
    priceSensitiveShare - variableRate - targetMargin / 100 > 0 &&
    qty > 0
      ? (unitInventoryCost +
          unitValueSellingCost +
          rawFixedBurden / qty -
          unitScrapContribution) /
        (priceSensitiveShare - variableRate - targetMargin / 100)
      : 0;

  const requiredPrice =
    requiredNetPrice > 0 && netPriceFactor > 0
      ? requiredNetPrice / netPriceFactor
      : 0;

  const rawBreakEvenNetPrice =
    priceSensitiveShare - variableRate > 0 && qty > 0
      ? (unitInventoryCost +
          unitValueSellingCost +
          rawFixedBurden / qty -
          unitScrapContribution) /
        (priceSensitiveShare - variableRate)
      : null;

  const breakEvenNetPrice =
    rawBreakEvenNetPrice !== null ? Math.max(0, rawBreakEvenNetPrice) : null;

  const breakEvenListPrice =
    breakEvenNetPrice !== null && netPriceFactor > 0
      ? breakEvenNetPrice / netPriceFactor
      : null;

  // Largest discount off the list price that still leaves no loss.
  const maxDiscountPercent =
    breakEvenNetPrice !== null && averageSellingPrice > 0
      ? Math.max(
          0,
          Math.min(100, (1 - breakEvenNetPrice / averageSellingPrice) * 100),
        )
      : 0;

  // Profit given up by the planned discount, net of the % fees that also fall.
  const discountImpactAmount =
    averageSellingPrice *
    (discountPercent / 100) *
    qty *
    Math.max(0, priceSensitiveShare - variableRate);

  // --------------------------------------------------
  // 10. Target profit goal-seek
  // --------------------------------------------------

  const targetProfit = number(formData?.target_profit_amount);
  const requiredProfitQty =
    unitContributionMargin > 0
      ? Math.max(
          0,
          Math.ceil((targetProfit + rawFixedBurden) / unitContributionMargin),
        )
      : null;
  const requiredProfitRevenue =
    requiredProfitQty !== null
      ? requiredProfitQty * unitRevenuePerUnit
      : 0;
  const targetProfitQtyDiff =
    requiredProfitQty !== null ? requiredProfitQty - qty : 0;
  const isTargetProfitAchieved =
    requiredProfitQty !== null ? qty >= requiredProfitQty : false;

  // --------------------------------------------------
  // 11. Decision support: scenarios, cash, inventory, targets
  // --------------------------------------------------

  // Downside assumes the batch is already bought: unsold units keep their
  // inventory cost, so only the sunk-unit contribution is lost. Upside assumes
  // extra units must be purchased at full contribution margin.
  const scenarioBase = netProfit;
  const scenarioDownQty = effectiveSoldQty * 0.8;
  const scenarioUpQty = effectiveSoldQty * 1.2;
  const scenarioWorst =
    netProfit - (effectiveSoldQty - scenarioDownQty) * unitSunkContribution;
  const scenarioBest =
    netProfit + (scenarioUpQty - effectiveSoldQty) * unitContributionMargin;

  const costShockPercent = 10;
  const costShockProfit =
    netProfit -
    (costShockPercent / 100) * (inventoryCost + sellingTotal + returnTotal);

  // How far sales can fall before the business reports a loss.
  const salesCushionAmount =
    unitSunkContribution > 0 ? netProfit / unitSunkContribution : 0;
  const salesDropToLossPercent =
    effectiveSoldQty > 0 && netProfit > 0
      ? Math.min(100, (salesCushionAmount / effectiveSoldQty) * 100)
      : 0;

  // Every cost in this model is a cash cost, so cash profit equals accounting
  // net profit. Keep both explicit so the distinction is visible.
  const cashInflow =
    regularSalesRevenue +
    scrapSalesRevenue +
    deliveryIncome +
    returnFeeCollected;
  const cashOutflow = refundAmount + totalExpenses;
  const cashProfit = cashInflow - cashOutflow;

  // Inventory turns are annualised so products with different input horizons
  // can be compared on the same footing.
  const annualCogs = (cogs / horizonDays) * 365;
  const inventoryTurnsPerYear =
    inventoryCost > 0 ? annualCogs / inventoryCost : 0;
  const daysInventoryHeld =
    inventoryTurnsPerYear > 0 ? 365 / inventoryTurnsPerYear : null;

  const targetUnitsPerDay = horizonDays > 0 ? qty / horizonDays : 0;
  const targetRevenuePerDay = horizonDays > 0 ? netRevenue / horizonDays : 0;
  const targetUnitsPerMonth = targetUnitsPerDay * HORIZON_DAYS.monthly;
  const targetRevenuePerMonth = targetRevenuePerDay * HORIZON_DAYS.monthly;

  return {
    // Volume & pricing
    qty,
    effectiveSoldQty,
    netQuantity: effectiveSoldQty,
    returnedQty,
    returnRatePercent,
    returnShare,
    averageSellingPrice,
    sellingPriceAfterDiscount,
    grossSalesBeforeDiscount,
    discountAmount,
    grossSales,
    retailSoldQty,

    // Revenue
    regularSalesRevenue,
    scrapSalesRevenue,
    netScrapLoss,
    disposalCostTotal,
    returnFeeCollected,
    returnCourierCost,
    returnProcessingCost,
    refundAmount,
    deliveryIncome,
    salvageRecovery: scrapSalesRevenue,
    netRevenue,

    // Inventory & COGS
    sourcingBase,
    sourcingExtra,
    sourcingTotal,
    unitSourcingCost,
    sourcingUnitExtra: qty > 0 ? sourcingExtra / qty : 0,
    stockingTotal,
    unitStockingCost,
    stockingUnitTotal: qty > 0 ? stockingTotal / qty : 0,
    inventoryCost,
    unitInventoryCost,
    recoveredInventoryCost,
    lostInventoryCost,
    cogs,
    unitCogs:
      effectiveSoldQty > 0 ? cogs / effectiveSoldQty : qty > 0 ? cogs / qty : 0,

    // Operating expenses
    sellingTotal,
    sellingUnitTotal: qty > 0 ? sellingTotal / qty : 0,
    sellingPercentageSum,
    returnPercentageSum,
    fixedReturnTotal,
    variableReturnTotal,
    unitValueSellingCost,
    percentSellingCostPerUnit,
    percentReturnCostPerUnit,
    returnTotal,
    returnUnitTotal: returnedQty > 0 ? returnTotal / returnedQty : 0,
    opex,
    totalExpenses,
    totalExpensesUnit: qty > 0 ? totalExpenses / qty : 0,

    // Profitability
    grossProfit,
    grossMargin,
    operatingProfit,
    netProfit,
    unitNetProfit,
    profitMargin,
    markup,
    isOperatingAtLoss,

    // Capital & returns
    workingCapital,
    roi,
    annualizedRoi,
    paybackPeriods,
    paybackDays,

    // Unit economics
    unitRevenuePerUnit,
    unitScrapRecovery,
    unitVariableCost,
    unitContributionMargin,
    unitSunkContribution,
    contributionMarginPercent,
    fixedCostsTotal,
    fixedIncomeOffsets,
    rawFixedBurden,
    netFixedBurden,

    // Break-even
    breakEvenQty,
    breakEvenRevenue,
    safetyMarginPercent,
    breakEvenNetPrice,
    breakEvenListPrice,
    maxDiscountPercent,
    discountImpactAmount,

    // Target price & target profit
    requiredPrice,
    targetProfit,
    requiredProfitQty,
    requiredProfitRevenue,
    targetProfitQtyDiff,
    isTargetProfitAchieved,

    // Decision support
    scenarioBase,
    scenarioDownQty,
    scenarioUpQty,
    scenarioWorst,
    scenarioBest,
    costShockPercent,
    costShockProfit,
    salesCushionAmount,
    salesDropToLossPercent,
    cashInflow,
    cashOutflow,
    cashProfit,
    inventoryTurnsPerYear,
    daysInventoryHeld,
    targetUnitsPerDay,
    targetRevenuePerDay,
    targetUnitsPerMonth,
    targetRevenuePerMonth,

    // Context
    horizonDays,
    isResell,
  };
};

export default computeProfitROI;
