/**
 * Verifies the Unified Profit / ROI calculation engine.
 * Run with: node scripts/verify-profit-calculator.mjs
 */
import { computeProfitROI } from "../src/hooks/M06/profitCalculator.js";

let passed = 0;
const failures = [];

const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
const check = (name, condition, detail = "") => {
  if (condition) {
    passed += 1;
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
  }
};
const checkNear = (name, actual, expected, tol = 0.01) =>
  check(name, near(actual, expected, tol), `expected ${expected}, got ${actual}`);

const baseForm = {
  sales_qty: 1000,
  profit_margin: 25,
  discount_percent: 5,
  other_tax_levy: 3000,
  unit_purchase_cost: 650,
  retail_selling_price: 1150,
  delivery_income: 12000,
  returned_qty: 25,
  return_fee_collected: 1500,
  return_courier_cost: 2500,
  refund_value_per_unit: 0,
  scrap_recovery_basis: "per_unit",
  scrap_value_per_unit: 400,
  scrap_recovery_total: 10000,
  disposal_cost_basis: "per_unit",
  disposal_cost_per_unit: 50,
  disposal_cost_total: 1250,
  target_profit_amount: 50000,
};

const costs = (mode) => {
  const unit = mode === "per_unit";
  return {
    sourcing_local: [
      { id: "s1", name: "Freight", amount: unit ? "5.5" : "5500", type: "value" },
      { id: "s2", name: "Commission", amount: "2", type: "percent" },
    ],
    stocking_rent: [
      { id: "k1", name: "Rent", amount: unit ? "18" : "18000", type: "value" },
      { id: "k2", name: "Insurance", amount: "0.5", type: "percent" },
    ],
    selling_retail: [
      { id: "v1", name: "Courier", amount: unit ? "7.5" : "7500", type: "value" },
      { id: "v2", name: "Gateway", amount: "1.5", type: "percent" },
    ],
    selling_bulk: [
      { id: "b1", name: "Truck", amount: unit ? "14" : "14000", type: "value" },
      { id: "b2", name: "Commission", amount: "5", type: "percent" },
    ],
    returns: [
      { id: "r1", name: "Pickup", amount: unit ? "2.8" : "2800", type: "value" },
      { id: "r2", name: "Repack", amount: "1", type: "percent" },
    ],
  };
};

const bulkPrices = [
  { id: "t1", name: "Tier 1", price: "850", mix: "60" },
  { id: "t2", name: "Tier 2", price: "800", mix: "40" },
];

const run = (overrides = {}) => {
  const { mode = "total_qty", inputs = {}, ...formOverrides } = overrides;
  return computeProfitROI({
    formData: { ...baseForm, ...formOverrides },
    costs: costs(mode),
    bulkPrices,
    productSource: "local",
    stockingModel: "rent",
    salesModel: "retail",
    returnDisposition: overrides.returnDisposition || "resell_repack",
    costInputMode: mode,
    salesTargetDays: "monthly",
    ...inputs,
  });
};

// Profit as a function of batch size, used to validate BEP / goal-seek.
const profitAt = (calc, units) =>
  units * calc.unitContributionMargin - calc.rawFixedBurden;

// --------------------------------------------------
// 1. Accounting identities for every disposition
// --------------------------------------------------
for (const disposition of ["resell_repack", "scrap", "dispose"]) {
  for (const mode of ["total_qty", "per_unit"]) {
    const c = run({ returnDisposition: disposition, mode });
    const tag = `${disposition}/${mode}`;

    checkNear(`${tag}: netProfit = netRevenue - cogs - opex`, c.netProfit, c.netRevenue - c.cogs - c.opex);
    checkNear(`${tag}: netProfit = qty*CM - rawFixedBurden`, c.netProfit, profitAt(c, c.qty));
    checkNear(`${tag}: cashProfit = netProfit`, c.cashProfit, c.netProfit);
    checkNear(`${tag}: cashInflow - cashOutflow = netProfit`, c.cashInflow - c.cashOutflow, c.netProfit);
    checkNear(`${tag}: scenarioBase = netProfit`, c.scenarioBase, c.netProfit);
    checkNear(`${tag}: grossProfit = netRevenue - cogs`, c.grossProfit, c.netRevenue - c.cogs);
    checkNear(
      `${tag}: totalExpenses = cogs + opex`,
      c.totalExpenses,
      c.cogs + c.opex,
    );

    if (c.breakEvenQty !== null) {
      check(
        `${tag}: BEP qty covers fixed burden`,
        profitAt(c, c.breakEvenQty) >= -0.01,
        `profit ${profitAt(c, c.breakEvenQty)}`,
      );
      check(
        `${tag}: BEP qty is minimal`,
        c.breakEvenQty === 0 || profitAt(c, c.breakEvenQty - 1) < 0.01,
      );
    }

    if (c.requiredProfitQty !== null) {
      check(
        `${tag}: required qty reaches target profit`,
        profitAt(c, c.requiredProfitQty) >= c.targetProfit - 0.01,
      );
      check(
        `${tag}: required qty is minimal`,
        c.requiredProfitQty === 0 ||
          profitAt(c, c.requiredProfitQty - 1) < c.targetProfit + 0.01,
      );
    }
  }
}

// --------------------------------------------------
// 2. Return treatment must actually change profitability
// --------------------------------------------------
const resell = run({ returnDisposition: "resell_repack" });
const scrap = run({ returnDisposition: "scrap" });
const dispose = run({ returnDisposition: "dispose" });

check(
  "profit ordering: resell > scrap > dispose",
  resell.netProfit > scrap.netProfit && scrap.netProfit > dispose.netProfit,
  `${resell.netProfit} / ${scrap.netProfit} / ${dispose.netProfit}`,
);
check("resell sells the whole batch", resell.effectiveSoldQty === resell.qty);
check(
  "scrap sells only non-returned units",
  scrap.effectiveSoldQty === scrap.qty - scrap.returnedQty,
);
checkNear(
  "scrap recovery is booked once",
  scrap.scrapSalesRevenue,
  scrap.returnedQty * Number(baseForm.scrap_value_per_unit),
);
check("dispose books zero recovery", dispose.scrapSalesRevenue === 0);
checkNear(
  "dispose books the disposal fee",
  dispose.disposalCostTotal,
  dispose.returnedQty * Number(baseForm.disposal_cost_per_unit),
);

// --------------------------------------------------
// 3. Target price / discount floor round-trips
// --------------------------------------------------
for (const disposition of ["resell_repack", "scrap", "dispose"]) {
  const c = run({ returnDisposition: disposition });
  const price = c.requiredPrice * (1 - Number(baseForm.discount_percent) / 100);

  // At the recommended price the target margin should be met (per net revenue).
  const variableRate =
    (c.sellingPercentageSum + c.returnPercentageSum * c.returnShare) / 100;
  const profitPerUnitAtPrice =
    price * (c.qty > 0 ? c.effectiveSoldQty / c.qty : 0) +
    c.unitScrapRecovery * c.returnShare -
    price * variableRate -
    c.unitInventoryCost -
    c.unitValueSellingCost;
  const profitAtPrice =
    c.qty * profitPerUnitAtPrice - c.rawFixedBurden;

  check(
    `${disposition}: recommended price hits target margin`,
    near(
      profitAtPrice,
      (Number(baseForm.profit_margin) / 100) * price * c.qty,
      1,
    ),
    `profit ${profitAtPrice}`,
  );

  // At maximum discount the business should break even.
  if (c.maxDiscountPercent > 0 && c.maxDiscountPercent < 100) {
    const discounted = computeProfitROI({
      formData: {
        ...baseForm,
        discount_percent: c.maxDiscountPercent,
      },
      costs: costs("total_qty"),
      bulkPrices,
      returnDisposition: disposition,
    });
    check(
      `${disposition}: max discount reaches break-even`,
      Math.abs(discounted.netProfit) < 1,
      `net profit ${discounted.netProfit}`,
    );
  }

  check(
    `${disposition}: ROI sign matches profit`,
    c.workingCapital === 0 || (c.roi < 0) === (c.netProfit < 0),
  );
}

// --------------------------------------------------
// 4. Scenarios and cushions
// --------------------------------------------------
const c = run();
checkNear("worst case assumes sunk inventory", c.scenarioWorst, c.netProfit - c.effectiveSoldQty * 0.2 * c.unitSunkContribution);
checkNear("best case uses full contribution", c.scenarioBest, c.netProfit + c.effectiveSoldQty * 0.2 * c.unitContributionMargin);
checkNear(
  "sales cushion matches sold units at loss",
  c.salesDropToLossPercent,
  (c.netProfit / (c.effectiveSoldQty * c.unitSunkContribution)) * 100,
);

// --------------------------------------------------
// 5. Horizon handling
// --------------------------------------------------
for (const [horizon, days] of Object.entries({
  daily: 1,
  weekly: 7,
  monthly: 365 / 12,
  "half-yearly": 182.5,
  yearly: 365,
})) {
  const h = run({ inputs: { salesTargetDays: horizon } });
  checkNear(`${horizon}: daily units`, h.targetUnitsPerDay, h.qty / days);
  checkNear(
    `${horizon}: monthly units`,
    h.targetUnitsPerMonth,
    (h.qty / days) * (365 / 12),
  );
  checkNear(`${horizon}: annualised ROI`, h.annualizedRoi, h.roi * (365 / days), 0.001);
}

// --------------------------------------------------
// 6. Revenue mix: wholesale weighted price
// --------------------------------------------------
const bulk = run({ inputs: { salesModel: "bulk" } });
const expectedBulkPrice = (850 * 60 + 800 * 40) / 100;
checkNear("bulk weighted price", bulk.averageSellingPrice, expectedBulkPrice);

// --------------------------------------------------
// 7. Edge cases
// --------------------------------------------------
const zeroQty = run({ sales_qty: 0, returned_qty: 0 });
check("zero qty: finite metrics", Number.isFinite(zeroQty.netProfit) && Number.isFinite(zeroQty.roi));
check("zero qty: no BEP", zeroQty.breakEvenQty === null || zeroQty.breakEvenQty === 0);
check("zero qty: no payback days", zeroQty.paybackDays === null);

const allReturned = run({ returned_qty: 1000, returnDisposition: "scrap" });
check("all returned: no regular sales", allReturned.effectiveSoldQty === 0);
check("all returned: BEP is N/A when contribution is negative", allReturned.unitContributionMargin <= 0 ? allReturned.breakEvenQty === null : true);

const fullDiscount = run({ discount_percent: 100 });
check("100% discount: zero net price", fullDiscount.sellingPriceAfterDiscount === 0);
check("100% discount: no recommended list price", fullDiscount.requiredPrice === 0);

const noReturns = run({ returned_qty: 0, returnDisposition: "scrap" });
checkNear("zero returns: no return courier cost", noReturns.returnCourierCost, 0);
checkNear("zero returns: no refund", noReturns.refundAmount, 0);
checkNear("zero returns: no scrap revenue", noReturns.scrapSalesRevenue, 0);
const noReturnsResell = run({ returned_qty: 0 });
checkNear("zero returns: scrap equals resell", noReturns.netProfit, noReturnsResell.netProfit);

const refunds = run({ refund_value_per_unit: 100 });
checkNear("refund: 25 units x 100", refunds.refundAmount, 2500);
checkNear("refund: reduces net profit", refunds.netProfit, resell.netProfit - 2500);

const loss = run({ retail_selling_price: 500, discount_percent: 0 });
check("loss case flagged", loss.isOperatingAtLoss === true);
check("loss case: negative ROI", loss.roi < 0);
check("loss case: no payback", loss.paybackDays === null);
check(
  "loss case: no safe discount",
  loss.maxDiscountPercent === 0,
  `max discount ${loss.maxDiscountPercent}`,
);

const fixedIncomeOnly = run({ sales_qty: 1, other_tax_levy: 0, delivery_income: 5000, returned_qty: 0 });
check("fixed income offsets can exceed costs", Number.isFinite(fixedIncomeOnly.netProfit));

// --------------------------------------------------
// Report
// --------------------------------------------------
console.log(`\n${passed} checks passed, ${failures.length} failed.`);
if (failures.length) {
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}
console.log("All profit calculator invariants hold.");
