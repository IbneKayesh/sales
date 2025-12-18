const account_tables = () => ({
  bank_accounts: `
    CREATE TABLE IF NOT EXISTS bank_accounts (
        account_id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        branch_name TEXT,        
        account_no TEXT NOT NULL,
        account_name TEXT NOT NULL,
        opening_date TEXT,
        current_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `,

    bank_sub_accounts: `
    CREATE TABLE IF NOT EXISTS bank_sub_accounts (
        bank_sub_account_id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        sub_account_name TEXT NOT NULL,
        sub_account_desc TEXT,
        opening_date TEXT,
        current_balance REAL DEFAULT 0,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES bank_accounts (account_id) ON DELETE RESTRICT
    )
    `,

    bank_sub_accounts_ledger: `
    CREATE TABLE IF NOT EXISTS bank_sub_accounts_ledger (
        ledger_id TEXT PRIMARY KEY,
        bank_sub_account_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        ledger_date TEXT NOT NULL,
        ledger_ref TEXT NOT NULL,
        debit_amount REAL DEFAULT 0,
        credit_amount REAL DEFAULT 0,
        ledger_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_sub_account_id) REFERENCES bank_sub_accounts (bank_sub_account_id) ON DELETE RESTRICT,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
    )
    `
});

module.exports = account_tables;