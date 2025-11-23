const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database path
const dbPath = path.join(__dirname, "../database.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
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

    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
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
        item_code TEXT,
        item_name TEXT NOT NULL,
        item_description TEXT,
        category_id TEXT,
        small_unit_id TEXT,
        unit_difference_qty INTEGER DEFAULT 1,
        big_unit_id TEXT,
        order_qty REAL DEFAULT 0,
        stock_qty REAL DEFAULT 0,
        purchase_rate REAL DEFAULT 0,
        sales_rate REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        margin_rate REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE RESTRICT,
        FOREIGN KEY (small_unit_id) REFERENCES units (unit_id) ON DELETE RESTRICT,
        FOREIGN KEY (big_unit_id) REFERENCES units (unit_id) ON DELETE RESTRICT
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
        total_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        cost_amount REAL DEFAULT 0,
        is_paid BOOLEAN DEFAULT 0,
        is_posted BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
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
    // Insert default users
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

    // Insert default bank account
    db.run(
      `
      INSERT OR IGNORE INTO bank_accounts (bank_account_id, bank_name, account_name, account_number, opening_date, debit_balance, credit_balance, current_balance, is_default) VALUES
      ('ba-1', 'Petty Cash', 'Daily Cash Book', '1234-5678-9012', strftime('%Y-%m-%d', 'now'), 0, 0, 0, 1)
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
      ('0', 'Adjustment', 'for internal transaction', 'Both', 0),
      ('1', 'ABC Suppliers', '', 'Supplier', 0),
      ('2', 'XYZ Customer', '', 'Customer', 0)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default contacts:", err);
        } else {
          console.log("Default contacts inserted.");
        }
      }
    );

   // Insert default categories
db.run(
  `
  INSERT OR IGNORE INTO categories (category_id, category_name) VALUES
    (1, 'Beverages'),
    (2, 'Snacks'),
    (3, 'Dairy'),
    (4, 'Bakery'),
    (5, 'Household')
  `,
  (err) => {
    if (err) console.error("Error inserting default categories:", err);
    else console.log("Default categories inserted.");
  }
);

// Insert default units
db.run(
  `
  INSERT OR IGNORE INTO units (unit_id, unit_name) VALUES
    (1, 'Pcs'),
    (2, 'Pack'),
    (3, 'Bottle'),
    (4, 'Kg'),
    (5, 'Ltr'),
    (6, 'Box'),
    (7, 'Ctn'),
    (8, 'Case'),
    (9, 'Drum')
  `,
  (err) => {
    if (err) {
      console.error("Error inserting default units:", err);
    } else {
      console.log("Default units inserted.");
    }
  }
);

// Insert updated default items
db.run(
  `
  INSERT OR IGNORE INTO items (
    item_id, item_code, item_name, item_description,
    category_id, small_unit_id, unit_difference_qty, big_unit_id,
    order_qty, stock_qty, purchase_rate, sales_rate,
    discount_percent, margin_rate
  ) VALUES
  (1, 'ITM001', 'Coca Cola 1L', 'Soft drink', 1, 5, 12, 7, 0, 0, 45, 55, 5, 10),
  (2, 'ITM002', 'Pepsi 500ml', 'Soft drink', 1, 3, 24, 7, 0, 0, 25, 35, 0, 12),
  (3, 'ITM003', 'Sprite 1L', 'Soft drink', 1, 5, 12, 7, 0, 0, 42, 52, 3, 10),
  (18, 'ITM018', 'Mineral Water 1.5L', 'Drinking Water', 1, 5, 6, 8, 0, 0, 20, 30, 0, 15),
  (4, 'ITM004', 'Potato Chips', 'Salted chips', 2, 2, 24, 6, 0, 0, 15, 25, 0, 15),
  (5, 'ITM005', 'Lays Classic', 'Potato chips', 2, 2, 24, 6, 0, 0, 18, 25, 0, 12),
  (6, 'ITM006', 'Doritos Cheese', 'Nacho chips', 2, 2, 24, 6, 0, 0, 30, 45, 5, 18),
  (17, 'ITM017', 'Chocolate Bar', 'Milk chocolate', 2, 1, 48, 6, 0, 0, 25, 40, 0, 18),
  (7, 'ITM007', 'Milk 1L', 'Packet Milk', 3, 5, 12, 7, 0, 0, 50, 60, 0, 10),
  (8, 'ITM008', 'Cheddar Cheese 1Kg', 'Dairy Cheese', 3, 4, 10, 6, 0, 0, 80, 100, 0, 20),
  (9, 'ITM009', 'Butter 1Kg', 'Salted butter', 3, 4, 10, 6, 0, 0, 40, 55, 0, 18),
  (16, 'ITM016', 'Yogurt Cup 1Kg', 'Dairy yogurt', 3, 4, 10, 6, 0, 0, 20, 30, 0, 15),
  (19, 'ITM019', 'Ghee 1Kg', 'Pure Ghee', 3, 4, 12, 6, 0, 0, 300, 380, 0, 18),
  (10, 'ITM010', 'Bread Loaf', 'Fresh bread', 4, 1, 20, 6, 0, 0, 25, 35, 0, 15),
  (11, 'ITM011', 'Burger Buns', 'Pack of 6', 4, 2, 16, 6, 0, 0, 30, 45, 0, 12),
  (12, 'ITM012', 'Cake Rusk', 'Baked snack', 4, 2, 12, 6, 0, 0, 50, 70, 10, 20),
  (13, 'ITM013', 'Detergent Powder 1Kg', 'Laundry powder', 5, 4, 10, 6, 0, 0, 120, 150, 0, 15),
  (14, 'ITM014', 'Dishwashing Liquid 1L', 'Kitchen cleaner', 5, 5, 12, 7, 0, 0, 60, 85, 5, 18),
  (15, 'ITM015', 'Toilet Cleaner 1L', 'Bathroom cleaner', 5, 5, 12, 7, 0, 0, 110, 140, 0, 12),
  (20, 'ITM020', 'Floor Cleaner 5L', 'Household cleaning liquid', 5, 5, 1, 9, 0, 0, 150, 200, 0, 15)

  `,
  (err) => {
    if (err) {
      console.error("Error inserting default items:", err);
    } else {
      console.log("Default items inserted.");
      if (callback) callback();
    }
  }
);




  });
};

module.exports = { db, initTables, initData };
