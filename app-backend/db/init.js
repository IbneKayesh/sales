// Initialize tables
const initTables = () => {
  // Users table for authentication
  db.serialize(() => {

    // Bank Accounts table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        bank_account_id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        account_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        opening_date TEXT,
        debit_balance REAL DEFAULT 0,
        credit_balance REAL DEFAULT 0,
        current_balance REAL DEFAULT 0,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        contact_id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        contact_address TEXT,
        contact_type TEXT,
        current_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // Purchase Payments table
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        bank_account_id TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        payment_mode TEXT NOT NULL,
        payment_date TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        ref_no TEXT,
        payment_amount REAL DEFAULT 0,
        order_amount REAL DEFAULT 0,
        payment_note TEXT,
        ref_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
      )
    `);

    // Purchase Order Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS po_master (
        po_master_id TEXT PRIMARY KEY,
        order_type TEXT NOT NULL,
        order_no TEXT NOT NULL,
        order_date TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        ref_no TEXT,
        order_note TEXT,
        order_amount REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        cost_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        is_paid TEXT NOT NULL,
        is_posted BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        other_cost REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
      )
    `);

    // Purchase Order Child table
    db.run(`
      CREATE TABLE IF NOT EXISTS po_child (
        id TEXT PRIMARY KEY,
        po_master_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        item_rate REAL NOT NULL,
        booking_qty REAL NOT NULL,
        order_qty REAL NOT NULL,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        item_amount REAL NOT NULL,
        cost_rate REAL DEFAULT 0,
        item_note TEXT,
        ref_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (po_master_id) REFERENCES po_master (po_master_id) ON DELETE RESTRICT,
        FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE RESTRICT
      )
    `);

    // Sales Order Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS so_master (
        so_master_id TEXT PRIMARY KEY,
        so_date TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        so_note TEXT,
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        is_paid BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
      )
    `);

    // Sales Order Child table
    db.run(
      `CREATE TABLE IF NOT EXISTS so_child (
        id TEXT PRIMARY KEY,
        so_master_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        item_rate REAL NOT NULL,
        order_item_qty REAL NOT NULL,
        return_item_qty REAL DEFAULT 0,
        item_qty REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        item_amount REAL NOT NULL,
        item_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (so_master_id) REFERENCES so_master (so_master_id) ON DELETE RESTRICT,
        FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE RESTRICT
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating tables:", err);
        } else {
          // Initialize data after tables are created
          initData(() => {
            console.log(
              "Database tables initialized and default data inserted."
            );
          });
        }
      }
    );
  });
};

// Initialize default data
const initData = (callback) => {
  db.serialize(() => {


    // Insert default bank account
    db.run(
      `
      INSERT OR IGNORE INTO bank_accounts (bank_account_id, bank_name, account_name, account_number, opening_date, debit_balance, credit_balance, current_balance, is_default) VALUES
      ('1', 'Petty Cash', 'Daily Cash Book', '1234-5678-9012', strftime('%Y-%m-%d', 'now'), 0, 0, 0, 1)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default bank account:", err);
        } else {
          console.log("Default bank account inserted.");
        }
      }
    );

    // Insert default contacts
    db.run(
      `
      INSERT OR IGNORE INTO contacts (contact_id, contact_name, contact_address, contact_type, current_balance) VALUES
      ('0', 'Adjustment A/C', 'for internal transaction', 'Both', 0),
      ('1', 'Supplier 1', '', 'Supplier', 0),
      ('2', 'Supplier 2', '', 'Supplier', 0),
      ('3', 'Customer 1', '', 'Customer', 0),
      ('4', 'Customer 2', '', 'Customer', 0)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default contacts:", err);
        } else {
          console.log("Default contacts inserted.");
        }
      }
    );





  });
};

module.exports = { db, initTables, initData };
