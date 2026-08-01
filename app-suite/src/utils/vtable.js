const cntry_Options = [
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Others", value: "Others" },
];

const crncy_Options = [
  { label: "BDT", value: "BDT" },
  { label: "OTHERS", value: "OTHERS" },
];

const sorce_Options = [
  { label: "Local", value: "Local" },
  { label: "Foreign", value: "Foreign" },
];

const untgr_Options = [
  { label: "Countable", value: "Countable" },
  { label: "Volume", value: "Volume" },
  { label: "Length", value: "Length" },
  { label: "Weight", value: "Weight" },
];

const inout_Options = [
  { label: "Input", value: "Input" },
  { label: "Output", value: "Output" },
];

//COA
const itype_Options = [
  { label: "Raw Material (RM)", value: "RM" },
  { label: "Packing Material (PM)", value: "PM" },
  { label: "Work In Process (WIP)", value: "WIP" },
  { label: "Finished Goods (FG)", value: "FG" },
  { label: "Factory Overhead (FOH)", value: "FOH" },
  { label: "Service (SVC)", value: "SVC" },
];

const bool_Options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const dtype_Options = [
  { label: "TextBox", value: "TextBox" },
  { label: "Dropdown", value: "Dropdown" },
  { label: "Checkbox", value: "Checkbox" },
  { label: "Calendar", value: "Calendar" },
];

const acprd_stats_Options = [
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
  { label: "Locked", value: "Locked" },
];

const party_ptype_Options = [
  { label: "Investor", value: "Investor", auto_create: false },
  { label: "Bank", value: "Bank", auto_create: false },
  { label: "Cash", value: "Cash", auto_create: false },
  { label: "Expenses", value: "Expenses", auto_create: false },
  { label: "Customer", value: "Customer", auto_create: true },
  { label: "Supplier", value: "Supplier", auto_create: true },
  { label: "Employee", value: "Employee", auto_create: true },
  { label: "Product-FG", value: "FG", auto_create: true },
  { label: "Product-RM", value: "RM", auto_create: true },
  { label: "Product-PM", value: "PM", auto_create: true },
  { label: "Product-WIP", value: "WIP", auto_create: true },
  { label: "Product-FOH", value: "FOH", auto_create: true },
  { label: "Product-SVC", value: "SVC", auto_create: true },
];

const chtac_ntype_Options = [
  { label: "Dr", value: "Dr" },
  { label: "Cr", value: "Cr" },
];

//COA
const ctype_Options = [
  { label: "Customer", value: "Customer" },
  { label: "Supplier", value: "Supplier" },
];

const chtac_ctype_Options = [
  { label: "Assets", value: "Assets" },
  { label: "Liabilities", value: "Liabilities" },
  { label: "Equity", value: "Equity" },
  { label: "Income", value: "Income" },
  { label: "Expenses", value: "Expenses" },
];

const jrnlm_trtyp_Options = [
  {
    label: "Journal Voucher",
    value: "Journal Voucher",
  },
  {
    label: "Contra Voucher",
    value: "Contra Voucher",
  },
  {
    label: "Purchase Invoice",
    value: "Purchase Invoice",
  },
  {
    label: "Payment Voucher",
    value: "Payment Voucher",
  },
  {
    label: "Sales Invoice",
    value: "Sales Invoice",
  },
  {
    label: "Receipt Voucher",
    value: "Receipt Voucher",
  },
  {
    label: "Adjustment Entry",
    value: "Adjustment Entry",
  },
];

const trn_types = [
  {
    label: "Material Receipt Report",
    value: "Material Receipt Report",
  },
];

const csmod_Options = [
  {
    label: "Including (Pay to Supplier)",
    value: "Include",
  },
  {
    label: "Excluding (Pay to Local)",
    value: "Exclude",
  },
];

const clmod_Options = [
  {
    label: "By Amount",
    value: "By Amount",
  },
  {
    label: "By Qty",
    value: "By Qty",
  },
  {
    label: "By Line",
    value: "By Line",
  },
];

export {
  cntry_Options,
  crncy_Options,
  sorce_Options,
  untgr_Options,
  inout_Options,
  itype_Options,
  bool_Options,
  dtype_Options,
  acprd_stats_Options,
  party_ptype_Options,
  chtac_ntype_Options,
  ctype_Options,
  chtac_ctype_Options,
  jrnlm_trtyp_Options,
  trn_types,
  csmod_Options,
  clmod_Options,
};
