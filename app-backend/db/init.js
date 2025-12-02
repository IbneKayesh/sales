    // Bank Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_trans (
        bank_trans_id TEXT PRIMARY KEY,
        bank_account_id TEXT NOT NULL,
        trans_date TEXT NOT NULL,
        trans_head TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        trans_name TEXT NOT NULL,
        ref_no TEXT,
        trans_details TEXT,
        debit_amount REAL DEFAULT 0,
        credit_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_account_id) REFERENCES bank_accounts (bank_account_id) ON DELETE RESTRICT
        FOREIGN KEY (contact_id) REFERENCES bank_accounts (contact_id) ON DELETE RESTRICT
      )
    `);