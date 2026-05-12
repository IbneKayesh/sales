Step 1 → Chart of Accounts
         (Assets, Liabilities, Equity, Income, Expenses)
              ↓
Step 2 → Owner Capital Accounts
         (4 owners — investments, drawings, profit share)
              ↓
Step 3 → Sales & Purchase Vouchers
         (with proper account mapping)
              ↓
Step 4 → Sub-Ledgers
         (Customers, Suppliers, Inventory items, Owner-wise)
              ↓
Step 5 → Later — Orders, Inventory, Production, Delivery


Level 1 → Root / Group         (e.g., ASSETS)
    Level 2 → Sub-Group        (e.g., Current Assets)
        Level 3 → Control COA  (e.g., Accounts Receivable)
            Level 4 → Posted COA (e.g., Trade Receivable)
                Level 5 → Sub-Ledger (e.g., Buyer A, Buyer B)


📋 Complete Revised Sequence
Step 1 → Chart of Accounts (nested, unlimited depth)
              ↓
Step 2 → Define COA Type (Control or Posted)
              ↓
Step 3 → Add Sub-Ledgers to every Posted COA
         (Buyers, Suppliers, Employees, Owners, Internal)
              ↓
Step 4 → Journal Vouchers
         (Every line → Posted COA + Sub-Ledger)
              ↓
Step 5 → Reports auto-generate
         (Trial Balance, P&L, Balance Sheet, Sub-Ledger Reports)



(type like Journal Voucher, Purchase Voucher, Sales Voucher, Accounts Payable, Accounts Receivable, Contra Voucher, Adjustment Voucher)

Scenario 1 — Full Cash Payment
  Dr  Inventory / Expense        (items + extra charges)
  Cr  Cash / Bank                (full payment)

Scenario 2 — Full Credit (no payment)
  Dr  Inventory / Expense        (items + extra charges)
  Cr  Accounts Payable → Supplier (full amount due)

Scenario 3 — Partial Payment
  Dr  Inventory / Expense        (items + extra charges)
  Cr  Cash / Bank                (partial paid)
  Cr  Accounts Payable → Supplier (remaining balance)



📋 Corrected Complete Purchase Flow
Step 1 — Supplier & Items exist in master data
              ↓
Step 2 — Purchase Order (optional, future module)
              ↓
Step 3 — Goods Received
         Inventory increases
              ↓
Step 4 — Purchase Voucher created
         ┌─────────────────────────────────┐
         │ Dr  Raw Material Inventory      │
         │ Dr  Accessories Inventory       │
         │ Dr  Freight / Transport Expense │  ← extra charges
         │ Cr  Cash / Bank (if paid)       │
         │ Cr  Accounts Payable (if credit)│
         └─────────────────────────────────┘
              ↓
Step 5 — Payable sits on Supplier Sub-Ledger
         (visible in Supplier Statement)
              ↓
Step 6 — Payment Voucher (when paying supplier)
         ┌─────────────────────────────────┐
         │ Dr  Accounts Payable → Supplier │
         │ Cr  Cash / Bank                 │
         └─────────────────────────────────┘
         references original Purchase Voucher
              ↓
Step 7 — Payable cleared (partial or full)
         Supplier balance reduces accordingly

lets the things clear me in very felxible to mode to cover most business, not hardcoded
purchase master most important columns
-id
-supplier id (is already mapped to sub-ledger party accounts)
-total value of this invoice
-total discount of this invoice
-total vat of this invoice
-total extra cost of this invoice

purchase details most important columns
-id
-master id
-item id


item master most important columns
-id
-item name
-item group id

item group most important columns
-id
-group name

purchase journal posting rules templates
total value with sub-ledger id with dr/cr
total discount with sub-ledger id with dr/cr
total vat with sub-ledger id with dr/cr
total extra cost with sub-ledger id with dr/cr

each item group also creates the sub-ledger party accounts with type inventory items group