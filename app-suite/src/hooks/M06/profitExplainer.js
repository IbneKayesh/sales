/**
 * profitExplainer.js
 * 
 * Provides detailed, localized explanations, formulas, live calculation breakdowns,
 * and managerial tips for every metric in the Unified Profit / ROI Calculator.
 */

export const getMetricExplanation = (metricKey, {
  calculation = {},
  formData = {},
  bulkPrices = [],
  outputMultiplier = 1,
  money = (v) => `৳${Number(v || 0).toFixed(2)}`,
  scaleMoney = (v) => `৳${(Number(v || 0) * outputMultiplier).toFixed(2)}`,
  lang = 'EN',
  t = (k) => k,
}) => {
  const isBN = lang === 'BN';
  const totalBulkShare = (bulkPrices || []).reduce(
    (sum, tier) => sum + (Number(tier?.mix) || 0),
    0,
  );

  const explanations = {
    // ----------------------------------------------------
    // Section 06: TOP KPI METRICS & BREAKDOWN
    // ----------------------------------------------------
    netRevenue: {
      title: isBN ? 'আসল বিক্রি আয় (নিট সেলস)' : 'Net Revenue',
      subtitle: isBN ? 'সব ছাড় ও রিফান্ড বাদে আপনার ক্যাশে আসা মোট টাকা' : 'Total effective revenue collected',
      explanation: isBN
        ? 'পণ্য বিক্রি, কাস্টমারের দেওয়া ডেলিভারি ফি এবং স্ক্র্যাপ বিক্রির টাকা যোগ করে কাস্টমারকে দেওয়া ডিসকাউন্ট বা ফেরত বাদ দিলে যে টাকা ব্যবসার আসল আয় হিসেবে পকেটে থাকে।'
        : 'Total effective cash inflow generated from product merchandise sales, customer delivery fees, scrap proceeds, and return fees, after subtracting promotional discounts and customer refunds.',
      formula: 'Net Revenue = Regular Sales + Scrap Proceeds + Delivery Incomes + Return Courier Fees - Customer Refunds',
      breakdown: [
        {
          label: isBN ? 'পণ্য বিক্রির নিয়মিত আয়' : 'Regular Sales Revenue',
          value: scaleMoney(calculation.regularSalesRevenue),
          note: `${(calculation.effectiveSoldQty || 0).toLocaleString()} ${t('units')} @ ${money(calculation.sellingPriceAfterDiscount)}`,
        },
        {
          label: isBN ? 'স্ক্র্যাপ বা কম দামে বিক্রির আয়' : 'Scrap Sales Proceeds',
          value: `+ ${scaleMoney(calculation.scrapSalesRevenue)}`,
          note: `${calculation.returnedQty || 0} ${t('units')} scrapped`,
        },
        {
          label: isBN ? 'কাস্টমারের দেওয়া ডেলিভারি চার্জ' : 'Customer Delivery Incomes',
          value: `+ ${scaleMoney(calculation.deliveryIncome)}`,
        },
        {
          label: isBN ? 'কাস্টমারের দেওয়া রিটার্ন বা অগ্রিম ফি' : 'Return Fees Collected',
          value: `+ ${scaleMoney(calculation.returnFeeCollected)}`,
        },
        {
          label: isBN ? 'কাস্টমারকে ফেরত দেওয়া টাকা (রিফান্ড)' : 'Customer Refunds Paid',
          value: `- ${scaleMoney(calculation.refundAmount)}`,
        },
        {
          label: isBN ? 'মোট আসল বিক্রি আয়' : 'Total Net Revenue',
          value: scaleMoney(calculation.netRevenue),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'কুরিয়ারে পার্সেল পাঠানোর আগে কাস্টমারকে ফোন দিয়ে নিশ্চিত হয়ে নিন এবং ডেলিভারি চার্জ আগেই নিয়ে নিন, এতে ফেইক অর্ডার ও রিটার্নের লস অনেক কমে যাবে।'
        : 'Verify customer delivery addresses before dispatch to reduce returns and ensure courier delivery charges are collected upfront.',
    },

    cogs: {
      title: isBN ? 'পণ্যের মোট আসল খরচ (COGS)' : 'Cost of Goods Sold (COGS)',
      subtitle: isBN ? 'পণ্য কেনা বা বানানো এবং গোডাউনে রাখার সরাসরি খরচ' : 'Direct inventory procurement & warehousing costs',
      explanation: isBN
        ? 'সহজ কথায়, পুরো ব্যাচের মাল কিনতে বা বানাতে এবং গোডাউনে এনে রাখতে আপনার সরাসরি মোট কত টাকা খরচ হয়েছে। রিটার্ন মাল স্ক্র্যাপে বেচে যে টাকা ফেরত আসে সেটা এই খরচ থেকে বাদ দেওয়া হয় না, সেটা বিক্রয় আয়ের সাথে যোগ হয়—তাই একই টাকা দুইবার হিসাব হয় না।'
        : 'Direct costs attributable to procurement or manufacturing plus warehouse storage for the whole batch. Cash recovered by scrapping returned units is booked as income in Net Revenue instead of reducing this cost, so the recovery is counted only once.',
      formula: 'COGS = Total Batch Inventory Cost (Sourcing + Stocking) — scrap proceeds are income in Net Revenue',
      breakdown: [
        {
          label: isBN ? 'পণ্য কেনা বা তৈরির মোট খরচ' : 'Sourcing Total Outlay',
          value: scaleMoney(calculation.sourcingTotal),
          note: isBN ? 'কেনা দাম + গাড়ি ভাড়া + কুলি + শুল্ক' : 'Purchase/mfg + freight + duty + labor',
        },
        {
          label: isBN ? 'গোডাউন ও পণ্য রাখার মোট খরচ' : 'Stocking Total Outlay',
          value: `+ ${scaleMoney(calculation.stockingTotal)}`,
          note: isBN ? 'গোডাউন ভাড়া / ৩পিএল চার্জ' : 'Warehouse lease / 3PL storage',
        },
        {
          label: isBN ? 'মালের মোট ইনভেন্টরি খরচ' : 'Total Batch Inventory Cost',
          value: `= ${scaleMoney(calculation.inventoryCost)}`,
        },
        {
          label: isBN ? 'মালের মোট খরচ (COGS)' : 'COGS — full batch cost',
          value: scaleMoney(calculation.cogs),
          note:
            `${money(calculation.unitCogs)} / ${isBN ? 'পিস' : 'unit'}` +
            (calculation.scrapSalesRevenue > 0
              ? isBN
                ? ` • স্ক্র্যাপ আয় ${scaleMoney(calculation.scrapSalesRevenue)} আয়ের সাথে যোগ হয়েছে`
                : ` • scrap income ${scaleMoney(calculation.scrapSalesRevenue)} counted in revenue`
              : ''),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'পাইকার বা মহাজনের কাছ থেকে বেশি মালের রেটে ছাড় নিন এবং গোডাউনে মাল বেশিদিন জমিয়ে না রেখে দ্রুত বিক্রি করুন, এতে মালের ওপর খরচ অনেক কম পড়বে।'
        : 'Negotiate volume rebates with suppliers and minimize warehouse holding duration to optimize COGS.',
    },

    grossProfit: {
      title: isBN ? 'মোট লাভ ও গ্রস মার্জিন' : 'Gross Profit & Margin',
      subtitle: isBN ? 'বিজ্ঞাপন ও ডেলিভারি খরচের আগের লাভ' : 'Merchandise profit before operating expenses',
      explanation: isBN
        ? 'মালের বিক্রি দাম থেকে মালের কেনা খরচ বাদ দিলে যে লাভ থাকে। অর্থাৎ এখনো বিজ্ঞাপন, কুরিয়ার বা কর্মচারী খরচ বাদ দেওয়া হয়নি। এই লাভ যথেষ্ট বেশি না থাকলে ব্যবসা টিকিয়ে রাখা সম্ভব না।'
        : 'Profit earned directly on merchandise before deducting operating overhead (marketing, platform commissions, couriers, and taxes). A healthy gross margin is required to absorb opex.',
      formula: 'Gross Profit = Net Revenue - COGS | Gross Margin % = (Gross Profit / Net Revenue) * 100',
      breakdown: [
        {
          label: isBN ? 'আসল বিক্রি আয়' : 'Net Revenue',
          value: scaleMoney(calculation.netRevenue),
        },
        {
          label: isBN ? 'মালের কেনা খরচ (COGS)' : 'Less Direct COGS',
          value: `- ${scaleMoney(calculation.cogs)}`,
        },
        {
          label: isBN ? 'মোট লাভ (গ্রস প্রফিট)' : 'Gross Profit',
          value: scaleMoney(calculation.grossProfit),
          highlight: true,
        },
        {
          label: isBN ? 'গ্রস লাভের মার্জিন (%)' : 'Gross Margin Rate (%)',
          value: `${(calculation.grossMargin || 0).toFixed(2)}%`,
          highlight: true,
        },
      ],
      tips: isBN
        ? 'অনলাইন ও খুচরা ব্যবসায় গ্রস মার্জিন অন্তত ৩৫-৫০% এবং পাইকারিতে ১৫-২৫% না রাখলে বিজ্ঞাপন আর কুরিয়ার খরচ মিটিয়ে লাভ করা কঠিন।'
        : 'Maintain gross margins above 35-50% for retail and 15-25% for wholesale to absorb advertising and courier overhead.',
    },

    totalExpenses: {
      title: isBN ? 'মোট খরচ (সব মিলিয়ে)' : 'Total Expenses & Outflows',
      subtitle: isBN ? 'পণ্য কেনা, রাখা, বিজ্ঞাপন ও কুরিয়ারের সর্বমোট খরচ' : 'Sum of COGS and all Operating Expenses',
      explanation: isBN
        ? 'পণ্য কেনা থেকে শুরু করে কাস্টমারের হাতে পৌঁছানো পর্যন্ত আপনার পকেট থেকে মোট যত টাকা বের হয়েছে (পণ্য খরচ + কুরিয়ার + বিজ্ঞাপন + রিটার্ন + ট্যাক্স)।'
        : 'Comprehensive business expenditure combining merchandise cost (COGS) with all Operating Expenses (OPEX: shipping couriers, digital ads, commissions, returns, and taxes).',
      formula: 'Total Expenses = COGS + OPEX (Selling Total + Return Total + Other Taxes)',
      breakdown: [
        {
          label: isBN ? 'মালের কেনা খরচ (COGS)' : 'Direct COGS',
          value: scaleMoney(calculation.cogs),
        },
        {
          label: isBN ? 'বিক্রি ও বিজ্ঞাপনের খরচ' : 'Selling & Marketing OPEX',
          value: `+ ${scaleMoney(calculation.sellingTotal)}`,
          note: isBN ? 'কুরিয়ার + পেমেন্ট ফি + ফেসবুক বুস্টিং' : 'Couriers + gateway + digital ads',
        },
        {
          label: isBN ? 'রিটার্ন প্রসেসিং ও কুরিয়ার চার্জ' : 'Return Reprocessing & Freight',
          value: `+ ${scaleMoney(calculation.returnTotal)}`,
        },
        {
          label: isBN ? 'ট্যাক্স, ভ্যাট ও লাইসেন্স ফি' : 'Taxes, AIT & Municipal Levies',
          value: `+ ${scaleMoney(formData?.other_tax_levy || 0)}`,
        },
        {
          label: isBN ? 'সর্বমোট খরচ' : 'Total Outflows & Expenses',
          value: scaleMoney(calculation.totalExpenses),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'প্রতি সপ্তাহে ফেসবুক বিজ্ঞাপনের সেলস রেজাল্ট এবং কুরিয়ারের ওজনের বিল ভালো করে চেক করুন, যাতে অজান্তে বাড়তি খরচ না বাড়ে।'
        : 'Audit digital ad ROAS and courier weight discrepancy bills weekly to maintain tight opex control.',
    },

    netProfit: {
      title: isBN ? 'আসল নিট লাভ / (লস)' : 'Net Profit & Net Margin',
      subtitle: isBN ? 'সব খরচ বাদে আপনার হাতে আসল কত টাকা থাকল' : 'The ultimate financial bottom line',
      explanation: isBN
        ? 'ব্যবসার আসল চূড়ান্ত লাভ। মালের খরচ, বিজ্ঞাপন, কুরিয়ার, রিটার্নের ক্ষতি ও ট্যাক্স মেটানোর পর এই টাকাই শেষ পর্যন্ত আপনার পকেটে বা ব্যাংকে জমা থাকবে।'
        : 'The final profit remaining after subtracting every direct, indirect, marketing, logistics, return write-off, and statutory tax expense from total revenues.',
      formula: 'Net Profit = Net Revenue - Total Expenses | Net Margin % = (Net Profit / Net Revenue) * 100',
      breakdown: [
        {
          label: isBN ? 'আসল বিক্রি আয়' : 'Net Revenue',
          value: scaleMoney(calculation.netRevenue),
        },
        {
          label: isBN ? 'সর্বমোট খরচ' : 'Total Outflows & Expenses',
          value: `- ${scaleMoney(calculation.totalExpenses)}`,
        },
        {
          label: isBN ? 'আসল নিট লাভ / (লস)' : 'Net Profit / (Loss)',
          value: scaleMoney(calculation.netProfit),
          highlight: true,
        },
        {
          label: isBN ? 'নিট লাভের মার্জিন (%)' : 'Net Profit Margin (%)',
          value: `${(calculation.profitMargin || 0).toFixed(2)}%`,
          highlight: true,
        },
        {
          label: isBN ? 'প্রতি পিসে আসল লাভ' : 'Net Profit per Unit',
          value: `${money(calculation.unitNetProfit)} / ${isBN ? 'পিস' : 'unit'}`,
        },
      ],
      tips: isBN
        ? 'দাম ঠিক করার সময় কিছু রিটার্নের খরচ আগেই ধরে রাখুন, যেন কিছু পার্সেল ফেরত আসলেও দিনশেষে লাভ থাকে।'
        : 'Price products with sufficient cushion so that unexpected surges in returns do not erode net profitability.',
    },

    roi: {
      title: isBN ? 'টাকার ওপর লাভ (ROI %)' : 'Return on Investment (ROI %)',
      subtitle: isBN ? 'ব্যবসায় খাটানো প্রতি ১০০ টাকায় কত লাভ হলো' : 'Profit generated per ৳100 capital deployed',
      explanation: isBN
        ? 'ব্যবসায় মাল কেনা ও পরিচালনায় আপনি যে টাকা খাঁটিয়েছেন, প্রতি ১০০ টাকায় কত টাকা লাভ আসল তার হিসাব। যেমন: ৩০% ROI মানে ১০০ টাকা বিনিয়োগে ৩০ টাকা লাভ হয়েছে।'
        : 'Percentage return earned on total upfront cash outlay invested into sourcing, warehousing, marketing, and operations for this batch.',
      formula: 'ROI (%) = (Net Profit / Total Working Capital Outlay) * 100',
      breakdown: [
        {
          label: isBN ? 'আসল নিট লাভ' : 'Net Profit Earned',
          value: scaleMoney(calculation.netProfit),
        },
        {
          label: isBN ? 'হাতে খাটানো নগদ টাকা' : 'Working Capital Outlay',
          value: `/ ${scaleMoney(calculation.workingCapital)}`,
        },
        {
          label: isBN ? 'বিনিয়োগের ওপর লাভ (ROI %)' : 'ROI on Capital (%)',
          value: `${(calculation.roi || 0).toFixed(2)}%`,
          highlight: true,
        },
      ],
      tips: isBN
        ? 'পণ্য যত দ্রুত বিক্রি করে টাকা আবার নতুন মালে খাটাতে পারবেন, বছরে আপনার মোট লাভ তত বেশি হবে।'
        : 'Accelerating inventory turnaround cycles compounds your annualized return on working capital.',
    },

    breakEven: {
      title: isBN ? 'লস না হওয়ার বিক্রি (ব্রেক-ইভেন পয়েন্ট)' : 'Break-Even Point (BEP)',
      subtitle: isBN ? 'যেখানে কোনো লাভও নেই, লসও নেই' : 'Zero-profit, zero-loss sales threshold',
      explanation: isBN
        ? 'ন্যূনতম কত পিস বা কত টাকার মাল বেচলে ব্যবসার সব খরচ উঠে আসবে (০ লাভ, ০ লস)। এই সীমার পর থেকে প্রতি ১ পিস বিক্রি করলেই সরাসরি আপনার লাভ শুরু হবে।'
        : 'The exact sales quantity and sales revenue where total income equals total fixed and variable costs. Above BEP, every incremental sale generates pure profit.',
      formula: 'BEP Units = Net Fixed Burden / Unit Contribution Margin | BEP Sales = BEP Units * Net Selling Price',
      breakdown: [
        {
          label: isBN ? 'নির্দিষ্ট নিয়মিত খরচ (ভাড়া, স্টাফ, ট্যাক্স)' : 'Net Fixed Burden',
          value: scaleMoney(calculation.netFixedBurden),
          note: isBN ? 'নির্দিষ্ট খরচ - অন্যান্য আয়' : 'Fixed OPEX + returns + tax - other incomes',
        },
        {
          label: isBN ? 'প্রতি পিসের মার্জিন' : 'Unit Contribution Margin',
          value: money(calculation.unitContributionMargin),
          note: isBN ? 'বিক্রি দাম - পরিবর্তনশীল খরচ' : 'Net selling price - unit variable cost',
        },
        {
          label: isBN ? 'লস না হওয়ার নূন্যতম বিক্রি (পিস)' : 'Break-Even Sales Units',
          value: calculation.breakEvenQty
            ? `${Math.round(calculation.breakEvenQty * outputMultiplier).toLocaleString()} ${t('units')}`
            : 'N/A',
          highlight: true,
        },
        {
          label: isBN ? 'লস না হওয়ার নূন্যতম বিক্রি (টাকা)' : 'Break-Even Sales Revenue',
          value: calculation.breakEvenQty ? scaleMoney(calculation.breakEvenRevenue) : 'N/A',
          highlight: true,
        },
        {
          label: isBN ? 'ঝুঁকিহীন বিক্রির মার্জিন (সেফটি মার্জিন %)' : 'Safety Margin (%)',
          value: `${(calculation.safetyMarginPercent || 0).toFixed(2)}%`,
          note: isBN ? 'টার্গেট বিক্রি থেকে লসের দূরত্ব' : 'Cushion before incurring losses',
        },
      ],
      tips: isBN
        ? 'সেফটি মার্জিন সবসময় ২৫% এর উপরে রাখার চেষ্টা করুন, যাতে বাজারে কোনো মন্দা বা সমস্যা হলেও ব্যবসা লসে না পড়ে।'
        : 'Maintain a safety margin above 25% to protect the business against seasonal or economic demand fluctuations.',
    },

    workingCapital: {
      title: isBN ? 'হাতে কত নগদ টাকা লাগবে (ওয়ার্কিং ক্যাপিটাল)' : 'Working Capital Required',
      subtitle: isBN ? 'মাল কেনার জন্য আগেই প্রস্তুত রাখা নগদ অর্থ' : 'Upfront cash outlay required to fund batch',
      explanation: isBN
        ? 'মাল কেনা, গোডাউন ভাড়া, প্যাকিং, কুরিয়ার ও বিজ্ঞাপনের জন্য কাস্টমারের কাছ থেকে টাকা পাওয়ার আগেই আপনার পকেটে বা একাউন্টে যে নগদ টাকা প্রস্তুত রাখতে হবে।'
        : 'Total liquid funds needed in hand to purchase inventory, store stock, package orders, pay couriers, run ad boosts, and pay taxes before customer COD remittances arrive.',
      formula: 'Working Capital = Sourcing Total + Stocking Total + Selling Outflows + Return Costs + Taxes',
      breakdown: [
        {
          label: isBN ? 'মাল কেনার জন্য নগদ' : 'Sourcing Capital Required',
          value: scaleMoney(calculation.sourcingTotal),
        },
        {
          label: isBN ? 'গোডাউন ও পণ্য রাখার নগদ' : 'Stocking & Warehouse Capital',
          value: scaleMoney(calculation.stockingTotal),
        },
        {
          label: isBN ? 'বিজ্ঞাপন ও কুরিয়ারের জন্য নগদ' : 'Selling, Ads & Courier OPEX',
          value: scaleMoney(calculation.sellingTotal),
        },
        {
          label: isBN ? 'রিটার্নের জন্য রাখা রিজার্ভ' : 'Return Handling & Freight Outlay',
          value: scaleMoney(calculation.returnTotal),
        },
        {
          label: isBN ? 'ট্যাক্স ও লাইসেন্স ফি' : 'Taxes & Regulatory Fees',
          value: scaleMoney(formData?.other_tax_levy || 0),
        },
        {
          label: isBN ? 'হাতে মোট নগদ টাকার প্রয়োজন' : 'Total Working Capital Outlay',
          value: scaleMoney(calculation.workingCapital),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'কুরিয়ার কোম্পানিগুলোর কাছ থেকে সিওডি (COD) টাকা একাউন্টে আসতে কয়েক দিন সময় লাগে, তাই অন্তত ১০-১৫% বাড়তি নগদ টাকা হাতে রাখা নিরাপদ।'
        : 'Maintain a 10-15% liquidity reserve to handle transit delays in courier COD collections.',
    },

    operatingProfit: {
      title: isBN ? 'চলতি ব্যবসার লাভ (অপারেটিং লাভ)' : 'Operating Profit (EBITDA)',
      subtitle: isBN ? 'মূল পণ্য বেচাকেনার আসল লাভ' : 'Earnings before interest and taxes',
      explanation: isBN
        ? 'ব্যাংকের ঋণের সুদ ও ট্যাক্স দেওয়ার আগে, শুধুমাত্র পণ্য বেচাকেনা ও দোকান/অনলাইন ব্যবসা চালিয়ে আপনার কত লাভ হয়েছে তার হিসাব।'
        : 'Earnings generated purely from core merchandise operations and distribution, before deducting financial borrowing interest and statutory corporate income taxes.',
      formula: 'Operating Profit = Gross Profit - Selling OPEX - Return Costs',
      breakdown: [
        {
          label: isBN ? 'মোট লাভ (গ্রস প্রফিট)' : 'Gross Profit',
          value: scaleMoney(calculation.grossProfit),
        },
        {
          label: isBN ? 'বিক্রি ও বিজ্ঞাপনের খরচ' : 'Less Selling OPEX',
          value: `- ${scaleMoney(calculation.sellingTotal)}`,
        },
        {
          label: isBN ? 'রিটার্নের খরচ' : 'Less Return Handling Costs',
          value: `- ${scaleMoney(calculation.returnTotal)}`,
        },
        {
          label: isBN ? 'চলতি ব্যবসার লাভ (অপারেটিং লাভ)' : 'Operating Profit (EBITDA)',
          value: scaleMoney(calculation.operatingProfit),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'অপারেটিং লাভ ভালো থাকা প্রমাণ করে আপনার মূল ব্যবসাই লাভজনক এবং ব্যবসাটি নিজের পায়ে দাঁড়িয়ে চলতে পারে।'
        : 'A strongly positive operating profit proves that your distribution model is inherently self-financing.',
    },

    markup: {
      title: isBN ? 'খরচের ওপর মার্কআপ (%)' : 'Cost Markup (%)',
      subtitle: isBN ? 'খরচের সাথে কত % বাড়িয়ে বিক্রি দাম ধরেছেন' : 'Percentage added to cost to generate profit',
      explanation: isBN
        ? 'মালের মোট খরচের ওপর কত শতকরা টাকা বাড়িয়ে বিক্রি দাম ঠিক করা হয়েছে। যেমন: ১০০ টাকার খরচের জিনিস ১৫০ টাকায় বেচলে মার্কআপ হলো ৫০%।'
        : 'The percentage markup added on top of total expenditure to generate the targeted net profit.',
      formula: 'Markup % = (Net Selling Price - Unit Inventory Cost) / Unit Inventory Cost × 100',
      breakdown: [
        {
          label: isBN ? 'বিক্রি দামের পরে প্রতি পিসের দাম' : 'Net Selling Price per Unit',
          value: money(calculation.sellingPriceAfterDiscount),
        },
        {
          label: isBN ? 'প্রতি পিস ল্যান্ডেড খরচ' : 'Unit Inventory Cost',
          value: money(calculation.unitInventoryCost),
        },
        {
          label: isBN ? 'খরচের ওপর শতাংশ বৃদ্ধি' : 'Cost Markup (%)',
          value: `${(calculation.markup || 0).toFixed(2)}%`,
          highlight: true,
        },
      ],
      tips: isBN
        ? 'মার্জিন আর মার্কআপ এক জিনিস না: খরচের ওপর ৫০% মার্কআপ ধরা মানে বিক্রি দামের ওপর ৩৩.৩% প্রফিট মার্জিন।'
        : 'Do not confuse Markup with Margin: a 50% markup on cost equals a 33.3% margin on selling price.',
    },

    unitInventoryCost: {
      title: isBN ? 'প্রতি পিস হাতে আসার খরচ (ল্যান্ডেড কস্ট)' : 'Unit Inventory Cost',
      subtitle: isBN ? 'দোকান বা গোডাউনে পৌঁছানো পর্যন্ত প্রতি পিসের মোট কেনা খরচ' : 'Landed procurement & storage cost per piece',
      explanation: isBN
        ? 'প্রতিটি মাল কেনা বা তৈরির খরচ এবং সাথে গাড়ি ভাড়া, কুলি, শুল্ক ও গোডাউন খরচ মিলিয়ে ঠিক কত টাকায় প্রতিটি মাল আপনার হাতে পৌঁছেছে।'
        : 'Comprehensive landed inventory cost per unit including base purchase/mfg price plus procurement freight, customs duty, port clearance, and warehouse holding.',
      formula: 'Unit Inventory Cost = (Sourcing Total + Stocking Total) / Target Sales Qty',
      breakdown: [
        {
          label: isBN ? 'প্রতি পিস কেনা বা তৈরির খরচ' : 'Sourcing Cost per Unit',
          value: `৳${(calculation.unitSourcingCost || 0).toFixed(2)}`,
        },
        {
          label: isBN ? 'প্রতি পিস গোডাউনে রাখার খরচ' : 'Stocking Cost per Unit',
          value: `৳${(calculation.unitStockingCost || 0).toFixed(2)}`,
        },
        {
          label: isBN ? 'হাতে পৌঁছানো পর্যন্ত মোট খরচ' : 'Total Landed Inventory Cost',
          value: `৳${(calculation.unitInventoryCost || 0).toFixed(2)} / ${isBN ? 'পিস' : 'unit'}`,
          highlight: true,
        },
      ],
      tips: isBN
        ? 'পণ্য পরিবহনে নষ্ট হওয়া রোধ করে এবং গাড়ি ভাড়া ঠিকঠাক দরদাম করে প্রতি পিসের ল্যান্ডেড খরচ অনেক কমানো যায়।'
        : 'Eliminate port demurrage and optimize packaging dimensions to reduce landed inventory costs.',
    },

    targetPrice: {
      title: isBN ? 'টার্গেট লাভে পৌঁছাতে কত দাম রাখা উচিত' : 'Target Selling Price',
      subtitle: isBN ? 'প্রস্তাবিত সঠিক তালিকা মূল্য' : 'Recommended list price per unit',
      explanation: isBN
        ? 'আপনি যে লাভ করতে চান, এবং সাথে কাস্টমারকে যে ডিসকাউন্ট বা প্ল্যাটফর্ম ফি দিতে হবে—সবকিছু মাথায় রেখে প্রতি পিসের গায়ের দাম (MSRP) ঠিক কত রাখা দরকার তা স্বয়ংক্রিয়ভাবে দেখায়।'
        : 'The exact recommended selling price needed to absorb landed inventory, per-unit selling costs and the net fixed burden (after delivery income, scrap recovery, return fees collected and customer refunds), while still covering variable percentage fees and your target margin.',
      formula: 'Target Price = [Unit Inventory + Per-Unit Selling + Net Fixed Burden/Qty] / (1 - Target Margin% - Variable % Fees) / (1 - Discount%)',
      breakdown: [
        {
          label: isBN ? 'প্রতি পিস হাতে আসার খরচ' : 'Unit Landed Inventory Cost',
          value: money(calculation.unitInventoryCost),
        },
        {
          label: isBN ? 'কাঙ্ক্ষিত লাভের মার্জিন (%)' : 'Target Profit Margin (%)',
          value: `${formData?.profit_margin || 0}%`,
        },
        {
          label: isBN ? 'বিক্রি ও প্ল্যাটফর্ম কমিশন' : 'Variable Selling Commissions',
          value: `${(calculation.sellingPercentageSum || 0).toFixed(2)}%${calculation.returnPercentageSum > 0 && calculation.returnShare > 0
            ? ` + ${(calculation.returnPercentageSum * calculation.returnShare).toFixed(2)}%`
            : ''}`,
        },
        {
          label: isBN ? 'প্রতি পিস বিক্রির পরিবর্তনশীল খরচ' : 'Per-Unit Selling Cost',
          value: `+ ${money(calculation.unitValueSellingCost)}`,
        },
        {
          label: isBN ? 'প্রতি পিসে নির্দিষ্ট খরচের ভাগ' : 'Net Fixed Burden per Unit',
          value: `+ ${money((calculation.netFixedBurden || 0) / Math.max(calculation.qty || 1, 1))}`,
        },
        {
          label: isBN ? 'কাস্টমারকে ডিসকাউন্ট বা ছাড়' : 'Planned Promotional Discount',
          value: `${formData?.discount_percent || 0}%`,
        },
        {
          label: isBN ? 'প্রস্তাবিত বিক্রি দাম' : 'Recommended Target Selling Price',
          value: money(calculation.requiredPrice),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'যদি এই দাম বাজারের তুলনায় বেশি মনে হয়, তবে মাল কেনার খরচ কমান অথবা অতিরিক্ত ডিসকাউন্ট অফার বাদ দিন।'
        : 'If the target price exceeds customer willingness to pay, reduce sourcing costs or trim discounts.',
    },

    targetProfitPlanner: {
      title: isBN ? 'নির্দিষ্ট লাভ করার টার্গেট প্ল্যানার' : 'Target Profit Goal-Seek Planner',
      subtitle: isBN ? 'যত টাকা লাভ চান, কত বিক্রি করতে হবে' : 'Reverse target sales quantity & revenue planner',
      explanation: isBN
        ? 'আপনি যদি মনে মনে ঠিক করেন যে এই ব্যাচে ৫০,০০০ বা ১,০০,০০০ টাকা লাভ করবেন, তাহলে ঠিক কত পিস মাল এবং মোট কত টাকার বিক্রি করতে হবে তা নিজে থেকেই হিসাব করে বের করে দেয়।'
        : 'A reverse goal-seek calculation that determines the exact sales quantity and sales revenue required to achieve a specific monetary net profit target.',
      formula: 'Required Qty = (Target Profit + Net Fixed Burden) / Unit Contribution Margin | Required Revenue = Required Qty * Net Price',
      breakdown: [
        {
          label: isBN ? 'যত টাকা নিট লাভ করতে চান' : 'Targeted Net Profit Goal',
          value: scaleMoney(calculation.targetProfit),
        },
        {
          label: isBN ? 'তোলার মতো নির্দিষ্ট খরচ' : 'Net Fixed Burden to Cover',
          value: `+ ${scaleMoney(calculation.netFixedBurden)}`,
        },
        {
          label: isBN ? 'প্রতি পিসে অবশিষ্ট মার্জিন' : 'Unit Contribution Margin',
          value: `/ ${money(calculation.unitContributionMargin)}`,
        },
        {
          label: isBN ? 'কত পিস বিক্রি করতে হবে' : 'Required Sales Quantity',
          value: `${Math.round((calculation.requiredProfitQty || 0) * outputMultiplier).toLocaleString()} ${t('units')}`,
          highlight: true,
        },
        {
          label: isBN ? 'মোট কত টাকার বিক্রি লাগবে' : 'Required Sales Revenue',
          value: scaleMoney(calculation.requiredProfitRevenue),
          highlight: true,
        },
        {
          label: isBN ? 'বর্তমান টার্গেটের সাথে পার্থক্য' : 'Current Target vs Goal',
          value: `${calculation.isTargetProfitAchieved ? '+' : '-'}${Math.abs(Math.round((calculation.targetProfitQtyDiff || 0) * outputMultiplier)).toLocaleString()} ${t('units')}`,
          note: calculation.isTargetProfitAchieved
            ? (isBN ? '✓ টার্গেট এখনই পূরণ হয়ে যাচ্ছে!' : '✓ Target already achieved!')
            : (isBN ? '⚠️ আরও কিছু বিক্রি বাড়ানো লাগবে' : '⚠️ Additional sales needed'),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'বেশি পিস না বেচেও যদি বেশি লাভ চান, তবে প্রতি পিসের কেনা খরচ কমান অথবা অল্প কিছু বিক্রি দাম বাড়ান।'
        : 'To hit target profit without scaling sales volume, increase contribution margin by reducing unit variable costs.',
    },

    // ----------------------------------------------------
    // Sections 01-05: SECTION-LEVEL & FIELD-LEVEL EXPLANATIONS
    // ----------------------------------------------------
    costBasis: {
      title: isBN ? 'খরচ লেখার নিয়ম' : 'Cost Entry & Calculation Basis',
      subtitle: isBN ? 'পুরো ব্যাচের মোট খরচ বনাম প্রতি পিসের একক খরচ' : 'Total for Target Qty vs Per Unit Wise',
      explanation: isBN
        ? 'প্রতি পিসের একক খরচ: এখানে টাকার অংক (৳) বসালে তা প্রতি ১ পিসের খরচ বোঝাবে। মোট খরচ বের করতে টার্গেট পিস দিয়ে গুণ হবে।\n\nপুরো ব্যাচের মোট খরচ: এখানে টাকার অংক (৳) বসালে তা পুরো ব্যাচের এককালীন মোট খরচ বোঝাবে। প্রতি পিসের খরচ পেতে টার্গেট পিস দিয়ে ভাগ হবে।'
        : 'Per Unit Wise: Monetary entries (৳) represent cost per single unit. Total expenditure is multiplied by Sales Target Qty.\n\nTotal for Target Qty: Monetary entries (৳) represent total batch expenditure. Unit cost is divided by Sales Target Qty.\n\n(Note: Percentage entries (%) automatically calculate based on unit price regardless of mode).',
      formula: 'Per Unit Mode: Total = Unit Cost * Qty | Total Mode: Unit Cost = Total / Qty',
      tips: isBN
        ? 'গাড়ি ভাড়া বা গোডাউন ভাড়ার মতো এককালীন খরচে "পুরো ব্যাচের মোট খরচ" এবং কার্টন বা কুলির মতো খরচে "প্রতি পিসের একক খরচ" মোড ব্যবহার করুন।'
        : 'Use "Total for Target Qty" for lump-sum costs like warehouse rent or full truck freight, and "Per Unit" for piece-rate items like bags and labor.',
    },

    profitMargin: {
      title: isBN ? 'কত % লাভ করতে চান (মার্জিন)' : 'Target Profit Margin (%)',
      subtitle: isBN ? 'বিক্রি দামের ওপর লাভের শতকরা হার' : 'Profit as a percentage of selling price',
      explanation: isBN
        ? 'বিক্রি দামের শতকরা কত অংশ আপনি নিট লাভ হিসেবে রাখতে চান। মনে রাখবেন এটা মার্জিন, মার্কআপ না (যেমন: ১০০ টাকার বিক্রি দামে ২০ টাকা লাভ রাখতে চাইলে মার্জিন ২০%, কিন্তু খরচ ৮০ টাকার ওপর মার্কআপ হবে ২৫%)।'
        : 'Target net profit as a percentage of net selling price. Note: 20% margin means ৳20 profit on ৳100 selling price, which requires a 25% markup on cost.',
      formula: 'Margin % = (Net Profit / Net Selling Price) * 100',
      tips: isBN
        ? 'খুচরা ব্যবসায় ২০-৩৫% এবং পাইকারিতে ৮-১৫% নিট মার্জিন রাখা সাধারণত ভালো ও বাস্তবসম্মত।'
        : 'Setting a 20-35% margin for retail and 8-15% for wholesale is typical in modern commerce.',
    },

    discount: {
      title: isBN ? 'কাস্টমারকে ডিসকাউন্ট বা ছাড় (%)' : 'Planned Promotional Discount (%)',
      subtitle: isBN ? 'অফার বা ক্যাম্পেইনে দেওয়া মূল্যছাড়' : 'Discount given during sales campaigns',
      explanation: isBN
        ? 'প্রচারণা বা অফারে পণ্যের তালিকা দামের ওপর কাস্টমারকে যে ছাড় দেওয়া হয়। এই ছাড় বাদ দেওয়ার পর যে দাম থাকে সেটাই আপনার আসল কার্যকর বিক্রি দাম।'
        : 'Anticipated discount percentage given to buyers via promo codes, bundle deals, or flash sales. Directly reduces gross retail price to effective net selling price.',
      formula: 'Effective Net Price = List Price * (1 - Discount% / 100)',
      tips: isBN
        ? 'ডিসকাউন্ট দেওয়ার পরেও যেন প্রতি পিসের দাম মালের কেনা খরচের চেয়ে ভালো ব্যবধানে বেশি থাকে সেদিকে খেয়াল রাখুন।'
        : 'Ensure your price after discount remains comfortably above per-unit variable costs.',
    },

    taxes: {
      title: isBN ? 'ট্যাক্স, ভ্যাট ও লাইসেন্স ফি' : 'AIT & Regulatory Taxes',
      subtitle: isBN ? 'সরকারি কর ও ট্রেড লাইসেন্স বাবদ খরচ' : 'Statutory tax and compliance obligations',
      explanation: isBN
        ? 'অগ্রিম আয়কর (AIT), ভ্যাট, পৌরসভার ট্রেড লাইসেন্স নবায়ন ও অন্যান্য সরকারি ফি বাবদ এককালীন বা নির্ধারিত খরচ।'
        : 'Lump-sum Advance Income Tax (AIT), municipal trade license fees, VAT allowances, and local business regulatory fees.',
      formula: 'Tax Outlay = Fixed Municipal & Trade Taxes (৳)',
      tips: isBN
        ? 'অগ্রিম আয়কর বা ভ্যাটের সরকারি রসিদ বা চালান সংরক্ষণ করে রাখুন, যাতে বছর শেষে রিটার্ন ফাইলিংয়ে সুবিধা পাওয়া যায়।'
        : 'Retain official AIT challans to claim tax credits during year-end income tax filings.',
    },

    sourcingModel: {
      title: isBN ? 'পণ্য কেনার সোর্স ও খরচ' : 'Sourcing Models & Procurement Costs',
      subtitle: isBN ? 'দেশি বাজার, আমদানি বা কারখানায় তৈরি' : 'Local, Import, or Manufacturing',
      explanation: isBN
        ? 'দেশি বাজার থেকে কেনা: চকবাজার বা আড়ত থেকে কেনা (গাড়ি ভাড়া, কুলি, হাট খাজনা ও কমিশন)।\n\nআমদানি: বিদেশ থেকে আমদানি (এলসি চার্জ, কাস্টমস ট্যাক্স, বন্দর ডেমারেজ ও সিঅ্যান্ডএফ এজেন্ট বিল)।\n\nকারখানায় তৈরি: নিজস্ব ফ্যাক্টরিতে উৎপাদন (কারিগর মজুরি, বিদ্যুৎ/গ্যাস বিল, কাঁচামাল ও প্রাথমিক প্যাকেট)।'
        : 'Local Procurement: Inland freight, labor handling, market tolls, and procurement brokerage.\n\nImport Sourcing: LC margins, customs duties (CD, SD, RD), port demurrage, shipping line freights, and C&F agent charges.\n\nManufacturing: Direct factory wages, electricity/gas utilities, machine depreciation, and packaging overhead.',
      formula: 'Sourcing Total = Base Purchase/Mfg Cost + Sourcing Overhead Items',
      tips: isBN
        ? 'আমদানির ক্ষেত্রে পোর্ট ডেমারেজ জরিমানা এড়াতে আগেই সিঅ্যান্ডএফ এজেন্টের মাধ্যমে কাগজপত্র ক্লিয়ার রাখুন।'
        : 'Ensure import documentation is pre-cleared to avoid costly port container demurrage fees.',
    },

    stockingModel: {
      title: isBN ? 'গোডাউন ও পণ্য রাখার খরচ' : 'Stocking & Warehousing Models',
      subtitle: isBN ? 'নিজের গোডাউন, ভাড়া, ৩পিএল বা সরাসরি ডেলিভারি' : 'Own, Rented, 3PL Fulfillment, or Cross-Docking',
      explanation: isBN
        ? 'নিজের গোডাউন: পৌর ট্যাক্স, স্টাফ বেতন ও বিদ্যুৎ বিল।\n\nভাড়া গোডাউন: প্রতি মাসের ভাড়া, মাল ওঠানো-নামানোর কুলি মজুরি।\n\n৩পিএল ফুলফিলমেন্ট: দারাজ বা স্টেডফাস্টের তাক ভাড়া এবং পিক-প্যাক অর্ডার হ্যান্ডলিং ফি।\n\nসরাসরি ডেলিভারি: গোডাউন ছাড়াই গাড়ি থেকে সরাসরি ডেলিভারি।'
        : 'Own Warehouse: Property holding taxes, full-time staff, and asset depreciation.\n\nRented Warehouse: Monthly godown lease, in/out movement labor, and power bills.\n\n3PL Fulfillment: Marketplace storage (Daraz Mall/FBD), pick-pack, and barcode tagging.\n\nOn-Spot Cross-Docking: Immediate transfer without warehouse storage.',
      formula: 'Stocking Total = Sum of Storage, Handling & Security Costs',
      tips: isBN
        ? 'অনলাইন বিজনেসে দ্রুত ডেলিভারির জন্য দারাজ বা ৩পিএল ফুলফিলমেন্ট ব্যবহার করলে গোডাউনের স্থায়ী ভাড়া ও ঝামেলা বাঁচে।'
        : 'Utilizing 3PL fulfillment can reduce fixed overhead and speed up same-day order dispatch.',
    },

    salesModel: {
      title: isBN ? 'বিক্রি ও ডেলিভারি চ্যানেল' : 'Sales Channels & Pricing Structure',
      subtitle: isBN ? 'খুচরা অনলাইন সেলস বনাম পাইকারি ডিলার' : 'Retail / E-commerce vs Bulk / Wholesale',
      explanation: isBN
        ? 'খুচরা ও অনলাইন: প্রতি পিসের খুচরা দর, পার্সেল কুরিয়ার চার্জ, বিকাশ/নগদ গেটওয়ে ফি এবং ফেসবুক বুস্টিং।\n\nপাইকারি ও ডিলার: একাধিক পাইকারি রেট ও বিক্রির ভাগ (%)। সব রেট মিলিয়ে স্বয়ংক্রিয়ভাবে গড় দাম হিসাব করা হয়।'
        : 'Retail / E-commerce: Single retail price with parcel courier charges, MFS payment fees (bKash/Nagad), and digital ad boosts.\n\nBulk / Wholesale: Multi-tier wholesale pricing with sales volume share (%). Calculates a volume-weighted average selling price.',
      formula: 'Weighted Average Wholesale Price = Σ (Tier Price * Tier Mix %) / Σ Tier Mix %',
      tips: isBN
        ? 'পাইকারিতে মাল বিক্রির সময় কিছু টাকা বাকিতে আটকে যাওয়ার ঝুঁকি থাকে, তাই হিসাবের মধ্যে ১-২% ব্যয়ের প্রভিশন রাখা ভালো।'
        : 'Always budget a 1-2% bad debt allowance when extending credit terms to wholesale dealers.',
    },

    bulkTiers: {
      title: isBN ? 'পাইকারি রেট ও বিক্রির ভাগ (%)' : 'Bulk Price Levels & Sales Mix',
      subtitle: isBN ? 'সব রেট মিলিয়ে গড় বিক্রি দর' : 'Volume-Weighted Average Selling Price',
      explanation: isBN
        ? 'পাইকারি ও ডিলার চ্যানেলে পণ্য বিভিন্ন মূল্যে বিভিন্ন পার্টি বা এলাকার কাছে বিক্রি হয়। প্রতিটি রেটের বিক্রির ভাগ (%) মিলিয়ে মোট ১০০% হতে হয়। সিস্টেম এই শতকরা ভাগের ওপর ভিত্তি করে স্বয়ংক্রিয়ভাবে একটি গড় বিক্রি দর বের করে নেয়।'
        : 'In wholesale and distribution channels, products are sold across multiple pricing tiers with differing sales volumes. Each tier is assigned a sales share (%) that must sum to exactly 100%. The system computes the volume-weighted average selling price across all tiers.',
      formula: 'Weighted Average Selling Price = Σ (Tier Price * Tier Mix %) / Total Share %',
      breakdown: [
        ...(Array.isArray(bulkPrices)
          ? bulkPrices.map((bp, i) => ({
              label: bp.name || `${isBN ? 'পাইকারি রেট' : 'Tier'} ${i + 1}`,
              value: `৳${Number(bp.price || 0).toFixed(2)} (${Number(bp.mix || 0)}% ${isBN ? 'ভাগ' : 'share'})`,
              note: isBN
                ? `গড়ে প্রভাব: ৳${((Number(bp.price || 0) * Number(bp.mix || 0)) / (totalBulkShare || 1)).toFixed(2)}`
                : `Weighted component: ৳${((Number(bp.price || 0) * Number(bp.mix || 0)) / (totalBulkShare || 1)).toFixed(2)}`,
            }))
          : []),
        {
          label: isBN ? 'মোট বিক্রির ভাগ' : 'Total Sales Mix Share',
          value: `${Number(totalBulkShare.toFixed(1))}%`,
          note:
            Math.abs(totalBulkShare - 100) < 0.001
              ? isBN
                ? '✓ মোট ১০০% সঠিক'
                : '✓ 100% Balanced'
              : isBN
              ? '⚠️ মোট ১০০% হতে হবে'
              : '⚠️ Must sum to 100%',
          highlight: true,
        },
        {
          label: isBN ? 'গড় বিক্রি দাম' : 'Weighted Average Selling Price',
          value: money(calculation.averageSellingPrice),
          highlight: true,
        },
      ],
      tips: isBN
        ? 'সব পাইকারি রেটের অনুপাতের যোগফল ১০০% রাখুন যাতে মোট বিক্রি আয় ও লাভ একদম নিখুঁত হিসাব হয়।'
        : 'Ensure the sum of all tier percentages equals exactly 100% so batch revenue and profit models remain mathematically balanced.',
    },

    returnDisposition: {
      title: isBN ? 'রিটার্ন আসা পণ্যের বাস্তব সমাধান' : 'Return Management Solutions',
      subtitle: isBN ? 'রিটার্ন মাল কী করবেন?' : '3 Realistic Return Handling Solutions',
      explanation: isBN
        ? '১. আবার নতুন প্যাকেট করে বিক্রি: রিটার্ন আসা পণ্য পরীক্ষা ও নতুন প্যাকেট করে আবার বিক্রি করা হয়। এতে পণ্য নষ্ট হয় না, শুধু নতুন প্যাকেট ও কুরিয়ারের বাড়তি খরচটুকু যোগ হয়।\n\n২. কম দামে বা স্ক্র্যাপে বিক্রি: ক্ষতিগ্রস্ত পণ্য আসল দামে বিক্রি করা যায় না, কম দামে ছেড়ে দিতে হয়। এতে কিছু টাকা উদ্ধার হলেও বাকিটুকু লোকসান হয়।\n\n৩. ফেলে দেওয়া / পুরো লস: পণ্য সম্পূর্ণ নষ্ট বা ভাঙা হওয়ায় কোনো বিক্রি দাম পাওয়া যায় না। পুরো পণ্যের কেনা দাম লোকসান হয় এবং ময়লা ফেলার বাড়তি খরচ লাগে।'
        : '1. Resell / Repack: Returned items are repacked and resold. Returned quantity is included in total sold quantity; expenses increase by repackaging & courier costs.\n\n2. Scrap: Items sold at a steep discount, yielding partial salvage cash while writing down net inventory loss.\n\n3. Dispose: Zero recovery value. 100% inventory cost is written off as an unrecoverable loss, plus disposal/dumping fees.',
      formula: 'Resell: 100% Sold | Scrap: Net Scrap Loss = Inventory Cost - Scrap Recovery | Dispose: 100% Inventory Loss + Disposal Fee',
      tips: isBN
        ? 'অনলাইন বিজনেসে কসমেটিকস ও পোশাক জাতীয় পণ্য ভালো করে চেক করে আবার নতুন প্যাকেটে বিক্রি করাই সবচেয়ে বুদ্ধিমানের কাজ।'
        : 'For eCommerce fashion and dry goods, repacking and reselling is the most profitable resolution.',
    },

    returnLogistics: {
      title: isBN ? 'রিটার্ন কুরিয়ারের খরচ' : 'Return Courier Logistics',
      subtitle: isBN ? 'কাস্টমারের দেওয়া চার্জ বনাম কুরিয়ার বিল' : 'Customer return fee vs courier partner freight',
      explanation: isBN
        ? 'কাস্টমারের কাছ থেকে অগ্রিম বা ফেরত বাবদ নেওয়া ডেলিভারি ফি বনাম কুরিয়ার কোম্পানিকে (পাঠাও/স্টেডফাস্ট) দেওয়া পার্সেল রিটার্ন চার্জের পার্থক্য।'
        : 'Advance courier fee collected from customers vs reverse shipping charges billed by logistics courier companies.',
      formula: 'Net Return Logistics Outlay = Return Courier Cost Paid - Return Fee Collected',
      tips: isBN
        ? 'কাস্টমারের কাছ থেকে ডেলিভারি চার্জটা আগেই বিকাশ/নগদে নিয়ে নিলে রিটার্ন আসলেও কুরিয়ার বিলের বাড়তি লোকসান হয় না।'
        : 'Collecting delivery charges upfront eliminates the risk of courier loss on fake orders.',
    },

    payback: {
      title: isBN ? 'বিনিয়োগ ফেরত পেতে সময়' : 'Payback Period',
      subtitle: isBN ? 'যে টাকা ঢুকিয়েছেন, কত দিনে ফেরত আসবে' : 'How long until the upfront capital comes back',
      explanation: isBN
        ? 'মাল কেনা ও ব্যবসা চালাতে যে নগদ টাকা আগে ঢুকিয়েছেন, বর্তমান লাভের হারে সেই টাকা তুলে আনতে কত দিন লাগবে। লাভ না হলে বা লস হলে বিনিয়োগ কোনোদিন ফেরত আসবে না, তখন এই হিসাবটি খালি থাকে।'
        : 'The number of days needed to recover the upfront cash outlay from the profit this batch generates. If the batch runs at a loss there is no payback, so the metric is shown as unavailable.',
      formula: 'Payback Days = (Working Capital / Net Profit) × Input Horizon Days',
      breakdown: [
        {
          label: isBN ? 'মোট নগদ বিনিয়োগ' : 'Working Capital Outlay',
          value: scaleMoney(calculation.workingCapital),
        },
        {
          label: isBN ? 'প্রতি সময়ে নিট লাভ' : 'Net Profit this Period',
          value: scaleMoney(calculation.netProfit),
        },
        {
          label: isBN ? 'বিনিয়োগ ফেরতের সময়' : 'Payback',
          value:
            calculation.paybackDays !== null
              ? `${Math.round(calculation.paybackDays).toLocaleString()} ${isBN ? 'দিন' : 'days'}`
              : isBN
                ? 'বর্তমান লাভে ফেরত আসবে না'
                : 'Never at this profit',
          highlight: true,
        },
      ],
      tips: isBN
        ? 'বিনিয়োগ ফেরতের সময় কমাতে মাল বেশি দিন গুদামে রাখবেন না এবং বিক্রি বাড়ানোর পাশাপাশি অপ্রয়োজনীয় খরচ কমান।'
        : 'Shorten payback by moving stock faster, raising contribution per unit, and cutting overhead that does not drive sales.',
    },

    maxDiscount: {
      title: isBN ? 'সর্বোচ্চ নিরাপদ ছাড়' : 'Maximum Safe Discount',
      subtitle: isBN ? 'এর বেশি ছাড় দিলে লস শুরু হবে' : 'The discount ceiling before the business loses money',
      explanation: isBN
        ? 'বর্তমান দাম ও খরচে আপনি সর্বোচ্চ কত শতাংশ ছাড় দিতে পারেন, যাতে লাভ ঠিক শূন্য থাকে। এর চেয়ে বেশি ছাড় দিলে প্রতি পিসে লস হবে। এই সীমাটা জেনে রাখলে বিজ্ঞাপনী অফার বা পাইকারি দর ঠিক করা সহজ হয়।'
        : 'The largest discount off the current list price that still leaves the business at zero profit. Any discount beyond this loses money on every unit, which makes it a hard floor for promotions and wholesale negotiations.',
      formula: 'Max Discount % = (1 - Break-Even Net Price / Current List Price) × 100',
      breakdown: [
        {
          label: isBN ? 'বর্তমান তালিকা দাম' : 'Current List Price',
          value: money(calculation.averageSellingPrice),
        },
        {
          label: isBN ? 'এখনকার ছাড়ের পরের দাম' : 'Net Price after Current Discount',
          value: money(calculation.sellingPriceAfterDiscount),
        },
        {
          label: isBN ? 'লস না হওয়ার আসল দাম' : 'Break-Even Net Price',
          value:
            calculation.breakEvenNetPrice !== null
              ? money(calculation.breakEvenNetPrice)
              : 'N/A',
        },
        {
          label: isBN ? 'সর্বোচ্চ নিরাপদ ছাড়' : 'Maximum Safe Discount',
          value: `${(calculation.maxDiscountPercent || 0).toFixed(1)}%`,
          highlight: true,
        },
        {
          label: isBN ? 'বর্তমান ছাড়ে ছেড়ে দেওয়া লাভ' : 'Profit Given Up to Current Discount',
          value: scaleMoney(calculation.discountImpactAmount),
        },
      ],
      tips: isBN
        ? 'ছাড় দেওয়ার আগে এই সীমাটা দেখে নিন। ছাড়ের বদলে ফ্রি ডেলিভারি বা ছোট গিফট দিলে অনেক সময় কম খরচে বেশি বিক্রি পাওয়া যায়।'
        : 'Check this ceiling before launching a promotion. A small free gift or free delivery often protects margin better than a deep price cut.',
    },

    scenarios: {
      title: isBN ? 'বিক্রি ও খরচ বাড়লে-কমলে কী হবে' : 'Sales & Cost Scenarios',
      subtitle: isBN ? 'একই ব্যবসার তিনটি সম্ভাব্য অবস্থা' : 'Stress-testing the same plan',
      explanation: isBN
        ? 'বিক্রি ২০% কমলে, ২০% বাড়লে এবং সব খরচ ১০% বাড়লে লাভ-লস কেমন দাঁড়াবে তা দেখানো হয়। কম বিক্রির হিসাবে ধরা হয় মাল আগেই কেনা হয়ে গেছে, তাই অবিক্রিত পিসের কেনা দামও লসে যোগ হয়। বেশি বিক্রির হিসাবে বাড়তি পিস কিনতে হবে ধরা হয়।'
        : 'Shows the profit if sales fall 20%, rise 20%, or all costs rise 10%. The downside assumes the batch is already purchased, so unsold units still carry their inventory cost. The upside assumes extra units must be bought at the normal landed cost.',
      formula: 'Scenario Profit = Base Profit ± Change in Sold Units × Unit Contribution | Cost Shock = Profit - 10% of Cash Costs',
      breakdown: [
        {
          label: isBN ? 'বিক্রি ২০% কমলে' : 'If sales fall 20%',
          value: scaleMoney(calculation.scenarioWorst),
        },
        {
          label: isBN ? 'এখন যেভাবে হিসাব' : 'At your current plan',
          value: scaleMoney(calculation.scenarioBase),
          highlight: true,
        },
        {
          label: isBN ? 'বিক্রি ২০% বাড়লে' : 'If sales rise 20%',
          value: scaleMoney(calculation.scenarioBest),
        },
        {
          label: isBN ? 'সব খরচ ১০% বাড়লে' : 'If all costs rise 10%',
          value: scaleMoney(calculation.costShockProfit),
        },
        {
          label: isBN ? 'লস শুরুর আগে বিক্রি কমতে পারে' : 'Sales can fall before a loss',
          value: `${(calculation.salesDropToLossPercent || 0).toFixed(1)}%`,
        },
      ],
      tips: isBN
        ? 'যে অবস্থাতেই লস দেখাচ্ছে, সেই খরচ বা দামটা আগে ঠিক করুন। ব্যবসার নিরাপত্তা হলো খারাপ সময়েও যাতে লস না হয়।'
        : 'Fix the input that turns every scenario into a loss first. A resilient business still covers its costs in the downside case.',
    },

    cashFlow: {
      title: isBN ? 'হাতে থাকা নগদ বনাম লাভ' : 'Cash Flow vs Accounting Profit',
      subtitle: isBN ? 'হিসাবের লাভ আর পকেটে থাকা টাকা একই কি না' : 'Is the profit actually in your hand?',
      explanation: isBN
        ? 'এই ক্যালকুলেটরে সব খরচই নগদে দেওয়া হয়, তাই হিসাবের নিট লাভ আর সব খরচের পরে হাতে থাকা নগদ একই হয়। বাস্তবে পাইকারি বাকিতে বিক্রি করলে টাকা পরে আসতে পারে, তখন লাভ থাকলেও হাতে নগদ কম থাকবে।'
        : 'Every cost in this calculator is a cash cost, so cash left after all payments equals accounting net profit. In real wholesale trade, credit sales can delay the cash even when the books show a profit.',
      formula: 'Cash Left = Cash Inflow - Cash Outflow | Cash Inflow = Sales + Scrap + Delivery + Return Fees',
      breakdown: [
        {
          label: isBN ? 'হাতে আসা নগদ' : 'Cash Inflow',
          value: scaleMoney(calculation.cashInflow),
        },
        {
          label: isBN ? 'খরচে যাওয়া নগদ' : 'Cash Outflow',
          value: `- ${scaleMoney(calculation.cashOutflow)}`,
        },
        {
          label: isBN ? 'সব খরচের পরে হাতে থাকা নগদ' : 'Cash Left after All Costs',
          value: scaleMoney(calculation.cashProfit),
          highlight: true,
        },
        {
          label: isBN ? 'হিসাবের নিট লাভ' : 'Accounting Net Profit',
          value: scaleMoney(calculation.netProfit),
        },
      ],
      tips: isBN
        ? 'বাকিতে বিক্রি করলে কত টাকা কখন আসবে তার একটা তালিকা রাখুন। লাভ থাকলেও নগদ শেষ হয়ে গেলে ব্যবসা চালানো কঠিন হয়ে যায়।'
        : 'Track receivables by due date. Running out of cash is possible even in a profitable business when credit sales pile up.',
    },

    inventoryTurnover: {
      title: isBN ? 'মাল কত দ্রুত ঘুরছে' : 'Inventory Turnover',
      subtitle: isBN ? 'একই মাল বছরে কতবার বিক্রি হচ্ছে' : 'How many times the stock sells through in a year',
      explanation: isBN
        ? 'বছরে আপনার পণ্য কতবার কেনা ও বিক্রি হচ্ছে তার হিসাব। সংখ্যাটা বেশি হলে মাল দ্রুত বিক্রি হচ্ছে এবং টাকা আটকে থাকছে না। সংখ্যাটা কম হলে গুদামে মাল জমছে, টাকা আটকে আছে এবং পুরনো বা নষ্ট হওয়ার ঝুঁকি বাড়ছে।'
        : 'How many times the annualised cost of goods sold covers the inventory value. A higher number means stock moves quickly and cash is not tied up. A low number means slow-moving stock, tied-up capital, and a higher risk of damage or expiry.',
      formula: 'Turns per Year = Annualised COGS / Inventory Value | Days Held = 365 / Turns',
      breakdown: [
        {
          label: isBN ? 'এই সময়ের COGS' : 'COGS this Period',
          value: scaleMoney(calculation.cogs),
        },
        {
          label: isBN ? 'বছরের হিসাবে COGS' : 'Annualised COGS',
          value: money(calculation.cogs * (365 / (calculation.horizonDays || 365))),
        },
        {
          label: isBN ? 'মালের মোট মূল্য' : 'Inventory Value',
          value: scaleMoney(calculation.inventoryCost),
        },
        {
          label: isBN ? 'বছরে কতবার ঘুরছে' : 'Turns per Year',
          value: `${(calculation.inventoryTurnsPerYear || 0).toFixed(1)}x`,
          highlight: true,
        },
        {
          label: isBN ? 'মাল হাতে থাকার দিন' : 'Days Inventory Held',
          value:
            calculation.daysInventoryHeld !== null
              ? `${Math.round(calculation.daysInventoryHeld)} ${isBN ? 'দিন' : 'days'}`
              : 'N/A',
        },
      ],
      tips: isBN
        ? 'যে পণ্য সবচেয়ে ধীরে বিক্রি হয় সেটা চিহ্নিত করুন এবং অর্ডার কমিয়ে দিন। দ্রুত ঘোরা মালেই টাকা বেশি ঘোরে।'
        : 'Identify the slowest-moving items and reduce their order quantities. Fast turns keep working capital free.',
    },

    dailyTargets: {
      title: isBN ? 'প্রতিদিন ও প্রতি মাসে কত বেচতে হবে' : 'Daily & Monthly Sales Targets',
      subtitle: isBN ? 'আপনার টার্গেটকে ছোট ছোট ভাগে ভাগ করুন' : 'Breaking the target into everyday goals',
      explanation: isBN
        ? 'আপনি যে সময়ের জন্য হিসাব করছেন (দিন, সপ্তাহ, মাস বা বছর), সেই টার্গেটকে প্রতিদিন ও প্রতি মাসে ভাগ করে দেখানো হয়। এতে করে বড় টার্গেটটাও সহজে বোঝা যায় এবং প্রতিদিন কত অর্ডার দরকার তা পরিকল্পনা করা যায়।'
        : 'Converts the sales target for your selected horizon into daily and monthly units and revenue. Smaller goals are easier to plan, track, and assign to a sales routine.',
      formula: 'Units per Day = Target Units / Horizon Days | Units per Month = Units per Day × (365 / 12)',
      breakdown: [
        {
          label: isBN ? 'প্রতিদিন কত পিস' : 'Units per Day',
          value: `${(calculation.targetUnitsPerDay || 0).toFixed(2)} ${t('units')}`,
          highlight: true,
        },
        {
          label: isBN ? 'প্রতিদিনের বিক্রি আয়' : 'Revenue per Day',
          value: money(calculation.targetRevenuePerDay),
        },
        {
          label: isBN ? 'প্রতি মাসে কত পিস' : 'Units per Month',
          value: `${Math.round(calculation.targetUnitsPerMonth || 0).toLocaleString()} ${t('units')}`,
        },
        {
          label: isBN ? 'প্রতি মাসের বিক্রি আয়' : 'Revenue per Month',
          value: money(calculation.targetRevenuePerMonth),
        },
      ],
      tips: isBN
        ? 'প্রতিদিনের টার্গেটটা লিখে রাখুন এবং দিনশেষে মিলিয়ে দেখুন। ছোট ছোট জয়েই বড় টার্গেট পূরণ হয়।'
        : 'Write the daily number where the team can see it and compare it at the end of every day. Small consistent wins close the monthly target.',
    },

    decisionVerdict: {
      title: isBN ? 'সিদ্ধান্তের সারসংক্ষেপ' : 'Decision Snapshot',
      subtitle: isBN ? 'হিসাবের মূল কথা এক নজরে' : 'The bottom line at a glance',
      explanation: isBN
        ? 'সব হিসাব মিলিয়ে এই পণ্যটি এখন লাভজনক, খুবই কম লাভে চলছে, নাকি লস করছে তা দেখানো হয়। সাথে লস এড়াতে কত পিস লাগবে, সর্বোচ্চ কত ছাড় দেওয়া যাবে, বিনিয়োগ কত দিনে ফেরত আসবে এবং বিক্রি কতটা কমলে লস শুরু হবে তা এক জায়গায় দেখা যায়।'
        : 'Summarises whether the product is profitable, running on a thin margin, or losing money, together with the minimum volume, discount ceiling, payback time, and sales cushion. Use it as the first check before approving a price, discount, or purchase.',
      formula: 'Verdict = Net Profit > 0 ? (Safety Margin >= 20% ? Healthy : Thin) : Loss',
      breakdown: [
        {
          label: isBN ? 'এখন যেভাবে হিসাব, তাতে লাভ' : 'Profit at the Current Plan',
          value: scaleMoney(calculation.netProfit),
          highlight: true,
        },
        {
          label: isBN ? 'লস এড়াতে কমপক্ষে পিস' : 'Minimum Units to Avoid Loss',
          value:
            calculation.breakEvenQty !== null
              ? `${calculation.breakEvenQty.toLocaleString()} ${t('units')}`
              : isBN
                ? 'দাম খরচের চেয়ে কম'
                : 'Price below cost',
        },
        {
          label: isBN ? 'সর্বোচ্চ নিরাপদ ছাড়' : 'Maximum Safe Discount',
          value: `${(calculation.maxDiscountPercent || 0).toFixed(1)}%`,
        },
        {
          label: isBN ? 'লস শুরুর আগে বিক্রি কমতে পারে' : 'Sales Cushion Before Loss',
          value: `${(calculation.salesDropToLossPercent || 0).toFixed(1)}%`,
        },
      ],
      tips: isBN
        ? 'লাভের পরিমাণ দেখে সিদ্ধান্ত নিন, শুধু বিক্রির পরিমাণ দেখে নয়। বেশি বিক্রি করেও লস হতে পারে যদি প্রতি পিসে খরচ বেশি হয়।'
        : 'Judge the business by profit per unit and the safety cushion, not by sales volume alone. High sales with negative contribution still lose money.',
    },
  };

  return explanations[metricKey] || null;
};
