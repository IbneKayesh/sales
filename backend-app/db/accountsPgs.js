// backend-app/db/accountsPgs.js
const accountsPgs = () => {

  const account_heads = `
    CREATE TABLE IF NOT EXISTS accounts_heads (
      head_id TEXT PRIMARY KEY,
      head_name TEXT UNIQUE NOT NULL,
      group_name TEXT NOT NULL,
      group_type TEXT NOT NULL,
      contact_type TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `;

  const accounts_ledger = `
    CREATE TABLE IF NOT EXISTS accounts_ledger (
      ledger_id TEXT PRIMARY KEY NOT NULL,
      head_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      ledger_date TIMESTAMP NOT NULL DEFAULT now(),
      ledger_ref TEXT,
      ledger_note TEXT,
      payment_mode TEXT NOT NULL,
      debit_amount NUMERIC(18,4) DEFAULT 0,
      credit_amount NUMERIC(18,4) DEFAULT 0,
      shop_id TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP NOT NULL DEFAULT now(),
      FOREIGN KEY (head_id) REFERENCES accounts_heads (head_id) ON DELETE SET NULL,
      FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE SET NULL,
      FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE SET NULL,
      FOREIGN KEY (shop_id) REFERENCES shops (shop_id) ON DELETE SET NULL
    );
  `;

  const account_heads_data = [
    //Sales
    {
      head_id: "Z101",
      head_name: "Sales Booking (+)",
      group_name: "Sales",
      group_type: "In",
      contact_type: "Customer",
    },
    {
      head_id: "Z102",
      head_name: "Sales Invoice (-)",
      group_name: "Sales",
      group_type: "Out",
      contact_type: "Customer",
    },
    {
      head_id: "Z103",
      head_name: "Sales Order (+)",
      group_name: "Sales",
      group_type: "In",
      contact_type: "Customer",
    },
    {
      head_id: "Z104",
      head_name: "Sales Return (-)",
      group_name: "Sales",
      group_type: "Out",
      contact_type: "Customer",
    },
    {
      head_id: "Z105",
      head_name: "Sales Customer Expense (+)",
      group_name: "Sales",
      group_type: "In",
      contact_type: "Customer",
    },
    {
      head_id: "Z106",
      head_name: "Sales Expense (-)",
      group_name: "Sales",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z107",
      head_name: "Sales Discount (-)",
      group_name: "Sales",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z108",
      head_name: "Sales VAT (+)",
      group_name: "Sales",
      group_type: "Out",
      contact_type: "Internal",
    },
    //Purchase
    {
      head_id: "Z201",
      head_name: "Purchase Booking (-)",
      group_name: "Purchases",
      group_type: "Out",
      contact_type: "Supplier",
    },
    {
      head_id: "Z202",
      head_name: "Purchase Invoice (+)",
      group_name: "Purchases",
      group_type: "In",
      contact_type: "Supplier",
    },
    {
      head_id: "Z203",
      head_name: "Purchase Order (-)",
      group_name: "Purchases",
      group_type: "Out",
      contact_type: "Supplier",
    },
    {
      head_id: "Z204",
      head_name: "Purchase Return (+)",
      group_name: "Purchases",
      group_type: "In",
      contact_type: "Supplier",
    },
    {
      head_id: "Z205",
      head_name: "Purchase Purchase Expense (-)",
      group_name: "Purchases",
      group_type: "Out",
      contact_type: "Supplier",
    },
    {
      head_id: "Z206",
      head_name: "Purchase Expense (-)",
      group_name: "Purchases",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z207",
      head_name: "Purchase Discount (+)",
      group_name: "Purchases",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z208",
      head_name: "Purchase VAT (+)",
      group_name: "Purchases",
      group_type: "Out",
      contact_type: "Internal",
    },
    //Inventory
    {
      head_id: "Z301",
      head_name: "Stock Out (-)",
      group_name: "Inventory",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z302",
      head_name: "Stock In (+)",
      group_name: "Inventory",
      group_type: "In",
      contact_type: "Internal",
    },
    //Income
    {
      head_id: "Z401",
      head_name: "Gain (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z402",
      head_name: "Salary Deduction (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z403",
      head_name: "Rent Advance Received (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z404",
      head_name: "Rent Adjustment (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z405",
      head_name: "Bank Profit (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z406",
      head_name: "Loan Taken (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z407",
      head_name: "Deposit (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z408",
      head_name: "Asset Sale (+)",
      group_name: "Assets",
      group_type: "In",
      contact_type: "Internal",
    },
    {
      head_id: "Z409",
      head_name: "Other Income (+)",
      group_name: "Income",
      group_type: "In",
      contact_type: "Internal",
    },
    //Expense
    {
      head_id: "Z501",
      head_name: "Loss (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z502",
      head_name: "Salary Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z503",
      head_name: "Rent Advance Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z504",
      head_name: "Rent Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z505",
      head_name: "Electricity Bill (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z506",
      head_name: "Internet Bill (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z507",
      head_name: "Transport Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z508",
      head_name: "Bank Charges (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z509",
      head_name: "Tax Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z510",
      head_name: "Maintenance Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z511",
      head_name: "Loan Payment (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z512",
      head_name: "Asset Purchase (-)",
      group_name: "Assets",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z513",
      head_name: "Other Expense (-)",
      group_name: "Expense",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z514",
      head_name: "Withdraw (-)",
      group_name: "Income",
      group_type: "Out",
      contact_type: "Internal",
    },
    //Transfer
    {
      head_id: "Z601",
      head_name: "Transfer Out (-)",
      group_name: "Transfer",
      group_type: "Out",
      contact_type: "Internal",
    },
    {
      head_id: "Z602",
      head_name: "Transfer In (+)",
      group_name: "Transfer",
      group_type: "In",
      contact_type: "Internal",
    },
  ];

  return { bank, account, account_heads, accounts_ledger, account_heads_data };
};

module.exports = accountsPgs;
