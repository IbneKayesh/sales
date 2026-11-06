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

export const createCost = (name = "", amount = "") => ({
  id: crypto.randomUUID(),
  name,
  amount: amount === "" ? "" : String(amount),
});

// --------------------------------------------------
// Group Model Definitions
// --------------------------------------------------

export const SOURCING_GROUPS = [
  {
    key: "sourcing_local",
    model: "local",
    title: "Local Sourcing Costs",
    bnTitle: "স্থানীয় ক্রয় সংক্রান্ত ব্যয়",
    description: "Transport, labor, market tolls, local commission, and quality sampling.",
  },
  {
    key: "sourcing_import",
    model: "import",
    title: "Import Sourcing Costs",
    bnTitle: "আমদানি সংক্রান্ত শুল্ক ও ব্যয়",
    description: "LC opening, customs duty, port charges, C&F agent, shipping freight, and inland transport.",
  },
  {
    key: "sourcing_manufacture",
    model: "manufacture",
    title: "Manufacturing Costs",
    bnTitle: "উৎপাদন ও কারখানা ব্যয়",
    description: "Direct wages, factory electricity/gas, machine maintenance, packaging, and overhead.",
  },
];

export const STOCKING_GROUPS = [
  {
    key: "stocking_own",
    model: "own",
    title: "Own Warehouse Costs",
    bnTitle: "নিজস্ব গুদাম পরিচালন ব্যয়",
    description: "Property taxes, staff salary, security guard, maintenance, utilities, and damage reserves.",
  },
  {
    key: "stocking_rent",
    model: "rent",
    title: "Rented Warehouse Costs",
    bnTitle: "ভাড়া গুদাম সংক্রান্ত ব্যয়",
    description: "Monthly warehouse lease, in-out handling labor, service charges, and fire insurance.",
  },
  {
    key: "stocking_spot",
    model: "spot",
    title: "On-spot / Cross-docking Costs",
    bnTitle: "অন-স্পট সরাসরি ডেলিভারি ব্যয়",
    description: "Direct transfer labor, temporary holding van/pickup demurrage, and urgent sorting.",
  },
];

export const SELLING_GROUPS = [
  {
    key: "selling_retail",
    model: "retail",
    title: "Retail & E-commerce Selling Costs",
    bnTitle: "খুচরা ও অনলাইন বিক্রয় খরচ",
    description: "Courier delivery (Steadfast/Pathao), MFS payment gateway fee, bags, and digital ad boosts.",
  },
  {
    key: "selling_bulk",
    model: "bulk",
    title: "Bulk & Wholesale Distribution Costs",
    bnTitle: "পাইকারি ও ডিলার চ্যানেল খরচ",
    description: "Dealer commission, full truck freight, loading labor, field sales officer (SR) TA/DA.",
  },
];

export const RETURN_GROUP = {
  key: "returns",
  title: "Return Handling & Reprocessing Costs",
  bnTitle: "পণ্য ফেরত সংক্রান্ত খরচ",
  description: "Reverse courier pickup, quality inspection, sorting, cleaning, and box repacking.",
};

// --------------------------------------------------
// Default Dataset for Bangladesh Based Business
// --------------------------------------------------

export const getDefaultBDDataset = () => ({
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
      name: "Dhaka Wholesale Market (চকবাজার / মৌলভীবাজার পাইকারি)",
      price: "850",
      mix: "60",
    },
    {
      id: crypto.randomUUID(),
      name: "District Dealers / Outstation (জেলা ডিলার ও আউটস্টেশন)",
      price: "800",
      mix: "40",
    },
  ],
  costs: {
    // SOURCING GROUPS
    sourcing_local: [
      createCost("Truck & Pickup Fare (আন্তঃজেলা পরিবহন ও ট্রাক ভাড়া)", 5500),
      createCost("Loading & Unloading Labor (লেবার / কুলি মজুরি)", 1800),
      createCost("Hat Toll & Ghat Khajna (হাট খাজনা ও ঘাট খরচ)", 800),
      createCost("Local Procurement Commission (স্থানীয় ব্রোকারেজ ফি)", 2000),
      createCost("Quality Checking & Sampling (কোয়ালিটি চেকিং ও স্যাম্পলিং)", 1200),
    ],
    sourcing_import: [
      createCost("LC Margin & Bank Commission (এলসি কমিশন ও ব্যাংক চার্জ)", 8500),
      createCost("Customs Duty, RD & SD (কাস্টমস শুল্ক ও সম্পূরক শুল্ক)", 35000),
      createCost("Advance Income Tax (AIT) & AT (অগ্রিম আয়কর ও এটি)", 12000),
      createCost("Chittagong Port (CPA) & Demurrage (সিপিএ পোর্ট চার্জ)", 9500),
      createCost("C&F Agent Commission & Processing (সিঅ্যান্ডএফ বিল ও খরচ)", 6500),
      createCost("Shipping Line & Container Detention (শিপিং লাইন ফি)", 14000),
      createCost("Marine Insurance Premium (মেরিন ইন্স্যুরেন্স)", 4500),
      createCost("Port to Godown Trailer Freight (বন্দর হতে গোডাউন ট্রেইলার ভাড়া)", 16000),
    ],
    sourcing_manufacture: [
      createCost("Direct Factory Labor (কারখানা শ্রমিকদের মজুরি)", 28000),
      createCost("Factory Electricity, Gas & Diesel (বিদ্যুৎ ও জ্বালানি বিল)", 15000),
      createCost("Machine Depreciation & Maintenance (যন্ত্রপাতি অবচয় ও মেরামত)", 6500),
      createCost("Primary Inner Poly & Packaging (প্রাথমিক মোড়কীকরণ ও পলি)", 8500),
      createCost("Factory Supervisor & Security Overhead (কারখানা ওভারহেড)", 7500),
      createCost("Wastage & Scrap Allowance (ওয়েস্টেজ ও স্ক্র্যাপ প্রভিশন)", 3500),
    ],

    // STOCKING GROUPS
    stocking_own: [
      createCost("Godown Maintenance & Holding Tax (পৌরসভা হোল্ডিং ট্যাক্স ও মেরামত)", 3000),
      createCost("Warehouse Staff & Night Guard (গুদাম স্টাফ ও নাইটগার্ড বেতন)", 14000),
      createCost("Warehouse Electricity & Utilities (গুদাম বিদ্যুৎ ও পানির বিল)", 3500),
      createCost("Damage & Expiry Reserve (ক্ষয়ক্ষতি ও মেয়াদোত্তীর্ণ প্রভিশন)", 2500),
      createCost("Pest Control & Spray (কীটপতঙ্গ নিয়ন্ত্রণ ও ওষুধ স্প্রে)", 1000),
    ],
    stocking_rent: [
      createCost("Monthly Godown Rent (মাসিক গোডাউন ভাড়া)", 18000),
      createCost("In/Out Movement & Stacking Labor (মালামাল ওঠা-নামা লেবার)", 4000),
      createCost("Service Charge & Security Guard (সার্ভিস চার্জ ও সিকিউরিটি)", 2500),
      createCost("Godown Electricity Bill (গোডাউন বিদ্যুৎ বিল)", 2200),
      createCost("Fire & Burglary Insurance (অগ্নি ও সাধারণ বীমা)", 1500),
    ],
    stocking_spot: [
      createCost("Direct Cross-Docking Labor (সরাসরি স্থানান্তর কুলি খরচ)", 2500),
      createCost("Temporary Holding Pickup/Van Fare (অস্থায়ী পিকআপ হোল্ডিং ফি)", 3500),
      createCost("Urgent Sorting & Re-taping (জরুরি সর্টিং ও টেপিং)", 1500),
    ],

    // SELLING GROUPS
    selling_retail: [
      createCost("Courier & Delivery (Steadfast / Pathao ডেলিভারি চার্জ)", 7500),
      createCost("MFS & Payment Gateway Fee (bKash/Nagad/Card 1.5% ফি)", 4800),
      createCost("Shopping Bags & Packaging Box (শপিং ব্যাগ ও মোড়ক বক্স)", 2500),
      createCost("Social Media / Digital Boost Ads (ফেসবুক ও গুগল বিজ্ঞাপন)", 9000),
      createCost("Sales Executive Commission (সেলস এক্সিকিউটিভ কমিশন)", 5500),
    ],
    selling_bulk: [
      createCost("Dealer Commission & Trade Promotion (ডিলার কমিশন ও ট্রেড অফার)", 20000),
      createCost("Inter-District Full Truck Freight (আন্তঃজেলা ফুল ট্রাক ভাড়া)", 14000),
      createCost("Loading to Dealer Transport (ডিলারের ট্রাকে মাল লোডিং লেবার)", 3500),
      createCost("Field Sales Officer (SR) TA/DA & Incentive (এসআর টিএ/ডিএ ও ইনসেন্টিভ)", 8500),
      createCost("Credit Risk & Bad Debt Reserve (বাকির ঝুঁকি ও ব্যাড ডেট প্রভিশন)", 4500),
    ],

    // RETURNS
    returns: [
      createCost("Return Courier / Reverse Pickup (রিভার্স কুরিয়ার ডেলিভারি ফি)", 2800),
      createCost("Testing, Inspection & Cleaning (টেস্টিং ও পরিষ্কারকরণ লেবার)", 1200),
      createCost("Repackaging Box & Poly Replacement (নতুন বক্স ও প্যাকিং প্রতিস্থাপন)", 1800),
    ],
  },
});

// --------------------------------------------------
// Main Hook
// --------------------------------------------------

const useUnifiedProfitROI = () => {
  const { showToast, isBusy, setIsBusy } = useUI();
  const [pgView, setPgView] = useState("SYS_VW_LST_1");
  const [readOnly, setReadOnly] = useState(false);
  const [stopEdit, setStopEdit] = useState(false);

  // Load initial Bangladesh default business dataset
  const defaults = useMemo(() => getDefaultBDDataset(), []);

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
  // Cost helpers (Work on any group key)
  // --------------------------------------------------

  const updateCosts = useCallback((stageKey, items) => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: items,
    }));
  }, []);

  const addCost = useCallback((stageKey, defaultName = "", defaultAmount = "") => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: [...(prev[stageKey] || []), createCost(defaultName, defaultAmount)],
    }));
  }, []);

  const removeCost = useCallback((stageKey, id) => {
    setCosts((prev) => ({
      ...prev,
      [stageKey]: (prev[stageKey] || []).filter((item) => item.id !== id),
    }));
  }, []);

  const getStageTotal = useCallback(
    (stageKey) =>
      (costs[stageKey] || []).reduce(
        (sum, item) => sum + number(item.amount),
        0,
      ),
    [costs],
  );

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
        name: `Level ${prev.length + 1}`,
        price: "",
        mix: "0",
      },
    ]);
  }, []);

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
  // Calculations (Dynamic for Active Selected Models)
  // --------------------------------------------------

  const calculation = useMemo(() => {
    const qty = number(formData?.sales_qty);
    const unitCost = number(formData?.unit_purchase_cost);
    const discountPercent = Math.min(100, number(formData?.discount_percent));
    const targetMargin = number(formData?.profit_margin);
    const otherTax = number(formData?.other_tax_levy);

    // 1. Sourcing based on active source group (local, import, manufacture)
    const activeSrcGroupKey = `sourcing_${productSource}`;
    const sourcingBase = qty * unitCost;
    const sourcingExtra = (costs[activeSrcGroupKey] || []).reduce(
      (sum, item) => sum + number(item.amount),
      0,
    );
    const sourcingTotal = sourcingBase + sourcingExtra;

    // 2. Stocking based on active stocking group (own, rent, spot)
    const activeStkGroupKey = `stocking_${stockingModel}`;
    const stockingTotal = (costs[activeStkGroupKey] || []).reduce(
      (sum, item) => sum + number(item.amount),
      0,
    );

    // Product cost available for sales
    const inventoryCost = sourcingTotal + stockingTotal;
    const unitInventoryCost = qty > 0 ? inventoryCost / qty : 0;

    // 3. Selling price based on active sales model (retail vs bulk)
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

    // 4. Return calculation
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

    // 5. Active Selling and Return expenses
    const activeSellGroupKey = `selling_${salesModel}`;
    const sellingTotal = (costs[activeSellGroupKey] || []).reduce(
      (sum, item) => sum + number(item.amount),
      0,
    );
    const returnTotal = (costs.returns || []).reduce(
      (sum, item) => sum + number(item.amount),
      0,
    );

    // Revenue
    const deliveryIncome = number(formData?.delivery_income);
    const netRevenue = grossSales - refundAmount + deliveryIncome;

    // Total expenses
    const totalExpenses = cogs + sellingTotal + returnTotal + otherTax;

    // Profit
    const netProfit = netRevenue - totalExpenses;

    // Key Ratios
    const profitMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;
    const markup = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;
    const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

    // Recommended minimum selling price to hit target profit margin
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
    productSource,
    stockingModel,
    salesModel,
    returnDisposition,
  ]);

  // --------------------------------------------------
  // Reset to BD Defaults / Cancel
  // --------------------------------------------------

  const handleResetToBDDefault = useCallback(() => {
    const fresh = getDefaultBDDataset();
    setFormData(fresh.formData);
    setSalesTargetDays(fresh.salesTargetDays);
    setProductSource(fresh.productSource);
    setStockingModel(fresh.stockingModel);
    setSalesModel(fresh.salesModel);
    setReturnDisposition(fresh.returnDisposition);
    setBulkPrices(fresh.bulkPrices);
    setCosts(fresh.costs);
    setFormErrors({});
    showToast("Reset to Bangladesh business defaults", "info");
  }, [showToast]);

  const handleCancel = useCallback(() => {
    handleResetToBDDefault();
  }, [handleResetToBDDefault]);

  const handleSubmit = useCallback(
    async (extraData) => {
      try {
        setIsBusy(true);
        const payload = {
          ...formData,
          ...extraData,
          sales_target_period: salesTargetDays,
          sourcing_model: productSource,
          stocking_model: stockingModel,
          sales_model: salesModel,
          return_disposition: returnDisposition,
          bulk_prices: bulkPrices,
          costs,
          calculation,
        };
        showToast("Calculations updated & saved successfully", "success");
        return payload;
      } catch (error) {
        showToast(error?.message || "Failed to process calculations", "danger");
      } finally {
        setIsBusy(false);
      }
    },
    [
      formData,
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
    addCost,
    removeCost,
    getStageTotal,
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
    handleResetToBDDefault,
    handleCancel,
    handleSubmit,
  };
};

export default useUnifiedProfitROI;
