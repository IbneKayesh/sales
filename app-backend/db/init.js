// Initialize tables
const initTables = () => {
  // Users table for authentication
  db.serialize(() => {

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


module.exports = { db, initTables, initData };
