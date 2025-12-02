const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database path
const dbPath = path.join(__dirname, "../database.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Initialize tables
const initTables = () => {
  // users :: Authentication table
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

    // units :: Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS units (
        unit_id TEXT PRIMARY KEY,
        unit_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // categories :: Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // products :: Inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        product_id TEXT PRIMARY KEY,
        product_code TEXT,
        product_name TEXT NOT NULL,
        product_desc TEXT,
        category_id TEXT NOT NULL,
        small_unit_id TEXT NOT NULL,
        unit_difference_qty INTEGER DEFAULT 1,
        large_unit_id TEXT NOT NULL,
        stock_qty INTEGER DEFAULT 0,
        purchase_price REAL DEFAULT 0,
        sales_price REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        margin_price REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
        FOREIGN KEY (small_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,
        FOREIGN KEY (large_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT
      )
    `);

    //setup :: Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        contact_id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        contact_mobile TEXT,
        contact_email TEXT,
        contact_address TEXT,
        contact_type TEXT DEFAULT 'Customer',
        current_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    //Accounts :: Bank Accounts table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        account_id TEXT PRIMARY KEY,
        bank_name TEXT NOT NULL,
        bank_branch TEXT,
        account_name TEXT NOT NULL,
        account_number TEXT NOT NULL,
        opening_date TEXT,
        current_balance REAL DEFAULT 0,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    //Accounts :: Bank Payments table
    db.run(`
      CREATE TABLE IF NOT EXISTS bank_payments (
        payment_id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        payment_head TEXT NOT NULL,
        payment_mode TEXT NOT NULL,
        payment_date TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        ref_no TEXT NOT NULL,
        payment_amount REAL DEFAULT 0,
        payment_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES bank_accounts(account_id) ON DELETE RESTRICT
        FOREIGN KEY (contact_id) REFERENCES contacts(contact_id) ON DELETE RESTRICT
      )
    `);

    //Purchase :: Purchase Master table
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
        vat_amount REAL DEFAULT 0,
        cost_amount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        payable_amount REAL DEFAULT 0,
        payable_note TEXT,
        paid_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        other_cost REAL DEFAULT 0,
        is_paid TEXT NOT NULL,
        is_posted BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
      )
    `);

    //Purchase :: Purchase Details table
    db.run(`
      CREATE TABLE IF NOT EXISTS po_details (
        po_details_id TEXT PRIMARY KEY,
        po_master_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_price REAL DEFAULT 0,
        product_qty REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        product_note TEXT,
        ref_id TEXT,
        return_qty REAL DEFAULT 0,
        sales_qty REAL DEFAULT 0,
        stock_qty REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (po_master_id) REFERENCES po_master(po_master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
      )
    `);
  });
};

// Initialize default data
const initData = (callback) => {
  db.serialize(() => {
    // users :: Authentication table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO users (user_id, username, password, email, role) VALUES
      ('1', 'admin', 'password', 'admin@example.com', 'Admin'),
      ('2', 'user', '123456', 'user@example.com', 'User')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default users:", err);
        } else {
          console.log("Default users inserted.");
        }
      }
    );

    // units :: Inventory table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO units (unit_id, unit_name) VALUES
      ('1', 'Kg'),
      ('2', 'Pkt')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default units:", err);
        } else {
          console.log("Default units inserted.");
        }
      }
    );

    // categories :: Inventory table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO categories (category_id, category_name) VALUES
      ('1', 'Grocery')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default categories:", err);
        } else {
          console.log("Default categories inserted.");
        }
      }
    );

    //products :: Inventory table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO products (product_id, product_code, product_name, product_desc,
      category_id, small_unit_id, unit_difference_qty, large_unit_id,
      stock_qty, purchase_price, sales_price, discount_percent, vat_percent, margin_price)
      VALUES
      ('1', 'P01', 'Rice', 'Description Rice', '1', '1', 25, '2', '5', '80', '85', '5', '10', '5'),
      ('2', 'P02', 'Salt', 'Description Salt', '1', '1', 15, '2', '10', '35', '42', '3', '15', '7'),
      ('3', 'P03', 'Sugar', 'Description Sugar', '1', '1', 20, '2', '20', '50', '55', '10', '20', '5'),
      ('4', 'P04', 'Oil', 'Description Oil', '1', '1', 5, '2', '25', '100', '105', '2', '5', '5'),
      ('5', 'P05', 'Tea', 'Description Tea', '1', '1', 2, '2', '20', '70', '80', '0', '0', '10')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default products:", err);
        } else {
          console.log("Default products inserted.");
        }
      }
    );

    //contacts :: Contacts table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type, current_balance)
      VALUES
      ('0', 'Adjustment A/C', '0', '0', 'for internal transaction', 'internal', 0),
      ('1', 'Supplier 1', '1234567890', 'supplier1@example.com', '123 Main St', 'Supplier', 0),
      ('2', 'Supplier 2', '0987654321', 'supplier2@example.com', '456 Elm St', 'Supplier', 0),
      ('3', 'Customer 1', '1234567890', 'customer1@example.com', '123 Main St', 'Customer', 0),
      ('4', 'Customer 2', '0987654321', 'customer2@example.com', '456 Elm St', 'Customer', 0)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default contacts:", err);
        } else {
          console.log("Default contacts inserted.");
        }
      }
    );

    //accounts :: Bank Accounts table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO bank_accounts (account_id, bank_name, bank_branch, account_name, account_number, opening_date, current_balance, is_default)
      VALUES
      ('1', 'Cash', 'Daily Cash', 'Cash', '0', strftime('%Y-%m-%d', 'now'), 0, 1)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default bank accounts:", err);
        } else {
          console.log("Default bank accounts inserted.");
        }
      }
    );

  });
};

module.exports = { db, initTables, initData };
