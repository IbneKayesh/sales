/**
 * Domain vocabulary shared by every feature. Labels, tones and the default
 * debit/credit legs of a transaction live here so UI components stay free of
 * business rules.
 */

export const SUB_ACCOUNT_TYPES = {
  Savings: { label: "Savings", tone: "brand" },
  DPS: { label: "DPS", tone: "violet" },
  FD: { label: "FD", tone: "info" },
};

/** All child account types hang off a bank account. */
export const ACCOUNT_TYPES = SUB_ACCOUNT_TYPES;

export const ACCOUNT_TYPE_OPTIONS = Object.entries(SUB_ACCOUNT_TYPES).map(
  ([value, meta]) => ({ value, ...meta })
);

/** Income/expense counter accounts used on the other side of cash movements. */
export const SYSTEM_ACCOUNTS = [
  { code: "EXTERNAL", label: "External / Cash" },
  { code: "PROFIT", label: "Profit income" },
  { code: "CHARGES", label: "Bank charges" },
];

/**
 * Every transaction is a balanced journal: one debit leg and one credit leg.
 * `debit`/`credit` describe the default legs so the form can preselect them.
 */
export const TRANSACTION_TYPES = {
  deposit: {
    label: "Deposit",
    tone: "success",
    debit: "savings",
    credit: "system:EXTERNAL",
  },
  withdraw: {
    label: "Withdrawal",
    tone: "danger",
    debit: "system:EXTERNAL",
    credit: "savings",
  },
  transfer: {
    label: "Sub account transfer",
    tone: "brand",
    debit: "savings",
    credit: "savings",
  },
  "dps-installment": {
    label: "DPS Installment",
    tone: "violet",
    debit: "dps",
    credit: "savings",
  },
  "fd-deposit": {
    label: "FD Deposit",
    tone: "info",
    debit: "fd",
    credit: "savings",
  },
  profit: {
    label: "Profit / Interest",
    tone: "warning",
    debit: "savings",
    credit: "system:PROFIT",
  },
  charge: {
    label: "Bank Charge",
    tone: "neutral",
    debit: "system:CHARGES",
    credit: "savings",
  },
};

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPES).map(
  ([value, meta]) => ({ value, ...meta })
);

export const ACCOUNT_STATUS = {
  active: { label: "Active", tone: "success" },
  closed: { label: "Closed", tone: "neutral" },
};

export const BANK_STATUS = {
  active: { label: "Active", tone: "success" },
  inactive: { label: "Inactive", tone: "neutral" },
};

export const BANK_TYPES = ["Savings", "Current"];

export const INTEREST_PAYMENT_TYPES = ["Yearly", "Half Yearly"];

export const COLLECTIONS = {
  banks: "banks",
  accounts: "accounts",
  savings: "savings",
  transactions: "transactions",
  exampleDocuments: "example_docs",
};
