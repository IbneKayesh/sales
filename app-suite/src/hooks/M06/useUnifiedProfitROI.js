import { useState, useMemo, useCallback } from "react";
import { useUI } from "@/context/AppUIContext.jsx";
import { computeProfitROI, number, HORIZON_DAYS, resolveCost } from "./profitCalculator";

// Keep the original public surface of this hook intact; the pure engine lives
// in profitCalculator.js so it can be verified outside React.
export { number, HORIZON_DAYS, resolveCost };

// --------------------------------------------------
// Helpers & Formatting
// --------------------------------------------------

export const money = (value) =>
  `৳${(Number(value) || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const createCost = (name = "", amount = "", type = "value") => ({
  id: crypto.randomUUID(),
  name,
  amount: amount === "" ? "" : String(amount),
  type: type === "percent" ? "percent" : "value",
});

// --------------------------------------------------
// Comprehensive Translation Dictionary (Single Language)
// --------------------------------------------------

export const TRANSLATIONS = {
  EN: {
    languageLabel: "Language",
    pageTitle: "Unified Profit / ROI Calculator",
    pageSubtitle: "Simulate margins, markups, costs, break-even and profitability across stages",
    loadBDDefaults: "Load BD Defaults",
    resetCancel: "Reset / Cancel",
    saveCalculation: "Save Calculation",
    cancel: "Cancel",

    // Section 1
    sec1Title: "01 · Sales Target & Calculation Basis",
    costBasisLabel: "Cost Calculation & Entry Basis",
    costBasisTotal: "Total for Target Qty",
    costBasisUnit: "Per Unit Wise",
    costBasisDescUnit: "Per Unit Wise: Fixed monetary entries (৳) represent cost per single unit. Total cost is multiplied by Sales Target Qty.",
    costBasisDescTotal: "Total for Target Qty: Fixed monetary entries (৳) represent total batch expenditure. Unit cost is divided by Sales Target Qty.",
    costBasisPercentNote: "(Percentage entries (%) automatically calculate based on unit price regardless of mode).",
    timeHorizonLabel: "Target Time Horizon",
    freqDaily: "Daily",
    freqWeekly: "Weekly",
    freqMonthly: "Monthly",
    freqHalfYearly: "Half-Yearly",
    freqYearly: "Yearly",
    salesQtyLabel: "Sales Target Qty",
    profitMarginLabel: "Target Profit Margin (%)",
    discountLabel: "Planned Discount (%)",
    otherTaxLabel: "AIT / Trade Tax (৳)",

    // Section 2
    sec2Title: "02 · Sourcing Model & Costs",
    sourceModelLabel: "Source Model Selection",
    srcLocal: "Local",
    srcImport: "Import",
    srcManufacture: "Manufacture",
    unitCostLabel: "Base Purchase Cost / Unit (৳)",
    productionCostLabel: "Base Production Cost / Unit (৳)",

    // Section 3
    sec3Title: "03 · Stocking Model & Costs",
    stockingModelLabel: "Stocking Model Selection",
    stockOwn: "Own Warehouse",
    stockRent: "Rented Warehouse",
    stock3pl: "3PL / Fulfillment",
    stockSpot: "On Spot / No Stock",

    // Section 4
    sec4Title: "04 · Selling Model & Costs",
    salesModelLabel: "Sales Channel Selection",
    sellRetail: "Retail / E-commerce",
    sellBulk: "Bulk / Wholesale",
    retailPriceLabel: "Retail Selling Price / Unit (৳)",
    bulkTiersTitle: "Bulk Price Levels & Sales Mix",
    tierNameLabel: "Price Tier",
    tierPriceLabel: "Tier Price (৳)",
    tierMixLabel: "Sales Share (%)",
    addPriceTier: "Add Price Level",
    bulkMixNote: "Note: Total sales mix across tiers should equal 100%. Weighted average selling price will be computed.",
    totalShareLabel: "Total Sales Share",
    bulkShareValid: "100% Balanced",
    bulkShareWarningUnder: "Total sales share is under 100%. Please allocate the remaining share.",
    bulkShareWarningOver: "Total sales share exceeds 100%. Please adjust percentages to equal 100%.",
    weightedAvgPrice: "Weighted Avg Price",
    deliveryIncomeLabel: "Delivery Income Collected (৳)",

    // Section 5
    sec5Title: "05 · Return Management",
    returnedQtyLabel: "Expected Returned Quantity",
    returnDispLabel: "Return Disposition Solution",
    dispResellRepack: "Resell / Repack",
    dispScrap: "Scrap (Sold at Discount)",
    dispDispose: "Dispose (Zero Value)",
    resellNotice: "Returned items are inspected, repacked, and resold. The returned quantity is included in the total sold quantity. Expenses increase by return processing and courier costs.",
    scrapNotice: "Returned items are sold at a discounted scrap price. Generates lower recovery value, increasing inventory loss and expenses.",
    disposeNotice: "Returned items cannot be salvaged and have zero sales value. 100% inventory cost is written off as a loss, plus disposal/dumping costs.",
    courierCostSectionTitle: "Return Courier Logistics",
    returnFeeCollectedLabel: "Courier Fee Collected from Customer (৳)",
    returnCourierCostLabel: "Return Freight Paid to Courier Company (৳)",
    refundValueLabel: "Original Customer Refund / Unit (৳)",
    scrapInputBasisLabel: "Scrap Value Entry Basis",
    scrapUnitPriceLabel: "Scrap Selling Price / Unit (৳)",
    scrapTotalValueLabel: "Total Scrap Recovery Value (৳)",
    scrapBasisUnit: "Per Scrapped Unit",
    scrapBasisTotal: "Total Scrap Amount",
    disposalInputBasisLabel: "Disposal Cost Entry Basis",
    disposalCostUnitLabel: "Disposal / Destruction Cost / Unit (৳)",
    disposalCostTotalLabel: "Total Disposal / Dumping Cost (৳)",
    disposalBasisUnit: "Per Disposed Unit",
    disposalBasisTotal: "Total Disposal Fee",

    // Section 6
    sec6Title: "06 · Profit & ROI Summary",
    viewResultsAs: "View Results As",
    roiDisplayMode: "ROI Display Mode",
    totalAmountMode: "Total Amount",
    perUnitMode: "Per Unit",
    kpiNetRevenue: "Net Revenue",
    kpiTotalExpenses: "Total Expenses",
    kpiGrossProfit: "Gross Profit",
    kpiGrossMargin: "Gross Margin (%)",
    kpiOperatingProfit: "Operating Profit (EBITDA)",
    kpiNetProfit: "Net Profit / Loss",
    profitBadge: "+ Profit",
    lossBadge: "- Loss",
    kpiProfitMargin: "Net Profit Margin (%)",
    kpiRoi: "ROI (on Capital %)",
    netProfitPerUnit: "Net Profit / unit",
    kpiMarkup: "Cost Markup (%)",
    kpiUnitInventoryCost: "Unit Inventory Cost",
    kpiTargetPrice: "Target Selling Price",
    kpiBreakEvenUnits: "Break-Even Units (BEP)",
    kpiBreakEvenRevenue: "Break-Even Sales (৳)",
    kpiWorkingCapital: "Working Capital Required",
    kpiContributionMargin: "Contribution Margin (%)",
    kpiSafetyMargin: "Safety Margin (%)",
    bepAchieved: "units to avoid loss",
    bepInfinite: "Price below unit variable cost",
    breakdownTitle: "Unit Economics & Comprehensive Breakdown",
    secPnlTitle: "Comprehensive Profit & Loss (P&L) Statement",
    secBepTitle: "Break-Even & Risk Analysis",
    secWorkingCapitalTitle: "Capital & Funding Requirements",
    rowGrossSales: "Gross Sales (List Price)",
    rowDiscountTotal: "Planned Discounts Given",
    rowSalesQty: "Sales Target Quantity",
    rowNetQty: "Net Quantity (After Returns)",
    rowReturnRate: "Product Return Rate",
    rowSourcingTotal: "Sourcing Total",
    rowStockingTotal: "Stocking Total",
    rowSellingTotal: "Selling Total",
    rowReturnCosts: "Return Handling & Reprocessing",
    rowRefundAmount: "Customer Refund Amount",
    rowRecoveredCost: "Recovered Inventory Value",
    rowLostCost: "Lost Inventory Cost (Unrecoverable)",
    rowSalvageIncome: "Scrap / Salvage Proceeds",
    rowCogs: "Cost of Goods Sold (COGS)",
    rowGrossProfit: "Gross Profit (Revenue - COGS)",
    rowOperatingExpenses: "Total Operating Expenses (OPEX)",
    rowOperatingProfit: "Operating Profit (EBITDA)",
    rowTaxes: "Taxes & Municipal Levies",
    rowDeliveryIncome: "Customer Delivery Income",
    rowWorkingCapital: "Total Working Capital Outlay",
    rowBreakEvenQty: "Break-Even Sales Quantity",
    rowBreakEvenRevenue: "Break-Even Sales Revenue",
    rowTargetProfit: "Targeted Net Profit Goal",
    rowRequiredProfitQty: "Required Sales Quantity for Target Profit",
    rowRequiredProfitRevenue: "Required Sales Revenue for Target Profit",
    secTargetProfitTitle: "Target Profit Planning (Goal-Seek)",
    secTargetProfitSubtitle: "Calculate the exact sales volume and revenue required to hit your desired net profit",
    targetProfitLabel: "Targeted Net Profit (৳)",
    targetProfitRequiredQty: "Required Sales Quantity",
    targetProfitRequiredRevenue: "Required Sales Revenue",
    targetProfitUnitMargin: "Unit Contribution Margin",
    targetProfitFeasibleNotice: "To achieve this net profit, you must sell at least:",
    targetProfitInfeasibleNotice: "Target profit cannot be achieved: selling price per unit is lower than or equal to variable cost per unit. Increase price or reduce variable expenses.",
    targetProfitAchievedStatus: "Current sales target already achieves this profit goal!",
    targetProfitSurplusLabel: "Surplus Units beyond Goal",
    targetProfitShortfallLabel: "Additional Units Needed",
    netProfitTotalLabel: "Net Profit / (Loss)",
    netProfitUnitLabel: "Net per unit",

    // Section 6 — Decision snapshot & extended analysis
    secDecisionTitle: "Decision Snapshot",
    secDecisionSubtitle: "What these numbers mean for your business",
    verdictProfitTitle: "This product is profitable.",
    verdictThinTitle: "Profit is thin — a small change can wipe it out.",
    verdictLossTitle: "This product is losing money.",
    verdictProfitBody: "You are making money at the current price, volume and costs.",
    verdictThinBody: "You are making money, but the cushion is small. Watch costs and discounts.",
    verdictLossBody: "Costs are higher than income. Raise the price, cut costs, or sell more.",
    recBreakEvenLabel: "Minimum units to sell",
    recBreakEvenHint: "Below this you lose money",
    recMaxDiscountLabel: "Highest discount you can give",
    recMaxDiscountHint: "At this discount profit becomes zero",
    recPaybackLabel: "Capital comes back in",
    recPaybackHint: "At the current profit",
    recPaybackNever: "Not at the current profit",
    recCushionLabel: "Sales can fall before a loss",
    recCushionHint: "How much sales volume can drop",
    recTargetGapLabel: "Units still needed for your profit goal",
    recTargetGapHint: "Compared with your current sales target",
    recCostShockLabel: "Profit if all costs rise 10%",
    recCostShockHint: "Stress test",
    recProfitNowLabel: "Profit at the current plan",
    kpiPayback: "Payback Period",
    kpiMaxDiscount: "Max Safe Discount",
    kpiInventoryTurnover: "Inventory Turns / Year",
    kpiDailyTarget: "Units to Sell / Day",
    kpiAnnualizedRoi: "Annualised ROI",
    paybackNever: "Never at this profit",
    daysSuffix: "days",
    perYearSuffix: "times",
    secSalesCashTitle: "Sales, Cash & Investment Analysis",
    rowBreakEvenNetPrice: "Break-Even Net Price (after discount)",
    rowBreakEvenListPrice: "Break-Even List Price (before discount)",
    rowMaxDiscount: "Maximum Safe Discount",
    rowDiscountImpact: "Profit Given Up to Discount",
    rowPayback: "Payback Period",
    rowAnnualizedRoi: "Annualised ROI",
    rowInventoryTurnover: "Inventory Turnover",
    rowDaysInventory: "Days Inventory Held",
    rowDailyUnits: "Units to Sell per Day",
    rowDailyRevenue: "Sales Revenue per Day",
    rowMonthlyUnits: "Units to Sell per Month",
    rowMonthlyRevenue: "Sales Revenue per Month",
    rowSalesDropCushion: "Sales Cushion Before Loss",
    rowCashInflow: "Cash Coming In",
    rowCashOutflow: "Cash Going Out",
    rowCashProfit: "Cash Left after All Costs",
    cashProfitNote: "Every cost here is a cash cost, so cash left equals net profit.",
    rowScenarioDown: "If sales fall 20%",
    rowScenarioBase: "At your current plan",
    rowScenarioUp: "If sales rise 20%",
    rowCostShock: "If all costs rise 10%",
    scenarioNote: "Downside assumes the batch is already bought. Upside assumes extra units are purchased.",
    inventoryTurnoverNote: "Annualised so products with different time horizons can be compared.",
    dailyTargetNote: "Based on your selected input time horizon.",
    units: "units",
    returnedAt: "returned @",
    disposedAs: "Disposed as",
    netInventoryConsumed: "Net inventory consumed",
    collectedShippingIncome: "Collected shipping income",

    // Cost Row Items
    costHeadPrefix: "Cost Head",
    costHeadPlaceholder: "e.g. Transport, Toll, Commission...",
    costType: "Cost Type",
    typeValue: "৳ Value",
    typePercent: "% Rate",
    amountPerUnit: "Amount / Unit (৳)",
    amountTotal: "Total Amount (৳)",
    amountRate: "Rate (%)",
    calculatedCost: "Calculated Cost:",
    subtotal: "Subtotal:",
    addCustomCost: "Add Custom Cost Field",
    itemsCount: "items",
    itemCountSingular: "item",
    modeNotice: "Mode",
    percentOfSelling: "% of Selling",
    percentOfPurchase: "% of Purchase",
    perUnitSuffix: "/ unit",
    returnedUnitSuffix: "/ returned unit",

    // Section 5/6 helper labels (single-language display)
    subCustomerReturn: "Customer return/advance charge",
    discountAppliedSuffix: "discount applied",
    scrappedSuffix: "scrapped",
    netEffectiveRevenue: "Net effective revenue",
    baseLabel: "Base",
    extraLabel: "Extra",
    inventoryFullySold: "100% inventory sold to customers",
    lossWriteOff: "100% loss write-off",
    netScrapLossLabel: "Net Scrap Loss",
    grossMarginLabel: "Gross Margin",
    deliveredUnitSuffix: "delivered unit",
    unitMarginSuffix: "unit margin",
    procLabel: "Proc",
    courierLabel: "Courier",
    dispLabel: "Disp",
    taxSub: "AIT, VAT, Trade licensing fees",
    opexComposition: "Selling + Returns + Taxes",
    ebitdaSub: "EBITDA / Operating Income",
    cogsOpexSub: "COGS + OPEX",
    bepVolumeSub: "Sales volume to break even",
    safetyMarginSub: "Cushion before incurring losses",
    targetProfitGoalSub: "Desired net profit goal",
    workingCapitalSub: "Total initial cash required to fund batch",
    totalDisposalFeeLabel: "Total Disposal Fee",
    lostInventoryLabel: "Lost Inventory",
    scrapProceedsLabel: "Calculated Scrap Proceeds",
    unitShort: "unit",
    removeEntry: "Remove entry",
    removeLevel: "Remove level",
  },

  BN: {
    languageLabel: "ভাষা",
    pageTitle: "প্রফিট ও আরওআই ক্যালকুলেটর",
    pageSubtitle: "পণ্য কেনা, গোডাউন, বিক্রির খরচ ও আসল লাভের সহজ হিসাব",
    loadBDDefaults: "বাংলাদেশের ব্যবসার রেট লোড করুন",
    resetCancel: "রিসেট / আগের মতো করুন",
    saveCalculation: "হিসাব সেভ করুন",
    cancel: "বাতিল",

    // Section 1
    sec1Title: "০১ · বিক্রির টার্গেট ও খরচের নিয়ম",
    costBasisLabel: "খরচ লেখার নিয়ম",
    costBasisTotal: "পুরো ব্যাচের মোট খরচ",
    costBasisUnit: "প্রতি পিসের একক খরচ",
    costBasisDescUnit: "প্রতি পিসের একক খরচ: এখানে টাকার অংক (৳) বসালে তা প্রতি ১ পিসের খরচ বোঝাবে। মোট খরচ বের করতে টার্গেট পিস দিয়ে গুণ হবে।",
    costBasisDescTotal: "পুরো ব্যাচের মোট খরচ: এখানে টাকার অংক (৳) বসালে তা পুরো ব্যাচের এককালীন মোট খরচ বোঝাবে। প্রতি পিসের খরচ পেতে টার্গেট পিস দিয়ে ভাগ হবে।",
    costBasisPercentNote: "(শতকরা পারসেন্টেজ (%) সব সময় প্রতি পিসের দামের ওপর নির্ভর করে নিজে থেকেই হিসাব হবে)।",
    timeHorizonLabel: "হিসাবের সময়কাল",
    freqDaily: "প্রতিদিনের",
    freqWeekly: "সাপ্তাহিক",
    freqMonthly: "মাসিক",
    freqHalfYearly: "৬ মাসের",
    freqYearly: "বার্ষিক (১ বছরের)",
    salesQtyLabel: "কত পিস বিক্রি করবেন (টার্গেট)",
    profitMarginLabel: "কত % লাভ করতে চান (মার্জিন)",
    discountLabel: "কাস্টমারকে ডিসকাউন্ট বা ছাড় (%)",
    otherTaxLabel: "ট্যাক্স, ভ্যাট ও লাইসেন্স ফি (৳)",

    // Section 2
    sec2Title: "০২ · পণ্য কেনার সোর্স ও খরচ",
    sourceModelLabel: "পণ্য কোথা থেকে সংগ্রহ করছেন?",
    srcLocal: "দেশি বাজার বা পাইকারি থেকে কেনা",
    srcImport: "বিদেশ থেকে সরাসরি আমদানি",
    srcManufacture: "নিজের কারখানায় তৈরি",
    unitCostLabel: "প্রতি পিসের কেনা দাম (৳)",
    productionCostLabel: "প্রতি পিস বানানোর কাঁচামাল খরচ (৳)",

    // Section 3
    sec3Title: "০৩ · গোডাউন ও পণ্য রাখার খরচ",
    stockingModelLabel: "পণ্য কোথায় রাখবেন?",
    stockOwn: "নিজের গোডাউন / বাড়ি",
    stockRent: "ভাড়া গোডাউন",
    stock3pl: "দারাজ / স্টেডফাস্ট ৩পিএল ফুলফিলমেন্ট",
    stockSpot: "গোডাউন ছাড়া সরাসরি ডেলিভারি",

    // Section 4
    sec4Title: "০৪ · বিক্রি ও ডেলিভারি চ্যানেল",
    salesModelLabel: "পণ্য কীভাবে বিক্রি করবেন?",
    sellRetail: "খুচরা ও অনলাইন সেলস",
    sellBulk: "পাইকারি ও ডিলার সেলস",
    retailPriceLabel: "প্রতি পিসের খুচরা বিক্রি দাম (৳)",
    bulkTiersTitle: "পাইকারি রেট ও বিক্রির ভাগ (%)",
    tierNameLabel: "মার্কেট বা ডিলারের নাম",
    tierPriceLabel: "বিক্রি দর (৳)",
    tierMixLabel: "বিক্রির ভাগ (%)",
    addPriceTier: "+ নতুন পাইকারি রেট যোগ করুন",
    bulkMixNote: "জরুরি: সবগুলো পাইকারি রেটের বিক্রির ভাগ মিলে মোট ১০০% হতে হবে। সিস্টেম স্বয়ংক্রিয়ভাবে গড় দাম বের করবে।",
    totalShareLabel: "মোট বিক্রির ভাগ",
    bulkShareValid: "১০০% মিলেছে",
    bulkShareWarningUnder: "সব পাইকারি রেট মিলিয়ে এখনো ১০০% হয়নি। বাকি ভাগটুকু বরাদ্দ করুন।",
    bulkShareWarningOver: "সব পাইকারি রেট মিলিয়ে ১০০% এর বেশি হয়ে গেছে। পারসেন্টেজ সমন্বয় করুন।",
    weightedAvgPrice: "গড় বিক্রি দাম",
    deliveryIncomeLabel: "কাস্টমারের দেওয়া ডেলিভারি চার্জ (৳)",

    // Section 5
    sec5Title: "০৫ · কাস্টমার রিটার্ন ও সমাধান",
    returnedQtyLabel: "কত পিস রিটার্ন আসতে পারে",
    returnDispLabel: "রিটার্ন আসা পণ্য কী করবেন?",
    dispResellRepack: "আবার নতুন প্যাকেট করে বিক্রি",
    dispScrap: "কম দামে বা স্ক্র্যাপে বিক্রি",
    dispDispose: "ফেলে দেওয়া / পুরো লস",
    resellNotice: "রিটার্ন আসা পণ্য ভালো করে চেক ও নতুন প্যাকেট করে আবার বিক্রি করা হয়। এতে পণ্য নষ্ট হয় না, শুধু নতুন প্যাকেট ও কুরিয়ারের বাড়তি খরচটুকু যোগ হয়।",
    scrapNotice: "রিটার্ন আসা পণ্য কিছুটা ড্যামেজ হওয়ায় আসল দামে বেচা যায় না, কম দামে বা স্ক্র্যাপে ছেড়ে দিতে হয়। এতে কিছু টাকা উদ্ধার হলেও বাকিটুকু লোকসান হয়।",
    disposeNotice: "পণ্য সম্পূর্ণ নষ্ট বা ভাঙা হওয়ায় কোনো বিক্রি দাম পাওয়া যায় না। পুরো পণ্যের কেনা দাম লোকসান হয় এবং ময়লা ফেলার বাড়তি খরচ লাগে।",
    courierCostSectionTitle: "রিটার্ন কুরিয়ার ও পরিবহন খরচ",
    returnFeeCollectedLabel: "কাস্টমারের কাছ থেকে নেওয়া রিটার্ন বা অগ্রিম ফি (৳)",
    returnCourierCostLabel: "কুরিয়ার কোম্পানিকে দেওয়া রিটার্ন চার্জ (৳)",
    refundValueLabel: "কাস্টমারকে প্রতি পিসে রিফান্ড ফেরত (৳)",
    scrapInputBasisLabel: "স্ক্র্যাপের দাম কীভাবে ধরবেন",
    scrapUnitPriceLabel: "প্রতি পিস স্ক্র্যাপের বিক্রি দাম (৳)",
    scrapTotalValueLabel: "সব স্ক্র্যাপের মোট বিক্রি দাম (৳)",
    scrapBasisUnit: "প্রতি পিস হিসেবে",
    scrapBasisTotal: "এককালীন মোট মূল্য",
    disposalInputBasisLabel: "ফেলে দেওয়ার খরচ কীভাবে ধরবেন",
    disposalCostUnitLabel: "প্রতি পিস ফেলতে খরচ (৳)",
    disposalCostTotalLabel: "সব ফেলতে মোট খরচ (৳)",
    disposalBasisUnit: "প্রতি পিস হিসেবে",
    disposalBasisTotal: "এককালীন মোট খরচ",

    // Section 6
    sec6Title: "০৬ · লাভ-লস ও আসল মুনাফা (ROI)",
    viewResultsAs: "হিসাব দেখতে চান",
    roiDisplayMode: "দেখানোর নিয়ম",
    totalAmountMode: "পুরো ব্যাচের মোট",
    perUnitMode: "প্রতি পিসের হিসেবে",
    kpiNetRevenue: "আসল বিক্রি আয় (নিট সেলস)",
    kpiTotalExpenses: "ব্যবসা চালাতে মোট খরচ",
    kpiGrossProfit: "মোট লাভ (গ্রস লাভ)",
    kpiGrossMargin: "গ্রস লাভের মার্জিন (%)",
    kpiOperatingProfit: "ব্যবসা চালানোর খরচ বাদে লাভ",
    kpiNetProfit: "সব খরচ বাদে কত টাকা লাভ থাকছে",
    profitBadge: "+ লাভ",
    lossBadge: "- লস",
    kpiProfitMargin: "সব খরচ বাদে কত শতাংশ লাভ থাকছে",
    kpiRoi: "টাকার ওপর লাভ (ROI %)",
    netProfitPerUnit: "প্রতি পিসে নিট লাভ",
    kpiMarkup: "খরচের তুলনায় দাম কত % বেশি",
    kpiUnitInventoryCost: "প্রতি পিস হাতে আসার খরচ (ল্যান্ডেড কস্ট)",
    kpiTargetPrice: "টার্গেট লাভে বেচতে হবে যে দামে",
    kpiBreakEvenUnits: "কত পিস বেচলে লাভ-লোকসান সমান হবে",
    kpiBreakEvenRevenue: "কত টাকার বিক্রিতে লাভ-লোকসান সমান হবে",
    kpiWorkingCapital: "ব্যবসা শুরু করতে কত টাকা লাগবে",
    kpiContributionMargin: "প্রতি পিসে খরচ বাদে যা থাকে (%)",
    kpiSafetyMargin: "বিক্রি কত কমলেও লস হবে না (%)",
    bepAchieved: "পিস বেচলে কোনো লস হবে না",
    bepInfinite: "বিক্রি দাম খরচের চেয়েও কম!",
    breakdownTitle: "লাভ-লস ও খরচের বিস্তারিত হিসাব",
    secPnlTitle: "লাভ ও ক্ষতির পুরো খতিয়ান",
    secBepTitle: "লস না হওয়ার হিসাব ও ঝুঁকি (ব্রেক-ইভেন)",
    secWorkingCapitalTitle: "নগদ টাকা ও মূলধনের প্রয়োজন",
    rowGrossSales: "তালিকা অনুযায়ী মোট বিক্রি",
    rowDiscountTotal: "কাস্টমারকে দেওয়া ডিসকাউন্ট বা ছাড়",
    rowSalesQty: "কত পিস বিক্রির টার্গেট",
    rowNetQty: "সফলভাবে বিক্রি হওয়া আসল পিস",
    rowReturnRate: "পণ্য ফেরতের হার",
    rowSourcingTotal: "পণ্য কেনার মোট খরচ",
    rowStockingTotal: "গোডাউন ও পণ্য রাখার খরচ",
    rowSellingTotal: "বিক্রি, বিজ্ঞাপন ও কুরিয়ার খরচ",
    rowReturnCosts: "রিটার্ন হ্যান্ডলিং ও কুরিয়ার খরচ",
    rowRefundAmount: "কাস্টমারকে ফেরত দেওয়া টাকা (রিফান্ড)",
    rowRecoveredCost: "আবার বিক্রি করে উদ্ধার হওয়া টাকা",
    rowLostCost: "নষ্ট বা অবিক্রিত পণ্যের লোকসান",
    rowSalvageIncome: "স্ক্র্যাপ বা কম দামে বিক্রির আয়",
    rowCogs: "পণ্যের আসল কেনা ও রাখার খরচ (COGS)",
    rowGrossProfit: "মোট লাভ (বিক্রি আয় - COGS)",
    rowOperatingExpenses: "চলতি সব পরিচালন খরচ (OPEX)",
    rowOperatingProfit: "চলতি ব্যবসার লাভ (অপারেটিং প্রফিট)",
    rowTaxes: "সরকারি ট্যাক্স, ভ্যাট ও লাইসেন্স ফি",
    rowDeliveryIncome: "কাস্টমারের দেওয়া ডেলিভারি চার্জের আয়",
    rowWorkingCapital: "হাতে মোট নগদ মূলধন প্রয়োজন",
    rowBreakEvenQty: "লস না হওয়ার নূন্যতম বিক্রি (পিস)",
    rowBreakEvenRevenue: "লস না হওয়ার নূন্যতম বিক্রি (টাকা)",
    rowTargetProfit: "যত টাকা নিট লাভ করতে চান",
    rowRequiredProfitQty: "টার্গেট লাভে পৌঁছাতে বিক্রি করতে হবে (পিস)",
    rowRequiredProfitRevenue: "টার্গেট লাভে পৌঁছাতে বিক্রি করতে হবে (টাকা)",
    secTargetProfitTitle: "নির্দিষ্ট লাভ করার টার্গেট প্ল্যানার",
    secTargetProfitSubtitle: "আপনি কত টাকা লাভ করতে চান তা লিখুন, স্বয়ংক্রিয়ভাবে দেখে নিন কত পিস বা কত টাকার মাল বেচতে হবে",
    targetProfitLabel: "কত টাকা নিট লাভ করতে চান? (৳)",
    targetProfitRequiredQty: "কত পিস বিক্রি করতে হবে",
    targetProfitRequiredRevenue: "মোট কত টাকার বিক্রি লাগবে",
    targetProfitUnitMargin: "প্রতি পিসে অবশিষ্ট মার্জিন",
    targetProfitFeasibleNotice: "এই লাভ নিশ্চিত করতে হলে আপনাকে বিক্রি করতে হবে:",
    targetProfitInfeasibleNotice: "এই লাভে পৌঁছানো সম্ভব না! কারণ প্রতি পিসের বিক্রি দাম খরচের চেয়েও কম বা সমান। বিক্রি দাম বাড়ান অথবা খরচ কমান।",
    targetProfitAchievedStatus: "দারুণ! আপনার বর্তমান টার্গেটেই এই লাভ হয়ে যাচ্ছে।",
    targetProfitSurplusLabel: "টার্গেটের চেয়ে বেশি আছে",
    targetProfitShortfallLabel: "টার্গেটে পৌঁছাতে আরও বিক্রি লাগবে",
    netProfitTotalLabel: "সব খরচ বাদে নিট লাভ / (লস)",
    netProfitUnitLabel: "প্রতি পিসে নিট লাভ",

    // Section 6 — Decision snapshot & extended analysis
    secDecisionTitle: "সিদ্ধান্তের সারসংক্ষেপ",
    secDecisionSubtitle: "এই হিসাব আপনার ব্যবসার জন্য কী বলছে",
    verdictProfitTitle: "এই হিসাবে পণ্যটি লাভজনক।",
    verdictThinTitle: "লাভ খুবই কম — সামান্য পরিবর্তনেই লস হয়ে যেতে পারে।",
    verdictLossTitle: "এই হিসাবে পণ্যটি লস করছে।",
    verdictProfitBody: "বর্তমান দাম, বিক্রি ও খরচে আপনি লাভ করছেন।",
    verdictThinBody: "লাভ হচ্ছে, তবে নিরাপত্তার জায়গা কম। খরচ ও ছাড়ে নজর রাখুন।",
    verdictLossBody: "খরচ আয়ের চেয়ে বেশি। দাম বাড়ান, খরচ কমান বা বেশি বিক্রি করুন।",
    recBreakEvenLabel: "লস এড়াতে কমপক্ষে যত পিস বেচতে হবে",
    recBreakEvenHint: "এর কম বেচলে লস হবে",
    recMaxDiscountLabel: "সর্বোচ্চ যত % ছাড় দিতে পারবেন",
    recMaxDiscountHint: "এই ছাড়ে লাভ শূন্য হয়ে যাবে",
    recPaybackLabel: "বিনিয়োগ ফেরত পেতে সময়",
    recPaybackHint: "বর্তমান লাভের হিসাবে",
    recPaybackNever: "বর্তমান লাভে বিনিয়োগ ফেরত আসবে না",
    recCushionLabel: "বিক্রি যত % কমলেও লস হবে না",
    recCushionHint: "বিক্রি কতটা কমতে পারে",
    recTargetGapLabel: "টার্গেট লাভে পৌঁছাতে আরও যত পিস লাগবে",
    recTargetGapHint: "বর্তমান বিক্রির টার্গেটের তুলনায়",
    recCostShockLabel: "সব খরচ ১০% বাড়লে লাভ থাকবে",
    recCostShockHint: "ঝুঁকি পরীক্ষা",
    recProfitNowLabel: "এখন যেভাবে হিসাব, তাতে লাভ",
    kpiPayback: "বিনিয়োগ ফেরতের সময়",
    kpiMaxDiscount: "সর্বোচ্চ নিরাপদ ছাড়",
    kpiInventoryTurnover: "বছরে মাল কতবার ঘুরবে",
    kpiDailyTarget: "প্রতিদিন কত পিস বেচতে হবে",
    kpiAnnualizedRoi: "বছরের হিসাবে ROI",
    paybackNever: "এই লাভে ফেরত আসবে না",
    daysSuffix: "দিন",
    perYearSuffix: "বার",
    secSalesCashTitle: "বিক্রি, নগদ ও বিনিয়োগের হিসাব",
    rowBreakEvenNetPrice: "লস না হওয়ার আসল বিক্রি দাম (ছাড়ের পরে)",
    rowBreakEvenListPrice: "লস না হওয়ার তালিকা দাম (ছাড়ের আগে)",
    rowMaxDiscount: "সর্বোচ্চ নিরাপদ ছাড়",
    rowDiscountImpact: "ছাড় দিয়ে যে লাভ ছেড়ে দিচ্ছেন",
    rowPayback: "বিনিয়োগ ফেরত পেতে সময়",
    rowAnnualizedRoi: "বছরের হিসাবে ROI",
    rowInventoryTurnover: "বছরে মাল কতবার ঘুরছে",
    rowDaysInventory: "মাল হাতে থাকার দিন",
    rowDailyUnits: "প্রতিদিন কত পিস বেচতে হবে",
    rowDailyRevenue: "প্রতিদিন কত টাকার বিক্রি লাগবে",
    rowMonthlyUnits: "প্রতি মাসে কত পিস বেচতে হবে",
    rowMonthlyRevenue: "প্রতি মাসে কত টাকার বিক্রি লাগবে",
    rowSalesDropCushion: "লস শুরুর আগে বিক্রি কত কমতে পারে",
    rowCashInflow: "হাতে আসা নগদ",
    rowCashOutflow: "খরচে যাওয়া নগদ",
    rowCashProfit: "সব খরচের পরে হাতে থাকা নগদ",
    cashProfitNote: "এখানে সব খরচই নগদ খরচ, তাই হাতে থাকা নগদ আর নিট লাভ একই।",
    rowScenarioDown: "বিক্রি ২০% কমলে",
    rowScenarioBase: "এখন যেভাবে হিসাব করছেন",
    rowScenarioUp: "বিক্রি ২০% বাড়লে",
    rowCostShock: "সব খরচ ১০% বাড়লে",
    scenarioNote: "কম বিক্রির হিসাবে মাল আগেই কেনা ধরা হয়েছে। বেশি বিক্রির হিসাবে বাড়তি মাল কিনতে হবে।",
    inventoryTurnoverNote: "বছরের হিসাবে দেখানো হয়েছে, যাতে ভিন্ন সময়ের পণ্য তুলনা করা যায়।",
    dailyTargetNote: "আপনার বেছে নেওয়া সময়ের হিসাব অনুযায়ী।",
    units: "পিস",
    returnedAt: "পিস রিটার্ন @",
    disposedAs: "সমাধান:",
    netInventoryConsumed: "ব্যবহৃত পণ্যের কেনা দাম",
    collectedShippingIncome: "কাস্টমারের দেওয়া ডেলিভারি ফি",

    // Cost Row Items
    costHeadPrefix: "খরচের নাম",
    costHeadPlaceholder: "যেমন: ট্রাক ভাড়া, কুলি, পলি/বক্স, বিজ্ঞাপন...",
    costType: "খরচের ধরন",
    typeValue: "৳ নির্দিষ্ট টাকা",
    typePercent: "% পারসেন্টেজ",
    amountPerUnit: "প্রতি পিসের খরচ (৳)",
    amountTotal: "মোট খরচ (৳)",
    amountRate: "হার (%)",
    calculatedCost: "হিসাব অনুযায়ী খরচ:",
    subtotal: "উপমোট:",
    addCustomCost: "+ নতুন খরচের খাত যোগ করুন",
    itemsCount: "টি খরচ",
    itemCountSingular: "টি খরচ",
    modeNotice: "হিসাবের মোড",
    percentOfSelling: "বিক্রি দামের %",
    percentOfPurchase: "কেনা দামের %",
    perUnitSuffix: "/ পিস",
    returnedUnitSuffix: "/ ফেরত পিস",

    // Section 5/6 helper labels (single-language display)
    subCustomerReturn: "কাস্টমারের রিটার্ন বা অগ্রিম চার্জ",
    discountAppliedSuffix: "ডিসকাউন্ট বাদ দেওয়া হয়েছে",
    scrappedSuffix: "স্ক্র্যাপে বিক্রি",
    netEffectiveRevenue: "সব বাদে আসল বিক্রি আয়",
    baseLabel: "মূল দাম",
    extraLabel: "অতিরিক্ত খরচ",
    inventoryFullySold: "১০০% মাল ক্রেতার কাছে বিক্রি হয়েছে",
    lossWriteOff: "১০০% মালের দাম লোকসান",
    netScrapLossLabel: "স্ক্র্যাপে মোট লোকসান",
    grossMarginLabel: "গ্রস মার্জিন",
    deliveredUnitSuffix: "ডেলিভারি হওয়া পিস",
    unitMarginSuffix: "প্রতি পিসে লাভ",
    procLabel: "প্রসেসিং",
    courierLabel: "কুরিয়ার",
    dispLabel: "ফেলার খরচ",
    taxSub: "এআইটি, ভ্যাট, ট্রেড লাইসেন্স ফি",
    opexComposition: "বিক্রি + রিটার্ন + ট্যাক্স খরচ",
    ebitdaSub: "ইবিআইটিডিএ / পরিচালন লাভ",
    cogsOpexSub: "পণ্যের খরচ + পরিচালন খরচ",
    bepVolumeSub: "লাভ-লোকসান সমান হতে কত পিস বিক্রি লাগবে",
    safetyMarginSub: "লোকসান শুরুর আগে কতটা নিরাপদ আছেন",
    targetProfitGoalSub: "যত টাকা লাভ করতে চান",
    workingCapitalSub: "ব্যাচ চালাতে শুরুতে যত টাকা লাগবে",
    totalDisposalFeeLabel: "ফেলার মোট খরচ",
    lostInventoryLabel: "নষ্ট হওয়া মালের কেনা দাম",
    scrapProceedsLabel: "স্ক্র্যাপ থেকে পাওয়া টাকা",
    unitShort: "পিস",
    removeEntry: "খরচটি বাদ দিন",
    removeLevel: "লেভেলটি বাদ দিন",
  },
};

// --------------------------------------------------
// Group Model Definitions (Single Language Helpers)
// --------------------------------------------------

export const getSourcingGroups = (lang = "EN") => {
  const isBN = lang === "BN";
  return [
    {
      key: "sourcing_local",
      model: "local",
      title: isBN ? "দেশি বাজার থেকে কেনা" : "Local Sourcing Costs",
      description: isBN
        ? "ট্রাক ও পিকআপ ভাড়া, কুলি খরচ, হাট-বাজারের খাজনা, দালাল বা ব্রোকার কমিশন ও কোয়ালিটি চেক।"
        : "Transport, labor, market tolls, local commission, and quality sampling.",
    },
    {
      key: "sourcing_import",
      model: "import",
      title: isBN ? "বিদেশ থেকে আমদানি সংক্রান্ত খরচ" : "Import Sourcing Costs",
      description: isBN
        ? "এলসি কমিশন, কাস্টমস ট্যাক্স ও ডিউটি, পোর্ট ডেমারেজ চার্জ, সিঅ্যান্ডএফ এজেন্ট বিল ও শিপিং কন্টেইনার ভাড়া।"
        : "LC opening, customs duty, port charges, C&F agent, shipping freight, and inland transport.",
    },
    {
      key: "sourcing_manufacture",
      model: "manufacture",
      title: isBN ? "কারখানায় তৈরি ও উৎপাদনের খরচ" : "Manufacturing Costs",
      description: isBN
        ? "কারিগর বা শ্রমিকের মজুরি, বিদ্যুৎ-গ্যাস বিল, মেশিনের ক্ষয় ও মেরামত, প্রাথমিক প্যাকেট ও কারখানার অন্যান্য খরচ।"
        : "Direct wages, factory electricity/gas, machine maintenance, packaging, and overhead.",
    },
  ];
};

export const getStockingGroups = (lang = "EN") => {
  const isBN = lang === "BN";
  return [
    {
      key: "stocking_own",
      model: "own",
      title: isBN ? "নিজের গোডাউনের খরচ" : "Own Warehouse Costs",
      description: isBN
        ? "পৌরসভার ট্যাক্স, গোডাউনের কর্মচারী ও দারোয়ানের বেতন, বিদ্যুৎ বিল ও মালের ক্ষতি বাবদ বরাদ্দ।"
        : "Property taxes, staff salary, security guard, maintenance, utilities, and damage reserves.",
    },
    {
      key: "stocking_rent",
      model: "rent",
      title: isBN ? "ভাড়া গোডাউনের খরচ" : "Rented Warehouse Costs",
      description: isBN
        ? "প্রতি মাসের গোডাউন ভাড়া, মাল ওঠানো-নামানোর কুলি মজুরি, সার্ভিস চার্জ ও বিদ্যুৎ বিল।"
        : "Monthly warehouse lease, in-out handling labor, service charges, and fire insurance.",
    },
    {
      key: "stocking_3pl",
      model: "3pl",
      title: isBN ? "দারাজ / স্টেডফাস্ট ৩পিএল ফুলফিলমেন্ট" : "3PL / Marketplace Fulfillment",
      description: isBN
        ? "দারাজ মল বা ওয়্যারহাউস সেলফ ভাড়া, পিক-প্যাক ও মোড়কজাত লেবার, বারকোড স্টিকার চার্জ।"
        : "Marketplace storage fees (FBD/Daraz Mall), pick & pack handling, barcode tagging, and 3PL fees.",
    },
    {
      key: "stocking_spot",
      model: "spot",
      title: isBN ? "গোডাউন ছাড়া সরাসরি ডেলিভারি খরচ" : "On-spot / Cross-docking Costs",
      description: isBN
        ? "গাড়ি থেকে সরাসরি ডেলিভারির কুলি খরচ, পিকআপ ভ্যান অপেক্ষার ভাড়া ও প্যাকেট চেক খরচ।"
        : "Direct transfer labor, temporary holding van/pickup demurrage, and urgent sorting.",
    },
  ];
};

export const getSellingGroups = (lang = "EN") => {
  const isBN = lang === "BN";
  return [
    {
      key: "selling_retail",
      model: "retail",
      title: isBN ? "খুচরা ও অনলাইন বিক্রির খরচ" : "Retail & E-commerce Selling Costs",
      description: isBN
        ? "কুরিয়ার চার্জ (পাঠাও/স্টেডফাস্ট), বিকাশ/নগদ পেমেন্ট ফি, শপিং ব্যাগ ও বক্স, ফেসবুক-গুগল অ্যাড বুস্টিং।"
        : "Courier delivery (Steadfast/Pathao), MFS payment gateway fee, bags, and digital ad boosts.",
    },
    {
      key: "selling_bulk",
      model: "bulk",
      title: isBN ? "পাইকারি ও ডিলার বিক্রির খরচ" : "Bulk & Wholesale Distribution Costs",
      description: isBN
        ? "ডিলারের কমিশন, বড় ট্রাক ভাড়া, ট্রাকে মাল ওঠানোর কুলি মজুরি, সেলস রিপ্রেজেন্টেটিভ (SR) খরচ ও বাকির ঝুঁকি।"
        : "Dealer commission, full truck freight, loading labor, field sales officer (SR) TA/DA.",
    },
  ];
};

export const getReturnGroup = (lang = "EN") => {
  const isBN = lang === "BN";
  return {
    key: "returns",
    title: isBN ? "রিটার্ন হ্যান্ডলিং ও নতুন প্যাকেটের খরচ" : "Return Handling & Reprocessing Costs",
    description: isBN
      ? "কুরিয়ারের রিটার্ন পিকআপ চার্জ, রিটার্ন মালের ত্রুটি পরীক্ষা ও পরিষ্কার করা, নতুন বক্স ও পলি প্যাকেট খরচ।"
      : "Reverse courier pickup, quality inspection, sorting, cleaning, and box repacking.",
  };
};

// --------------------------------------------------
// Default Dataset for Bangladesh Business (EN & BN)
// --------------------------------------------------

export const getDefaultBDDataset = (mode = "total_qty", lang = "EN") => {
  const isPerUnit = mode === "per_unit";
  const isBN = lang === "BN";

  return {
    costInputMode: mode,
    formData: {
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
    },
    salesTargetDays: "monthly",
    productSource: "local",
    stockingModel: "rent",
    salesModel: "retail",
    returnDisposition: "resell_repack",
    bulkPrices: [
      {
        id: crypto.randomUUID(),
        name: isBN ? "ঢাকা পাইকারি বাজার (চকবাজার / মৌলভীবাজার)" : "Dhaka Wholesale Market",
        price: "850",
        mix: "60",
      },
      {
        id: crypto.randomUUID(),
        name: isBN ? "জেলা ডিলার ও মফস্বল নেটওয়ার্ক" : "District Dealers Network",
        price: "800",
        mix: "40",
      },
    ],
    costs: {
      // SOURCING GROUPS
      sourcing_local: isBN
        ? [
            createCost("আন্তঃজেলা ট্রাক ও পিকআপ ভাড়া", isPerUnit ? 5.5 : 5500, "value"),
            createCost("মাল ওঠানো-নামানোর কুলি মজুরি", isPerUnit ? 1.8 : 1800, "value"),
            createCost("হাট-বাজারের খাজনা ও ঘাট খরচ", isPerUnit ? 0.8 : 800, "value"),
            createCost("স্থানীয় কেনাকাটা বা ব্রোকার কমিশন", 2.0, "percent"),
            createCost("মালের কোয়ালিটি চেক ও স্যাম্পলিং", isPerUnit ? 1.2 : 1200, "value"),
          ]
        : [
            createCost("Truck & Inter-District Freight", isPerUnit ? 5.5 : 5500, "value"),
            createCost("Loading & Unloading Labor", isPerUnit ? 1.8 : 1800, "value"),
            createCost("Market Tolls & Ghat Charges", isPerUnit ? 0.8 : 800, "value"),
            createCost("Local Procurement Commission", 2.0, "percent"),
            createCost("Quality Inspection & Sampling", isPerUnit ? 1.2 : 1200, "value"),
          ],

      sourcing_import: isBN
        ? [
            createCost("এলসি কমিশন ও ব্যাংক চার্জ", 1.5, "percent"),
            createCost("কাস্টমস ট্যাক্স ও সম্পূরক শুল্ক", 25.0, "percent"),
            createCost("অগ্রিম আয়কর (AIT ও AT)", 5.0, "percent"),
            createCost("চট্টগ্রাম পোর্ট ও ডেমারেজ চার্জ", isPerUnit ? 9.5 : 9500, "value"),
            createCost("সিঅ্যান্ডএফ এজেন্টের বিল ও খরচ", 1.0, "percent"),
            createCost("শিপিং লাইন ও কন্টেইনার চার্জ", isPerUnit ? 14.0 : 14000, "value"),
            createCost("মেরিন ইন্স্যুরেন্স প্রিমিয়াম", 0.75, "percent"),
            createCost("বন্দর থেকে গোডাউন ট্রেইলার ভাড়া", isPerUnit ? 16.0 : 16000, "value"),
          ]
        : [
            createCost("LC Margin & Bank Commission", 1.5, "percent"),
            createCost("Customs Duty (CD, RD, SD)", 25.0, "percent"),
            createCost("Advance Income Tax (AIT & AT)", 5.0, "percent"),
            createCost("Chittagong Port & Demurrage Charges", isPerUnit ? 9.5 : 9500, "value"),
            createCost("C&F Agent Commission", 1.0, "percent"),
            createCost("Shipping Line & Container Detention", isPerUnit ? 14.0 : 14000, "value"),
            createCost("Marine Insurance Premium", 0.75, "percent"),
            createCost("Port to Warehouse Trailer Freight", isPerUnit ? 16.0 : 16000, "value"),
          ],

      sourcing_manufacture: isBN
        ? [
            createCost("কারখানা শ্রমিক ও কারিগরের সরাসরি মজুরি", isPerUnit ? 28.0 : 28000, "value"),
            createCost("বিদ্যুৎ, গ্যাস ও জেনারেটর ডিজেল বিল", isPerUnit ? 15.0 : 15000, "value"),
            createCost("মেশিনারিজ অবচয় ও সার্ভিসিং", 2.5, "percent"),
            createCost("প্রাথমিক কার্টন ও পলি প্যাকেট", isPerUnit ? 8.5 : 8500, "value"),
            createCost("সুপারভাইজার বেতন ও কারখানার খরচ", isPerUnit ? 7.5 : 7500, "value"),
            createCost("ওয়েস্টেজ বা কাঁচামাল অপচয় বরাদ্দ", 2.0, "percent"),
          ]
        : [
            createCost("Direct Factory Labor Wages", isPerUnit ? 28.0 : 28000, "value"),
            createCost("Factory Electricity, Gas & Diesel", isPerUnit ? 15.0 : 15000, "value"),
            createCost("Machine Depreciation & Maintenance", 2.5, "percent"),
            createCost("Primary Packaging & Cartons", isPerUnit ? 8.5 : 8500, "value"),
            createCost("Factory Supervisor & Security Overhead", isPerUnit ? 7.5 : 7500, "value"),
            createCost("Wastage & Scrap Allowance", 2.0, "percent"),
          ],

      // STOCKING GROUPS
      stocking_own: isBN
        ? [
            createCost("পৌরসভার ট্যাক্স ও গোডাউন মেরামত", isPerUnit ? 3.0 : 3000, "value"),
            createCost("গোডাউন স্টাফ ও নাইটগার্ডের বেতন", isPerUnit ? 14.0 : 14000, "value"),
            createCost("গোডাউনের বিদ্যুৎ ও পানির বিল", isPerUnit ? 3.5 : 3500, "value"),
            createCost("মালের ক্ষতি ও মেয়াদোত্তীর্ণ বরাদ্দ", 1.5, "percent"),
            createCost("কীটপতঙ্গ রোধ ও ওষুধ স্প্রে", isPerUnit ? 1.0 : 1000, "value"),
          ]
        : [
            createCost("Holding Tax & Property Maintenance", isPerUnit ? 3.0 : 3000, "value"),
            createCost("Warehouse Staff & Night Guard", isPerUnit ? 14.0 : 14000, "value"),
            createCost("Warehouse Electricity & Utilities", isPerUnit ? 3.5 : 3500, "value"),
            createCost("Damage & Expiry Reserve", 1.5, "percent"),
            createCost("Pest Control & Spray", isPerUnit ? 1.0 : 1000, "value"),
          ],

      stocking_rent: isBN
        ? [
            createCost("প্রতি মাসের গোডাউন ভাড়া", isPerUnit ? 18.0 : 18000, "value"),
            createCost("মালামাল ওঠা-নামা ও সাজানোর কুলি খরচ", isPerUnit ? 4.0 : 4000, "value"),
            createCost("সার্ভিস চার্জ ও দারোয়ান খরচ", isPerUnit ? 2.5 : 2500, "value"),
            createCost("গোডাউনের বিদ্যুৎ বিল", isPerUnit ? 2.2 : 2200, "value"),
            createCost("অগ্নি ও সাধারণ বীমা", 0.5, "percent"),
          ]
        : [
            createCost("Monthly Godown Rent", isPerUnit ? 18.0 : 18000, "value"),
            createCost("In/Out Movement & Stacking Labor", isPerUnit ? 4.0 : 4000, "value"),
            createCost("Service Charge & Security Guard", isPerUnit ? 2.5 : 2500, "value"),
            createCost("Godown Electricity Bill", isPerUnit ? 2.2 : 2200, "value"),
            createCost("Fire & Burglary Insurance", 0.5, "percent"),
          ],

      stocking_3pl: isBN
        ? [
            createCost("ওয়্যারহাউসের তাক বা সেলফ ভাড়া", isPerUnit ? 4.5 : 4500, "value"),
            createCost("অর্ডার পিকিং, প্যাকিং ও হ্যান্ডলিং চার্জ", isPerUnit ? 6.0 : 6000, "value"),
            createCost("বারকোড স্টিকার ও লেবেলিং চার্জ", isPerUnit ? 1.5 : 1500, "value"),
            createCost("ইনভেন্টরি ইন-বাউন্ড প্রসেসিং ফি", isPerUnit ? 2.0 : 2000, "value"),
          ]
        : [
            createCost("Warehouse Shelf Storage Fee", isPerUnit ? 4.5 : 4500, "value"),
            createCost("Pick, Pack & Order Handling", isPerUnit ? 6.0 : 6000, "value"),
            createCost("Barcode & Packaging Labeling", isPerUnit ? 1.5 : 1500, "value"),
            createCost("Inventory Inbound Processing", isPerUnit ? 2.0 : 2000, "value"),
          ],

      stocking_spot: isBN
        ? [
            createCost("সরাসরি স্থানান্তর কুলি খরচ", isPerUnit ? 2.5 : 2500, "value"),
            createCost("পিকআপ ভ্যান অপেক্ষার ভাড়া", isPerUnit ? 3.5 : 3500, "value"),
            createCost("জরুরি সর্টিং ও কার্টন রি-টেপিং", isPerUnit ? 1.5 : 1500, "value"),
          ]
        : [
            createCost("Cross-Docking Transfer Labor", isPerUnit ? 2.5 : 2500, "value"),
            createCost("Temporary Holding Pickup Fare", isPerUnit ? 3.5 : 3500, "value"),
            createCost("Urgent Sorting & Re-taping", isPerUnit ? 1.5 : 1500, "value"),
          ],

      // SELLING GROUPS
      selling_retail: isBN
        ? [
            createCost("কুরিয়ার ডেলিভারি চার্জ (পাঠাও / স্টেডফাস্ট)", isPerUnit ? 7.5 : 7500, "value"),
            createCost("বিকাশ ও নগদ পেমেন্ট গেটওয়ে ফি (১.৫%)", 1.5, "percent"),
            createCost("শপিং ব্যাগ ও ডেলিভারি বক্স", isPerUnit ? 2.5 : 2500, "value"),
            createCost("ফেসবুক ও গুগল অ্যাড বুস্টিং", isPerUnit ? 9.0 : 9000, "value"),
            createCost("সেলস এক্সিকিউটিভ কমিশন", 2.0, "percent"),
          ]
        : [
            createCost("Courier Delivery (Steadfast / Pathao)", isPerUnit ? 7.5 : 7500, "value"),
            createCost("MFS Gateway Fee (bKash/Nagad 1.5%)", 1.5, "percent"),
            createCost("Shopping Bags & Packaging Box", isPerUnit ? 2.5 : 2500, "value"),
            createCost("Digital Ad Boosts (Facebook / Google)", isPerUnit ? 9.0 : 9000, "value"),
            createCost("Sales Executive Commission", 2.0, "percent"),
          ],

      selling_bulk: isBN
        ? [
            createCost("ডিলার কমিশন ও বিশেষ ছাড়", 5.0, "percent"),
            createCost("আন্তঃজেলা বড় ট্রাক ভাড়া", isPerUnit ? 14.0 : 14000, "value"),
            createCost("ডিলারের ট্রাকে মাল লোডিং কুলি খরচ", isPerUnit ? 3.5 : 3500, "value"),
            createCost("সেলস অফিসার (SR) যাতায়াত ও টিএ/ডিএ", 2.0, "percent"),
            createCost("বাকির ঝুঁকি ও ব্যাড ডেট প্রভিশন", 1.0, "percent"),
          ]
        : [
            createCost("Dealer Commission & Trade Promotion", 5.0, "percent"),
            createCost("Inter-District Full Truck Freight", isPerUnit ? 14.0 : 14000, "value"),
            createCost("Loading to Dealer Transport Labor", isPerUnit ? 3.5 : 3500, "value"),
            createCost("Field Sales Officer (SR) TA/DA", 2.0, "percent"),
            createCost("Bad Debt & Credit Risk Reserve", 1.0, "percent"),
          ],

      // RETURNS
      returns: isBN
        ? [
            createCost("রিটার্ন কুরিয়ার পিকআপ ডেলিভারি চার্জ", isPerUnit ? 2.8 : 2800, "value"),
            createCost("রিটার্ন মাল পরীক্ষা, বাছাই ও পরিষ্কার লেবার", isPerUnit ? 1.2 : 1200, "value"),
            createCost("নতুন বক্স ও পলি প্যাকেট লাগানো", isPerUnit ? 1.8 : 1800, "value"),
          ]
        : [
            createCost("Reverse Courier Pickup Fee", isPerUnit ? 2.8 : 2800, "value"),
            createCost("Testing, Sorting & Cleaning Labor", isPerUnit ? 1.2 : 1200, "value"),
            createCost("Repackaging Box & Poly Replacement", isPerUnit ? 1.8 : 1800, "value"),
          ],
    },
  };
};

// --------------------------------------------------
// Main Hook
// --------------------------------------------------

const useUnifiedProfitROI = () => {
  const { showToast, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);

  // Language state: 'EN' or 'BN' (Single language only)
  const [lang, setLang] = useState("EN");

  // Translation helper
  const t = useCallback(
    (key) => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS.EN;
      return dict[key] || TRANSLATIONS.EN[key] || key;
    },
    [lang],
  );

  // Group definitions matching the current single language
  const SOURCING_GROUPS = useMemo(() => getSourcingGroups(lang), [lang]);
  const STOCKING_GROUPS = useMemo(() => getStockingGroups(lang), [lang]);
  const SELLING_GROUPS = useMemo(() => getSellingGroups(lang), [lang]);
  const RETURN_GROUP = useMemo(() => getReturnGroup(lang), [lang]);

  // Load initial Bangladesh default business dataset
  const defaults = useMemo(() => getDefaultBDDataset("total_qty", "EN"), []);

  // Cost entry mode: 'total_qty' (Total for target volume) vs 'per_unit' (Per each unit)
  const [costInputMode, setCostInputMode] = useState(defaults.costInputMode);

  const [formData, setFormData] = useState(defaults.formData);
  const [formErrors, setFormErrors] = useState({});

  // Model selections
  const [salesTargetDays, setSalesTargetDays] = useState(defaults.salesTargetDays);
  const [productSource, setProductSource] = useState(defaults.productSource);
  const [stockingModel, setStockingModel] = useState(defaults.stockingModel);
  const [salesModel, setSalesModel] = useState(defaults.salesModel);
  const [returnDisposition, setReturnDisposition] = useState(defaults.returnDisposition);

  // Dynamic cost entries group-wise
  const [costs, setCosts] = useState(defaults.costs);

  // Bulk price levels
  const [bulkPrices, setBulkPrices] = useState(defaults.bulkPrices);

  // Output time horizon for Section 06 display (null = same as input)
  const [outputTimeHorizon, setOutputTimeHorizon] = useState(null);

  // ROI view mode: 'total' or 'per_unit'
  const [roiViewMode, setRoiViewMode] = useState("total");

  // Helper to convert amounts between time horizons
  const getHorizonMultiplier = useCallback((from, to) => {
    const fromDays = HORIZON_DAYS[from] || 30;
    const toDays = HORIZON_DAYS[to] || 30;
    return toDays / fromDays;
  }, []);

  // --------------------------------------------------
  // Active Group Key Resolvers
  // --------------------------------------------------

  const activeSourcingKey = `sourcing_${productSource}`;
  const activeStockingKey = `stocking_${stockingModel}`;
  const activeSellingKey = `selling_${salesModel}`;

  // --------------------------------------------------
  // Cost Input Mode Switching with Smart Value Conversion
  // --------------------------------------------------

  const handleCostInputModeChange = useCallback(
    (newMode) => {
      if (newMode === costInputMode) return;
      const qty = number(formData?.sales_qty);
      if (qty <= 0) {
        setCostInputMode(newMode);
        return;
      }

      setCosts((prevCosts) => {
        const next = {};
        Object.keys(prevCosts).forEach((groupKey) => {
          next[groupKey] = prevCosts[groupKey].map((item) => {
            if (
              item.type === "percent" ||
              item.amount === "" ||
              isNaN(Number(item.amount))
            ) {
              return item;
            }
            const numVal = Number(item.amount);
            if (newMode === "per_unit") {
              const converted = numVal / qty;
              return {
                ...item,
                amount:
                  converted % 1 === 0
                    ? String(converted)
                    : String(Number(converted.toFixed(2))),
              };
            } else {
              const converted = numVal * qty;
              return {
                ...item,
                amount:
                  converted % 1 === 0
                    ? String(converted)
                    : String(Number(converted.toFixed(2))),
              };
            }
          });
        });
        return next;
      });

      setCostInputMode(newMode);
    },
    [costInputMode, formData?.sales_qty],
  );

  // --------------------------------------------------
  // Cost helpers (Work on any group key)
  // --------------------------------------------------

  const updateCosts = useCallback((stageKey, items) => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: items,
    }));
  }, []);

  const updateCostField = useCallback((stageKey, id, field, value) => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: (prev[stageKey] || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  }, []);

  const addCost = useCallback(
    (stageKey, defaultName = "", defaultAmount = "", defaultType = "value") => {
      setCosts((prev) => ({
        ...prev,
        [stageKey]: [
          ...(prev[stageKey] || []),
          createCost(defaultName, defaultAmount, defaultType),
        ],
      }));
    },
    [],
  );

  const removeCost = useCallback((stageKey, id) => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: (prev[stageKey] || []).filter((item) => item.id !== id),
    }));
  }, []);

  // --------------------------------------------------
  // Bulk price helpers
  // --------------------------------------------------

  const updateBulkPrice = useCallback((id, key, value) => {
    setBulkPrices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  }, []);

  const addBulkPrice = useCallback(() => {
    setBulkPrices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: lang === "BN" ? `মূল্য স্তর ${prev.length + 1}` : `Price Tier ${prev.length + 1}`,
        price: "",
        mix: "0",
      },
    ]);
  }, [lang]);

  const removeBulkPrice = useCallback((id) => {
    setBulkPrices((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // --------------------------------------------------
  // Form change
  // --------------------------------------------------

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // --------------------------------------------------
  // Calculations (Dynamic for Active Selected Models & Modes)
  // --------------------------------------------------

  const calculation = useMemo(
    () =>
      computeProfitROI({
        formData,
        costs,
        bulkPrices,
        productSource,
        stockingModel,
        salesModel,
        returnDisposition,
        costInputMode,
        salesTargetDays,
      }),
    [
      formData,
      costs,
      bulkPrices,
      productSource,
      stockingModel,
      salesModel,
      returnDisposition,
      costInputMode,
      salesTargetDays,
    ],
  );

  const getStageTotal = useCallback(
    (stageKey) => {
      const items = costs[stageKey] || [];
      const qty = number(formData?.sales_qty);
      const unitCost = number(formData?.unit_purchase_cost);
      const discountPercent = Math.min(100, number(formData?.discount_percent));
      let sp = number(formData?.retail_selling_price);
      if (salesModel === "bulk") {
        const mixTotal = bulkPrices.reduce(
          (sum, item) => sum + number(item.mix),
          0,
        );
        sp =
          mixTotal > 0
            ? bulkPrices.reduce(
                (sum, item) => sum + number(item.price) * number(item.mix),
                0,
              ) / mixTotal
            : 0;
      }
      const netSp = sp * (1 - discountPercent / 100);

      let stageType = "sourcing";
      if (stageKey.startsWith("stocking")) stageType = "stocking";
      else if (stageKey.startsWith("selling")) stageType = "selling";
      else if (stageKey === "returns") stageType = "returns";

      const returnedQty = Math.min(qty, number(formData?.returned_qty));
      const effectiveSalesQty = stageKey === "returns" ? returnedQty : qty;

      if (stageKey === "returns" && returnedQty === 0) {
        return 0;
      }

      return items.reduce((sum, item) => {
        const res = resolveCost(item, {
          costInputMode,
          salesQty: effectiveSalesQty,
          unitPurchaseCost: unitCost,
          sellingPrice: netSp,
          stageType,
        });
        return sum + res.totalAmount;
      }, 0);
    },
    [costs, costInputMode, formData, salesModel, bulkPrices],
  );

  const getStageUnitCost = useCallback(
    (stageKey) => {
      const qty = number(formData?.sales_qty);
      const returnedQty = Math.min(qty, number(formData?.returned_qty));
      const effectiveQty = stageKey === "returns" ? returnedQty : qty;
      const total = getStageTotal(stageKey);
      return effectiveQty > 0 ? total / effectiveQty : 0;
    },
    [getStageTotal, formData?.sales_qty, formData?.returned_qty],
  );

  // --------------------------------------------------
  // Language Change & Load Defaults
  // --------------------------------------------------

  const handleLoadDefaultBD = useCallback(
    (targetLang = lang) => {
      const fresh = getDefaultBDDataset(costInputMode, targetLang);
      setFormData(fresh.formData);
      setSalesTargetDays(fresh.salesTargetDays);
      setProductSource(fresh.productSource);
      setStockingModel(fresh.stockingModel);
      setSalesModel(fresh.salesModel);
      setReturnDisposition(fresh.returnDisposition);
      setBulkPrices(fresh.bulkPrices);
      setCosts(fresh.costs);
      setFormErrors({});
      showToast(
        targetLang === "BN"
          ? "বাংলাদেশি ডিফল্ট লোড করা হয়েছে"
          : "Loaded Default BD Units & Costs",
        "info",
      );
    },
    [costInputMode, lang, showToast],
  );

  const setLanguage = useCallback(
    (newLang) => {
      if (newLang === lang) return;
      setLang(newLang);

      // Translate default price tier names
      setBulkPrices((prev) =>
        prev.map((item, idx) => {
          if (newLang === "BN") {
            if (item.name.includes("Dhaka Wholesale") || item.name.includes("ঢাকা পাইকারি")) {
              return { ...item, name: "ঢাকা পাইকারি বাজার (চকবাজার / মৌলভীবাজার)" };
            }
            if (item.name.includes("District Dealers") || item.name.includes("জেলা ডিলার")) {
              return { ...item, name: "জেলা ডিলার ও আউটস্টেশন নেটওয়ার্ক" };
            }
            if (item.name.startsWith("Price Tier")) {
              return { ...item, name: `মূল্য স্তর ${idx + 1}` };
            }
          } else {
            if (item.name.includes("ঢাকা পাইকারি") || item.name.includes("Dhaka Wholesale")) {
              return { ...item, name: "Dhaka Wholesale Market" };
            }
            if (item.name.includes("জেলা ডিলার") || item.name.includes("District Dealers")) {
              return { ...item, name: "District Dealers Network" };
            }
            if (item.name.startsWith("মূল্য স্তর")) {
              return { ...item, name: `Price Tier ${idx + 1}` };
            }
          }
          return item;
        }),
      );

      // Translate cost item names if matching defaults
      const enCosts = getDefaultBDDataset(costInputMode, "EN").costs;
      const bnCosts = getDefaultBDDataset(costInputMode, "BN").costs;
      setCosts((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((groupKey) => {
          const fromList = newLang === "BN" ? enCosts[groupKey] || [] : bnCosts[groupKey] || [];
          const toList = newLang === "BN" ? bnCosts[groupKey] || [] : enCosts[groupKey] || [];
          next[groupKey] = (next[groupKey] || []).map((item) => {
            const matchIndex = fromList.findIndex((def) => def.name === item.name);
            if (matchIndex !== -1 && toList[matchIndex]) {
              return { ...item, name: toList[matchIndex].name };
            }
            return item;
          });
        });
        return next;
      });

      showToast(
        newLang === "BN" ? "ভাষা পরিবর্তন: বাংলা" : "Language switched to English",
        "info",
      );
    },
    [lang, costInputMode, showToast],
  );

  const handleCancel = useCallback(() => {
    handleLoadDefaultBD(lang);
  }, [handleLoadDefaultBD, lang]);

  const handleSubmit = useCallback(
    async (extraData) => {
      try {
        setIsBusy(true);
        const payload = {
          ...formData,
          ...extraData,
          language: lang,
          cost_input_mode: costInputMode,
          sales_target_period: salesTargetDays,
          sourcing_model: productSource,
          stocking_model: stockingModel,
          sales_model: salesModel,
          return_disposition: returnDisposition,
          bulk_prices: bulkPrices,
          costs,
          calculation,
        };
        showToast(
          lang === "BN"
            ? "হিসাব সফলভাবে সংরক্ষিত হয়েছে"
            : "Calculations saved successfully",
          "success",
        );
        return payload;
      } catch (error) {
        showToast(error?.message || "Failed to process calculations", "danger");
      } finally {
        setIsBusy(false);
      }
    },
    [
      formData,
      lang,
      costInputMode,
      salesTargetDays,
      productSource,
      stockingModel,
      salesModel,
      returnDisposition,
      bulkPrices,
      costs,
      calculation,
      setIsBusy,
      showToast,
    ],
  );

  return {
    isBusy,
    pgView,
    setPgView,
    readOnly,
    setReadOnly,
    stopEdit,
    setStopEdit,
    // Language
    lang,
    setLanguage,
    t,
    // Cost entry mode ('total_qty' vs 'per_unit')
    costInputMode,
    setCostInputMode,
    handleCostInputModeChange,
    resolveCost,
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    // Model state
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
    // Active group keys
    activeSourcingKey,
    activeStockingKey,
    activeSellingKey,
    // Cost state & handlers
    costs,
    setCosts,
    updateCosts,
    updateCostField,
    addCost,
    removeCost,
    getStageTotal,
    getStageUnitCost,
    SOURCING_GROUPS,
    STOCKING_GROUPS,
    SELLING_GROUPS,
    RETURN_GROUP,
    // Bulk price state & handlers
    bulkPrices,
    setBulkPrices,
    updateBulkPrice,
    addBulkPrice,
    removeBulkPrice,
    // Output display controls
    outputTimeHorizon,
    setOutputTimeHorizon,
    roiViewMode,
    setRoiViewMode,
    getHorizonMultiplier,
    // Calculation result & helpers
    calculation,
    money,
    number,
    // Actions
    handleChange,
    handleLoadDefaultBD,
    handleResetToBDDefault: handleLoadDefaultBD,
    handleCancel,
    handleSubmit,
  };
};

export default useUnifiedProfitROI;
