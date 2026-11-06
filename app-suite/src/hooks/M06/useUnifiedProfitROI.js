import { useState, useMemo, useCallback } from "react";
import { useUI } from "@/context/AppUIContext.jsx";

// --------------------------------------------------
// Helpers & Formatting
// --------------------------------------------------

export const number = (value) => Math.max(0, Number(value) || 0);

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
    pageTitle: "Unified Profit / ROI Calculator",
    pageSubtitle: "Simulate margins, markups, costs and profitability across stages",
    loadBDDefaults: "Load Default BD Units",
    resetCancel: "Reset / Cancel",
    saveCalculation: "Save Calculation",
    cancel: "Cancel",

    // Section 1
    sec1Title: "01 · Sales Target & Calculation Basis",
    costBasisLabel: "Cost Calculation & Entry Basis",
    costBasisTotal: "Total for Target Qty (Full Batch)",
    costBasisUnit: "Per Unit Wise (Single Unit)",
    costBasisDescUnit: "Per Unit Wise: Fixed monetary entries (৳) apply to 1 unit. Total cost is multiplied by Sales Target Qty.",
    costBasisDescTotal: "Total for Target Qty: Fixed monetary entries (৳) apply to the full sales volume. Unit cost is divided by Sales Target Qty.",
    costBasisPercentNote: "Percentage entries (%) calculate dynamically based on unit price regardless of mode.",
    timeHorizonLabel: "Target Time Horizon",
    freqDaily: "Daily",
    freqWeekly: "Weekly",
    freqMonthly: "Monthly",
    freqHalfYearly: "Half-Yearly",
    freqYearly: "Yearly",
    salesQtyLabel: "Sales Target Quantity",
    profitMarginLabel: "Target Profit Margin (%)",
    discountLabel: "Planned Discount (%)",
    otherTaxLabel: "Taxes & Levies (৳)",

    // Section 2
    sec2Title: "02 · Sourcing Model & Costs",
    sourceModelLabel: "Source Model Selection",
    srcLocal: "Local Sourcing",
    srcImport: "International Import",
    srcManufacture: "Own Manufacturing",
    unitCostLabel: "Base Purchase Cost / Unit (৳)",
    productionCostLabel: "Base Production Cost / Unit (৳)",

    // Section 3
    sec3Title: "03 · Stocking Model & Costs",
    stockingModelLabel: "Stocking Model Selection",
    stockOwn: "Own Warehouse",
    stockRent: "Rented Warehouse",
    stockSpot: "On Spot / No Stock",

    // Section 4
    sec4Title: "04 · Selling Model & Costs",
    salesModelLabel: "Sales Channel Selection",
    sellRetail: "Retail / E-commerce",
    sellBulk: "Bulk / Wholesale",
    retailPriceLabel: "Retail Selling Price / Unit (৳)",
    bulkTiersTitle: "Bulk Price Tiers & Sales Mix",
    tierNameLabel: "Price Tier",
    tierPriceLabel: "Selling Price (৳)",
    tierMixLabel: "Sales Share (%)",
    addPriceTier: "Add Price Level",
    bulkMixNote: "Total sales mix across tiers should equal 100%. Weighted average price is calculated.",
    deliveryIncomeLabel: "Delivery Income Collected (৳)",

    // Section 5
    sec5Title: "05 · Return Management",
    returnedQtyLabel: "Expected Returned Quantity",
    returnDispLabel: "Return Disposition",
    dispResell: "Resell",
    dispRepack: "Repack / Repair",
    dispScrap: "Scrap",
    dispDispose: "Dispose",
    salvageValueLabel: "Scrap / Salvage Value (৳)",

    // Section 6
    sec6Title: "06 · Profit & ROI Summary",
    kpiNetRevenue: "Net Revenue",
    kpiTotalExpenses: "Total Expenses",
    kpiNetProfit: "Net Profit / Loss",
    kpiProfitMargin: "Profit Margin",
    kpiRoi: "ROI",
    kpiMarkup: "Cost Markup",
    kpiUnitInventoryCost: "Unit Inventory Cost",
    kpiTargetPrice: "Target Selling Price",
    breakdownTitle: "Unit Economics & Comprehensive Breakdown",
    rowSalesQty: "Sales Target Quantity",
    rowNetQty: "Net Quantity (After Returns)",
    rowSourcingTotal: "Sourcing Total",
    rowStockingTotal: "Stocking Total",
    rowSellingTotal: "Selling Total",
    rowReturnCosts: "Return Processing Costs",
    rowRefundAmount: "Customer Refund Amount",
    rowRecoveredCost: "Recovered Inventory Value",
    rowLostCost: "Lost Inventory Cost (Unrecoverable)",
    rowCogs: "Cost of Goods Sold (COGS)",
    rowTaxes: "Taxes & Levies",
    rowDeliveryIncome: "Customer Delivery Income",
    netProfitTotalLabel: "Net Profit / (Loss)",
    netProfitUnitLabel: "Net per unit",

    // Cost Row Items
    costHeadName: "Cost Head Name",
    costType: "Cost Type",
    typeValue: "৳ Value",
    typePercent: "% Rate",
    amountPerUnit: "Amount / Unit (৳)",
    amountTotal: "Total Amount (৳)",
    amountRate: "Rate (%)",
    calculatedCost: "Calculated Cost",
    subtotal: "Subtotal",
    addCustomCost: "Add Custom Cost Field",
    itemsCount: "items",
    modeNotice: "Mode",
    percentOfSelling: "% of Selling",
    percentOfPurchase: "% of Purchase",
  },

  BN: {
    pageTitle: "প্রফিট ও আরওআই ক্যালকুলেটর",
    pageSubtitle: "পণ্য সংগ্রহ, গুদামজাতকরণ ও বিক্রয়ের বিভিন্ন স্তরে মুনাফা ও ব্যয়ের হিসাব",
    loadBDDefaults: "বাংলাদেশি ডিফল্ট লোড করুন",
    resetCancel: "রিসেট / বাতিল",
    saveCalculation: "হিসাব সংরক্ষণ করুন",
    cancel: "বাতিল",

    // Section 1
    sec1Title: "০১ · বিক্রয় লক্ষ্যমাত্রা ও ব্যয়ের ভিত্তি",
    costBasisLabel: "ব্যয় নির্ধারণ ও গণনার ভিত্তি",
    costBasisTotal: "মোট লক্ষ্যমাত্রা ব্যাচ ভিত্তিক",
    costBasisUnit: "প্রতি একক / ইউনিট ভিত্তিক",
    costBasisDescUnit: "প্রতি ইউনিট ভিত্তিক: নির্দিষ্ট টাকার ব্যয় (৳) প্রতিটি একক পণ্যের জন্য প্রযোজ্য। মোট খরচ লক্ষ্যমাত্রার সাথে গুণ হবে।",
    costBasisDescTotal: "মোট লক্ষ্যমাত্রা ব্যাচ ভিত্তিক: নির্দিষ্ট টাকার ব্যয় (৳) পুরো ব্যাচের মোট খরচ। একক খরচ পেতে লক্ষ্যমাত্রা দিয়ে ভাগ হবে।",
    costBasisPercentNote: "শতকরা ব্যয়ের হার (%) স্বয়ংক্রিয়ভাবে একক পণ্যের মূল্যের ওপর ভিত্তি করে হিসাব করা হয়।",
    timeHorizonLabel: "সময়কাল নির্বাচন",
    freqDaily: "দৈনিক",
    freqWeekly: "সাপ্তাহিক",
    freqMonthly: "মাসিক",
    freqHalfYearly: "অর্ধ-বার্ষিক",
    freqYearly: "বার্ষিক",
    salesQtyLabel: "বিক্রয় লক্ষ্যমাত্রা (একক সংখ্যা)",
    profitMarginLabel: "কাঙ্ক্ষিত মুনাফার হার (%)",
    discountLabel: "পরিকল্পিত মূল্যছাড় (%)",
    otherTaxLabel: "কর ও পৌর ফি (৳)",

    // Section 2
    sec2Title: "০২ · পণ্য সংগ্রহ মডেল ও ব্যয়",
    sourceModelLabel: "পণ্য সংগ্রহের উৎস",
    srcLocal: "স্থানীয় ক্রয়",
    srcImport: "আন্তর্জাতিক আমদানি",
    srcManufacture: "নিজস্ব উৎপাদন",
    unitCostLabel: "একক ক্রয়মূল্য (৳)",
    productionCostLabel: "একক উৎপাদন খরচ (৳)",

    // Section 3
    sec3Title: "০৩ · মজুদ ও গুদাম পরিচালন ব্যয়",
    stockingModelLabel: "গুদাম মডেল নির্বাচন",
    stockOwn: "নিজস্ব গুদাম",
    stockRent: "ভাড়া গুদাম",
    stockSpot: "অন-স্পট / সরাসরি স্থানান্তর",

    // Section 4
    sec4Title: "০৪ · বিক্রয় ও বিপণন চ্যানেল ব্যয়",
    salesModelLabel: "বিক্রয় চ্যানেল নির্বাচন",
    sellRetail: "খুচরা ও অনলাইন বিক্রয়",
    sellBulk: "পাইকারি ও ডিলার চ্যানেল",
    retailPriceLabel: "একক খুচরা বিক্রয়মূল্য (৳)",
    bulkTiersTitle: "পাইকারি দর ও বিক্রয়ের মিশ্রণ",
    tierNameLabel: "মূল্য স্তর",
    tierPriceLabel: "বিক্রয়দর (৳)",
    tierMixLabel: "বিক্রয়ের হার (%)",
    addPriceTier: "নতুন মূল্য স্তর যোগ করুন",
    bulkMixNote: "সকল স্তরের বিক্রয়ের অনুপাতের যোগফল ১০০% হতে হবে। ভারিত গড় দর হিসাব করা হবে।",
    deliveryIncomeLabel: "সংগৃহীত ডেলিভারি ফি (৳)",

    // Section 5
    sec5Title: "০৫ · পণ্য ফেরত ও ক্ষতিপূরণ ব্যবস্থাপনা",
    returnedQtyLabel: "প্রত্যাশিত ফেরত পণ্যের সংখ্যা",
    returnDispLabel: "ফেরত পণ্যের ব্যবস্থাপনা",
    dispResell: "পুনর্বিক্রয়",
    dispRepack: "মেরামত ও পুনরায় প্যাকিং",
    dispScrap: "স্ক্র্যাপ হিসেবে বিক্রয়",
    dispDispose: "সম্পূর্ণ বিনষ্টকরণ",
    salvageValueLabel: "স্ক্র্যাপ পুনরুদ্ধার মূল্য (৳)",

    // Section 6
    sec6Title: "০৬ · মুনাফা ও বিনিয়োগের রিটার্ন (আরওআই)",
    kpiNetRevenue: "নিট বিক্রয় আয়",
    kpiTotalExpenses: "মোট পরিচালন ব্যয়",
    kpiNetProfit: "নিট লাভ / লোকসান",
    kpiProfitMargin: "মুনাফার হার",
    kpiRoi: "বিনিয়োগের রিটার্ন (ROI)",
    kpiMarkup: "খরচের মার্কআপ",
    kpiUnitInventoryCost: "একক মজুদ ব্যয়",
    kpiTargetPrice: "প্রয়োজনীয় বিক্রয়দর",
    breakdownTitle: "একক ও সামগ্রিক আর্থিক বিবরণী",
    rowSalesQty: "বিক্রয় লক্ষ্যমাত্রা",
    rowNetQty: "প্রকৃত কার্যকর বিক্রয় (ফেরত বাদে)",
    rowSourcingTotal: "পণ্য সংগ্রহের মোট ব্যয়",
    rowStockingTotal: "গুদাম ও মজুদ ব্যয়",
    rowSellingTotal: "বিক্রয় ও বিপণন ব্যয়",
    rowReturnCosts: "পণ্য ফেরত প্রক্রিয়াকরণ ব্যয়",
    rowRefundAmount: "গ্রাহককে মূল্য ফেরত",
    rowRecoveredCost: "পুনরুদ্ধারকৃত মজুদ মূল্য",
    rowLostCost: "অপচয়কৃত অবিক্রয়যোগ্য ক্ষতি",
    rowCogs: "বিক্রীত পণ্যের প্রকৃত ব্যয় (COGS)",
    rowTaxes: "কর ও ফি",
    rowDeliveryIncome: "ডেলিভারি ফি বাবদ আয়",
    netProfitTotalLabel: "নিট লাভ / (ক্ষতি)",
    netProfitUnitLabel: "একক প্রতি নিট লাভ",

    // Cost Row Items
    costHeadName: "ব্যয়ের খাতের নাম",
    costType: "ব্যয়ের ধরন",
    typeValue: "৳ নির্দিষ্ট টাকা",
    typePercent: "% শতকরা হার",
    amountPerUnit: "একক ব্যয় (৳)",
    amountTotal: "মোট ব্যয় (৳)",
    amountRate: "শতকরা হার (%)",
    calculatedCost: "নির্ধারিত ব্যয়",
    subtotal: "উপমোট",
    addCustomCost: "নতুন ব্যয়ের খাত যোগ করুন",
    itemsCount: "টি খাত",
    modeNotice: "মোড",
    percentOfSelling: "বিক্রয়মূল্যের %",
    percentOfPurchase: "ক্রয়মূল্যের %",
  },
};

// --------------------------------------------------
// Cost Resolver Function
// --------------------------------------------------

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
  } else {
    if (costInputMode === "per_unit") {
      const unitAmount = raw;
      const totalAmount = unitAmount * qty;
      return {
        unitAmount,
        totalAmount,
        rate: 0,
        isPercent: false,
      };
    } else {
      const totalAmount = raw;
      const unitAmount = qty > 0 ? totalAmount / qty : 0;
      return {
        unitAmount,
        totalAmount,
        rate: 0,
        isPercent: false,
      };
    }
  }
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
      title: isBN ? "স্থানীয় ক্রয় সংক্রান্ত ব্যয়" : "Local Sourcing Costs",
      description: isBN
        ? "পরিবহন, লোডিং লেবার, হাট খাজনা, স্থানীয় ব্রোকারেজ ও স্যাম্পলিং।"
        : "Transport, labor, market tolls, local commission, and quality sampling.",
    },
    {
      key: "sourcing_import",
      model: "import",
      title: isBN ? "আমদানি সংক্রান্ত শুল্ক ও ব্যয়" : "Import Sourcing Costs",
      description: isBN
        ? "এলসি কমিশন, কাস্টমস শুল্ক, পোর্ট চার্জ, সিঅ্যান্ডএফ এজেন্ট ও শিপিং লাইন ফি।"
        : "LC opening, customs duty, port charges, C&F agent, shipping freight, and inland transport.",
    },
    {
      key: "sourcing_manufacture",
      model: "manufacture",
      title: isBN ? "উৎপাদন ও কারখানা ব্যয়" : "Manufacturing Costs",
      description: isBN
        ? "শ্রমিক মজুরি, বিদ্যুৎ/গ্যাস, যন্ত্রপাতি অবচয় ও রক্ষণাবেক্ষণ, এবং কারখানা ওভারহেড।"
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
      title: isBN ? "নিজস্ব গুদাম পরিচালন ব্যয়" : "Own Warehouse Costs",
      description: isBN
        ? "হোল্ডিং ট্যাক্স, গুদাম কর্মী বেতন, নিরাপত্তা প্রহরী, রক্ষণাবেক্ষণ ও অবচয় প্রভিশন।"
        : "Property taxes, staff salary, security guard, maintenance, utilities, and damage reserves.",
    },
    {
      key: "stocking_rent",
      model: "rent",
      title: isBN ? "ভাড়া গুদাম সংক্রান্ত ব্যয়" : "Rented Warehouse Costs",
      description: isBN
        ? "মাসিক গুদাম ভাড়া, মাল ওঠানামা লেবার, সার্ভিস চার্জ ও অগ্নি বীমা।"
        : "Monthly warehouse lease, in-out handling labor, service charges, and fire insurance.",
    },
    {
      key: "stocking_spot",
      model: "spot",
      title: isBN ? "অন-স্পট সরাসরি ডেলিভারি ব্যয়" : "On-spot / Cross-docking Costs",
      description: isBN
        ? "সরাসরি স্থানান্তর লেবার, অস্থায়ী পিকআপ/ভ্যান ডেমারেজ ও জরুরি সর্টিং।"
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
      title: isBN ? "খুচরা ও অনলাইন বিক্রয় খরচ" : "Retail & E-commerce Selling Costs",
      description: isBN
        ? "কুরিয়ার চার্জ (পাঠাও/স্টেডফাস্ট), এমএফএস গেটওয়ে ফি, শপিং ব্যাগ ও ডিজিটাল বিজ্ঞাপন।"
        : "Courier delivery (Steadfast/Pathao), MFS payment gateway fee, bags, and digital ad boosts.",
    },
    {
      key: "selling_bulk",
      model: "bulk",
      title: isBN ? "পাইকারি ও ডিলার চ্যানেল খরচ" : "Bulk & Wholesale Distribution Costs",
      description: isBN
        ? "ডিলার কমিশন, ফুল ট্রাক আন্তঃজেলা পরিবহন, লোডিং লেবার ও বিক্রয় প্রতিনিধি (SR) টিএ/ডিএ।"
        : "Dealer commission, full truck freight, loading labor, field sales officer (SR) TA/DA.",
    },
  ];
};

export const getReturnGroup = (lang = "EN") => {
  const isBN = lang === "BN";
  return {
    key: "returns",
    title: isBN ? "পণ্য ফেরত সংক্রান্ত খরচ" : "Return Handling & Reprocessing Costs",
    description: isBN
      ? "রিভার্স কুরিয়ার পিকআপ ফি, পণ্যের গুণমান পরীক্ষা, বাছাই, পরিষ্কার ও পুনরায় মোড়কীকরণ।"
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
      salvage_value: 500,
    },
    salesTargetDays: "monthly",
    productSource: "local",
    stockingModel: "rent",
    salesModel: "retail",
    returnDisposition: "resell",
    bulkPrices: [
      {
        id: crypto.randomUUID(),
        name: isBN ? "ঢাকা পাইকারি বাজার (চকবাজার / মৌলভীবাজার)" : "Dhaka Wholesale Market",
        price: "850",
        mix: "60",
      },
      {
        id: crypto.randomUUID(),
        name: isBN ? "জেলা ডিলার ও আউটস্টেশন নেটওয়ার্ক" : "District Dealers Network",
        price: "800",
        mix: "40",
      },
    ],
    costs: {
      // SOURCING GROUPS
      sourcing_local: isBN
        ? [
            createCost("আন্তঃজেলা ট্রাক ও পরিবহন ভাড়া", isPerUnit ? 5.5 : 5500, "value"),
            createCost("লোডিং ও আনলোডিং কুলি মজুরি", isPerUnit ? 1.8 : 1800, "value"),
            createCost("হাট ও ঘাট খাজনা", isPerUnit ? 0.8 : 800, "value"),
            createCost("স্থানীয় ক্রয় ও ব্রোকারেজ কমিশন", 2.0, "percent"),
            createCost("কোয়ালিটি চেকিং ও স্যাম্পলিং", isPerUnit ? 1.2 : 1200, "value"),
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
            createCost("কাস্টমস শুল্ক ও সম্পূরক শুল্ক", 25.0, "percent"),
            createCost("অগ্রিম আয়কর (AIT) ও এটি (AT)", 5.0, "percent"),
            createCost("সিপিএ পোর্ট ও ডেমারেজ চার্জ", isPerUnit ? 9.5 : 9500, "value"),
            createCost("সিঅ্যান্ডএফ বিল ও হ্যান্ডলিং ফি", 1.0, "percent"),
            createCost("শিপিং লাইন ফি ও কন্টেইনার চার্জ", isPerUnit ? 14.0 : 14000, "value"),
            createCost("মেরিন ইন্স্যুরেন্স প্রিমিয়াম", 0.75, "percent"),
            createCost("বন্দর হতে গোডাউন ট্রেইলার ভাড়া", isPerUnit ? 16.0 : 16000, "value"),
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
            createCost("কারখানা শ্রমিকদের সরাসরি মজুরি", isPerUnit ? 28.0 : 28000, "value"),
            createCost("বিদ্যুৎ, গ্যাস ও ডিজেল জ্বালানি", isPerUnit ? 15.0 : 15000, "value"),
            createCost("যন্ত্রপাতি অবচয় ও মেরামত", 2.5, "percent"),
            createCost("প্রাথমিক মোড়কীকরণ ও পলি", isPerUnit ? 8.5 : 8500, "value"),
            createCost("সুপারভাইজার বেতন ও কারখানা ওভারহেড", isPerUnit ? 7.5 : 7500, "value"),
            createCost("ওয়েস্টেজ ও স্ক্র্যাপ প্রভিশন", 2.0, "percent"),
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
            createCost("পৌরসভা হোল্ডিং ট্যাক্স ও মেরামত", isPerUnit ? 3.0 : 3000, "value"),
            createCost("গুদাম স্টাফ ও নাইটগার্ড বেতন", isPerUnit ? 14.0 : 14000, "value"),
            createCost("গুদাম বিদ্যুৎ ও পানির বিল", isPerUnit ? 3.5 : 3500, "value"),
            createCost("ক্ষয়ক্ষতি ও মেয়াদোত্তীর্ণ প্রভিশন", 1.5, "percent"),
            createCost("কীটপতঙ্গ নিয়ন্ত্রণ ও ওষুধ স্প্রে", isPerUnit ? 1.0 : 1000, "value"),
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
            createCost("মাসিক গোডাউন ভাড়া", isPerUnit ? 18.0 : 18000, "value"),
            createCost("মালামাল ওঠা-নামা ও সাজানো লেবার", isPerUnit ? 4.0 : 4000, "value"),
            createCost("সার্ভিস চার্জ ও সিকিউরিটি", isPerUnit ? 2.5 : 2500, "value"),
            createCost("গোডাউন বিদ্যুৎ বিল", isPerUnit ? 2.2 : 2200, "value"),
            createCost("অগ্নি ও সাধারণ বীমা", 0.5, "percent"),
          ]
        : [
            createCost("Monthly Godown Rent", isPerUnit ? 18.0 : 18000, "value"),
            createCost("In/Out Movement & Stacking Labor", isPerUnit ? 4.0 : 4000, "value"),
            createCost("Service Charge & Security Guard", isPerUnit ? 2.5 : 2500, "value"),
            createCost("Godown Electricity Bill", isPerUnit ? 2.2 : 2200, "value"),
            createCost("Fire & Burglary Insurance", 0.5, "percent"),
          ],

      stocking_spot: isBN
        ? [
            createCost("সরাসরি স্থানান্তর কুলি খরচ", isPerUnit ? 2.5 : 2500, "value"),
            createCost("অস্থায়ী পিকআপ ভ্যান হোল্ডিং ফি", isPerUnit ? 3.5 : 3500, "value"),
            createCost("জরুরি সর্টিং ও রি-টেপিং", isPerUnit ? 1.5 : 1500, "value"),
          ]
        : [
            createCost("Cross-Docking Transfer Labor", isPerUnit ? 2.5 : 2500, "value"),
            createCost("Temporary Holding Pickup Fare", isPerUnit ? 3.5 : 3500, "value"),
            createCost("Urgent Sorting & Re-taping", isPerUnit ? 1.5 : 1500, "value"),
          ],

      // SELLING GROUPS
      selling_retail: isBN
        ? [
            createCost("কুরিয়ার ডেলিভারি চার্জ (পাঠাও/স্টেডফাস্ট)", isPerUnit ? 7.5 : 7500, "value"),
            createCost("এমএফএস গেটওয়ে চার্জ (বিকাশ/নগদ ১.৫%)", 1.5, "percent"),
            createCost("শপিং ব্যাগ ও মোড়ক বক্স", isPerUnit ? 2.5 : 2500, "value"),
            createCost("ডিজিটাল বুস্টিং ও বিজ্ঞাপন", isPerUnit ? 9.0 : 9000, "value"),
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
            createCost("ডিলার কমিশন ও ট্রেড অফার", 5.0, "percent"),
            createCost("আন্তঃজেলা ফুল ট্রাক ভাড়া", isPerUnit ? 14.0 : 14000, "value"),
            createCost("ডিলারের ট্রাকে মাল লোডিং লেবার", isPerUnit ? 3.5 : 3500, "value"),
            createCost("বিক্রয় প্রতিনিধি (SR) টিএ/ডিএ", 2.0, "percent"),
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
            createCost("রিভার্স কুরিয়ার ডেলিভারি ফি", isPerUnit ? 2.8 : 2800, "value"),
            createCost("টেস্টিং, সর্টিং ও পরিষ্কারকরণ লেবার", isPerUnit ? 1.2 : 1200, "value"),
            createCost("নতুন বক্স ও প্যাকিং প্রতিস্থাপন", isPerUnit ? 1.8 : 1800, "value"),
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

  const calculation = useMemo(() => {
    const qty = number(formData?.sales_qty);
    const unitCost = number(formData?.unit_purchase_cost);
    const discountPercent = Math.min(100, number(formData?.discount_percent));
    const targetMargin = number(formData?.profit_margin);
    const otherTax = number(formData?.other_tax_levy);

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

    const resolverContext = {
      costInputMode,
      salesQty: qty,
      unitPurchaseCost: unitCost,
      sellingPrice: sellingPriceAfterDiscount,
    };

    const activeSrcGroupKey = `sourcing_${productSource}`;
    const sourcingItems = costs[activeSrcGroupKey] || [];
    const sourcingExtra = sourcingItems.reduce((sum, item) => {
      const res = resolveCost(item, {
        ...resolverContext,
        stageType: "sourcing",
      });
      return sum + res.totalAmount;
    }, 0);
    const sourcingBase = qty * unitCost;
    const sourcingTotal = sourcingBase + sourcingExtra;

    const activeStkGroupKey = `stocking_${stockingModel}`;
    const stockingItems = costs[activeStkGroupKey] || [];
    const stockingTotal = stockingItems.reduce((sum, item) => {
      const res = resolveCost(item, {
        ...resolverContext,
        stageType: "stocking",
      });
      return sum + res.totalAmount;
    }, 0);

    const inventoryCost = sourcingTotal + stockingTotal;
    const unitInventoryCost = qty > 0 ? inventoryCost / qty : 0;

    const returnedQty = Math.min(qty, number(formData?.returned_qty));
    const refundAmount = returnedQty * sellingPriceAfterDiscount;
    const recoverable =
      returnDisposition === "resell" || returnDisposition === "repack";
    const recoveredInventoryCost = recoverable
      ? returnedQty * unitInventoryCost
      : 0;
    const lostInventoryCost = recoverable ? 0 : returnedQty * unitInventoryCost;

    const cogs = inventoryCost - recoveredInventoryCost;

    const activeSellGroupKey = `selling_${salesModel}`;
    const sellingItems = costs[activeSellGroupKey] || [];
    const sellingTotal = sellingItems.reduce((sum, item) => {
      const res = resolveCost(item, {
        ...resolverContext,
        stageType: "selling",
      });
      return sum + res.totalAmount;
    }, 0);

    const returnItems = costs.returns || [];
    const returnTotal = returnItems.reduce((sum, item) => {
      const res = resolveCost(item, {
        ...resolverContext,
        stageType: "returns",
        salesQty: returnedQty > 0 ? returnedQty : qty,
      });
      return sum + res.totalAmount;
    }, 0);

    const deliveryIncome = number(formData?.delivery_income);
    const netRevenue = grossSales - refundAmount + deliveryIncome;

    const totalExpenses = cogs + sellingTotal + returnTotal + otherTax;

    const netProfit = netRevenue - totalExpenses;
    const unitNetProfit = qty > 0 ? netProfit / qty : 0;

    const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
    const markup = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

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
      sourcingUnitExtra: qty > 0 ? sourcingExtra / qty : 0,
      stockingTotal,
      stockingUnitTotal: qty > 0 ? stockingTotal / qty : 0,
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
      sellingUnitTotal: qty > 0 ? sellingTotal / qty : 0,
      returnTotal,
      returnUnitTotal: qty > 0 ? returnTotal / qty : 0,
      deliveryIncome,
      netRevenue,
      totalExpenses,
      totalExpensesUnit: qty > 0 ? totalExpenses / qty : 0,
      netProfit,
      unitNetProfit,
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
    productSource,
    stockingModel,
    salesModel,
    returnDisposition,
    costInputMode,
  ]);

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

      return items.reduce((sum, item) => {
        const res = resolveCost(item, {
          costInputMode,
          salesQty: qty,
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
      const total = getStageTotal(stageKey);
      return qty > 0 ? total / qty : 0;
    },
    [getStageTotal, formData?.sales_qty],
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
      // Auto-load default dataset in the selected language
      handleLoadDefaultBD(newLang);
    },
    [lang, handleLoadDefaultBD],
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
    // Calculation result & helpers
    calculation,
    money,
    number,
    // Actions
    handleChange,
    handleLoadDefaultBD,
    handleCancel,
    handleSubmit,
  };
};

export default useUnifiedProfitROI;
