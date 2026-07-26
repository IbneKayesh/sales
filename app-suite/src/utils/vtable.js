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

const itype_Options = [
  { label: "Raw Material (RM)", value: "RM" },
  { label: "Packing Material (PM)", value: "PM" },
  { label: "Semi Finished (SFG)", value: "SFG" },
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
  { label: "Customer", value: "Customer", auto_create: true },
  { label: "Supplier", value: "Supplier", auto_create: true },
  { label: "Employee", value: "Employee", auto_create: true },
  { label: "Investor", value: "Investor", auto_create: false },
  { label: "Bank", value: "Bank", auto_create: false },
  { label: "Cash", value: "Cash", auto_create: false },
];

const chtac_ntype_Options = [
  { label: "Dr", value: "Dr" },
  { label: "Cr", value: "Cr" },
];

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

const coa_party = [
  {
    label: "Customer Party",
    account: "Assets",
    value: "SYS_COA_PARTY_CUSTOMER",
    key: "Customer",
  },
  {
    label: "Customer Party",
    account: "Liabilites",
    value: "SYS_COA_PARTY_SUPPLIER",
    key: "Supplier",
  },
  {
    label: "Inventory Party",
    account: "Assets > Inventory",
    value: "SYS_COA_PARTY_PRODUCTS",
    key: "Product",
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
};
