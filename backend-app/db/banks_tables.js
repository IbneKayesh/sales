const banks_tables = () => ({
  banks: `
    CREATE TABLE IF NOT EXISTS banks (
        bank_id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        branch_name TEXT,        
        swift_code TEXT,
        current_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `,

    accounts: `
    CREATE TABLE IF NOT EXISTS accounts (
        account_id TEXT PRIMARY KEY,
        bank_id TEXT NOT NULL,
        account_name TEXT NOT NULL,
        account_no TEXT,
        account_note TEXT,
        opening_date TEXT,
        current_balance REAL DEFAULT 0,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_id) REFERENCES banks (bank_id) ON DELETE RESTRICT
    )
    `,

    accounts_ledger: `
    CREATE TABLE IF NOT EXISTS accounts_ledger (
        ledger_id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        head_name TEXT NOT NULL,
        ledger_date TEXT NOT NULL,
        ledger_ref TEXT,
        ledger_note TEXT,
        debit_amount REAL DEFAULT 0,
        credit_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE RESTRICT,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
    )
    `
});

module.exports = banks_tables;