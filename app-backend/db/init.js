const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database path
const dbPath = path.join(__dirname, '../database.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize tables
const initTables = () => {
  // Users table for authentication
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'User',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Banks table
    db.run(`
      CREATE TABLE IF NOT EXISTS banks (
        bank_id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        bank_address TEXT,
        routing_number TEXT,
        debit_balance REAL DEFAULT 0,
        credit_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bank Accounts table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        bank_account_id TEXT PRIMARY KEY,
        bank_id TEXT,
        account_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        opening_date TEXT,
        debit_balance REAL DEFAULT 0,
        credit_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_id) REFERENCES banks (bank_id)
      )
    `);

    // Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        contact_id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        contact_address TEXT,
        contact_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        category_description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Units table
    db.run(`
      CREATE TABLE IF NOT EXISTS units (
        unit_id TEXT PRIMARY KEY,
        unit_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Items table
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        item_id TEXT PRIMARY KEY,
        item_name TEXT NOT NULL,
        item_description TEXT,
        category_id TEXT,
        small_unit_id TEXT,
        unit_difference_qty INTEGER DEFAULT 1,
        big_unit_id TEXT,
        stock_qty REAL DEFAULT 0,
        purchase_rate REAL DEFAULT 0,
        sales_rate REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        approx_profit REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (category_id),
        FOREIGN KEY (small_unit_id) REFERENCES units (unit_id),
        FOREIGN KEY (big_unit_id) REFERENCES units (unit_id)
      )
    `);

    // Bank Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_transactions (
        bank_transactions_id TEXT PRIMARY KEY,
        bank_account_id TEXT NOT NULL,
        transaction_date TEXT NOT NULL,
        transaction_name TEXT NOT NULL,
        reference_no TEXT,
        transaction_details TEXT,
        debit_amount REAL DEFAULT 0,
        credit_amount REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bank_account_id) REFERENCES bank_accounts (bank_account_id)
      )
    `);

    // Purchase Order Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS po_master (
        po_master_id TEXT PRIMARY KEY,
        transaction_date TEXT NOT NULL,
        contacts_id TEXT NOT NULL,
        transaction_note TEXT,
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        is_paid BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contacts_id) REFERENCES contacts (contact_id)
      )
    `);

    // Purchase Order Child table
    db.run(`
      CREATE TABLE IF NOT EXISTS po_child (
        id TEXT PRIMARY KEY,
        po_master_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        item_rate REAL NOT NULL,
        item_qty REAL NOT NULL,
        discount_amount REAL DEFAULT 0,
        item_amount REAL NOT NULL,
        item_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (po_master_id) REFERENCES po_master (po_master_id),
        FOREIGN KEY (item_id) REFERENCES items (item_id)
      )
    `);

    // Sales Order Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS so_master (
        so_master_id TEXT PRIMARY KEY,
        transaction_date TEXT NOT NULL,
        contacts_id TEXT NOT NULL,
        transaction_note TEXT,
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        is_paid BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contacts_id) REFERENCES contacts (contact_id)
      )
    `);

    // Sales Order Child table
    db.run(`
      CREATE TABLE IF NOT EXISTS so_child (
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
        FOREIGN KEY (so_master_id) REFERENCES so_master (so_master_id),
        FOREIGN KEY (item_id) REFERENCES items (item_id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        // Insert default users after tables are created
        db.run(`
          INSERT OR IGNORE INTO users (user_id, username, password, email, role) VALUES
          ('1', 'admin', 'password', 'admin@example.com', 'Admin'),
          ('2', 'user', '123456', 'user@example.com', 'User')
        `, (err) => {
          if (err) {
            console.error('Error inserting default users:', err);
          } else {
            console.log('Database tables initialized and default users inserted.');
          }
        });
      }
    });
  });
};

module.exports = { db, initTables };
