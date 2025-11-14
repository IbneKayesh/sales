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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Banks table
    db.run(`
      CREATE TABLE IF NOT EXISTS banks (
        bank_id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        bank_account_id INTEGER PRIMARY KEY AUTOINCREMENT,
        bank_id INTEGER,
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
        contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
        contact_name TEXT NOT NULL,
        contact_address TEXT,
        contact_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Units table
    db.run(`
      CREATE TABLE IF NOT EXISTS units (
        unit_id INTEGER PRIMARY KEY AUTOINCREMENT,
        unit_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Items table
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        item_description TEXT,
        small_unit_id INTEGER,
        unit_difference_qty INTEGER DEFAULT 1,
        big_unit_id INTEGER,
        stock_qty REAL DEFAULT 0,
        purchase_rate REAL DEFAULT 0,
        sales_rate REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        approx_profit REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (small_unit_id) REFERENCES units (unit_id),
        FOREIGN KEY (big_unit_id) REFERENCES units (unit_id)
      )
    `);

    // Bank Transactions table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_transactions (
        bank_transactions_id INTEGER PRIMARY KEY AUTOINCREMENT,
        bank_account_id INTEGER NOT NULL,
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
        po_master_id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_date TEXT NOT NULL,
        contacts_id INTEGER NOT NULL,
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        po_master_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
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
        so_master_id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_date TEXT NOT NULL,
        contacts_id INTEGER NOT NULL,
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
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        so_master_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
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
          INSERT OR IGNORE INTO users (username, password) VALUES
          ('admin', 'password'),
          ('user', '123456')
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
