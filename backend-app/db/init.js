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

const purchase_tables = require("./purchase_tables");
const purchaseTables = purchase_tables();

const vat_tables = require("./vat_tables");
const vatTables = vat_tables();

const banks_tables = require("./banks_tables");
const banksTables = banks_tables();

// Initialize tables
const initTables = () => {

  Object.values(purchaseTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Purchase Table creation error:", err.message);
      }
    });
  });

  Object.values(vatTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Vat Table creation error:", err.message);
      }
    });
  });

  Object.values(banksTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Banks Table creation error:", err.message);
      }
    });
  });

  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        setting_id TEXT PRIMARY KEY,
        setting_page TEXT NOT NULL,
        setting_name TEXT NOT NULL,
        setting_key TEXT NOT NULL,
        setting_value TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
  // users :: Authentication table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        user_name TEXT UNIQUE NOT NULL,
        user_password TEXT NOT NULL,
        user_mobile TEXT,
        user_email TEXT,
        user_role TEXT DEFAULT 'User',
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
        stock_qty REAL DEFAULT 0,
        purchase_price REAL DEFAULT 0,
        sales_price REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        vat_percent REAL DEFAULT 0,
        cost_price_percent REAL DEFAULT 0,
        margin_price REAL DEFAULT 0,
        purchase_booking_qty REAL DEFAULT 0,
        sales_booking_qty REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
        FOREIGN KEY (small_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,
        FOREIGN KEY (large_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT
      )
    `);

    // setup :: Contacts table
    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        contact_id TEXT PRIMARY KEY,
        contact_name TEXT NOT NULL,
        contact_mobile TEXT,
        contact_email TEXT,
        contact_address TEXT,
        contact_type TEXT DEFAULT 'Customer',
        credit_limit REAL DEFAULT 0,
        payable_balance REAL DEFAULT 0,
        advance_balance REAL DEFAULT 0,
        current_balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // accounts :: transaction types table
    db.run(`
      CREATE TABLE IF NOT EXISTS accounts_heads (
        head_id TEXT PRIMARY KEY,
        head_name TEXT NOT NULL,
        from_account TEXT DEFAULT 'Customer',
        to_account TEXT DEFAULT 'Customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);


    // accounts :: Payments table
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        payment_id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL,
        master_id TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        source_name TEXT NOT NULL,
        payment_type TEXT NOT NULL,
        payment_head TEXT NOT NULL,
        payment_mode TEXT NOT NULL,
        payment_date TEXT NOT NULL,
        payment_amount REAL DEFAULT 0,
        payment_note TEXT,
        ref_no TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(contact_id) ON DELETE RESTRICT
      )
    `);

    // accounts :: Expense Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS exp_master (
        master_id TEXT PRIMARY KEY,
        shop_id TEXT NOT NULL,
        payment_head TEXT NOT NULL,
        payment_mode TEXT NOT NULL,
        payment_date TEXT NOT NULL,
        payment_amount REAL DEFAULT 0,
        payment_note TEXT,
        ref_no TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // sales :: Sales Master table
    db.run(`
      CREATE TABLE IF NOT EXISTS so_master (
        so_master_id TEXT PRIMARY KEY,
        order_type TEXT NOT NULL,
        order_no TEXT NOT NULL,
        order_date TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        ref_no TEXT,
        order_note TEXT,
        order_amount REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        vat_amount REAL DEFAULT 0,
        vat_payable BOOLEAN DEFAULT 0,
        order_cost REAL DEFAULT 0,
        cost_payable BOOLEAN DEFAULT 0,
        total_amount REAL DEFAULT 0,
        payable_amount REAL DEFAULT 0,
        paid_amount REAL DEFAULT 0,
        due_amount REAL DEFAULT 0,
        other_cost REAL DEFAULT 0,
        is_paid TEXT NOT NULL,
        is_posted BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        is_returned BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts (contact_id) ON DELETE RESTRICT
      )
    `);

    // sales :: Sales Details table
    db.run(`
      CREATE TABLE IF NOT EXISTS so_details (
        so_details_id TEXT PRIMARY KEY,
        so_master_id TEXT NOT NULL,
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
        FOREIGN KEY (so_master_id) REFERENCES so_master(so_master_id) ON DELETE RESTRICT,
        FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
      )
    `);

    // setup :: Transaction Configuration table
    db.run(`
      CREATE TABLE IF NOT EXISTS config_transaction (
        config_id TEXT PRIMARY KEY,
        config_name TEXT NOT NULL,
        contact_id TEXT NOT NULL,
        is_posted BOOLEAN DEFAULT 0,
        include_discount BOOLEAN DEFAULT 0,
        include_vat BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(contact_id) ON DELETE RESTRICT
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
      INSERT OR IGNORE INTO users (user_id, user_name, user_password, user_mobile, user_email, user_role) VALUES
      ('1', 'admin', 'password', '1234567890', 'admin@devkayesh.com', 'Admin'),
      ('2', 'user', 'password', '1234567890', 'user@devkayesh.com', 'User')
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
      stock_qty, purchase_price, sales_price, discount_percent, vat_percent, cost_price_percent, margin_price,
      purchase_booking_qty,sales_booking_qty)
      VALUES
      ('1', 'P01', 'Rice', 'Description Rice', '1', '1', 25, '2', '0', '80', '90', '2', '10', '5', '3.7', '0', '0'),
      ('2', 'P02', 'Salt', 'Description Salt', '1', '1', 15, '2', '0', '35', '42', '5', '15', '7', '1.54', '0', '0'),
      ('3', 'P03', 'Sugar', 'Description Sugar', '1', '1', 20, '2', '0', '50', '60', '10', '20', '5', '1', '0', '0'),
      ('4', 'P04', 'Oil', 'Description Oil', '1', '1', 5, '2', '0', '100', '115', '2', '5', '5', '6.95', '0', '0'),
      ('5', 'P05', 'Tea', 'Description Tea', '1', '1', 2, '2', '0', '70', '110', '15', '0', '10', '1.5', '0', '0')
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
      INSERT OR IGNORE INTO contacts (contact_id, contact_name, contact_mobile, contact_email, contact_address, contact_type,
      credit_limit, payable_balance, advance_balance, current_balance)
      VALUES
      ('cash', 'Cash A/C', '0', '0', 'for internal transaction', 'Cash', 0, 0, 0, 0),
      ('expense', 'Expense A/C', '0', '0', 'for internal transaction', 'Expense', 0, 0, 0, 0),
      ('income', 'Income A/C', '0', '0', 'for internal transaction', 'Income', 0, 0, 0, 0),
      ('inventory', 'Inventory A/C', '0', '0', 'for internal transaction', 'Inventory', 0, 0, 0, 0),
      ('both', 'Unknown Supplier and Purchaser A/C', '0', '0', 'default for purchase and sale transaction', 'Both', 0, 0, 0, 0),
      ('1', 'Supplier 1', '1234567890', 'supplier1@example.com', '123 Main St', 'Supplier',  5000000, 0, 0, 0),
      ('2', 'Supplier 2', '0987654321', 'supplier2@example.com', '456 Elm St', 'Supplier',  5000000, 0, 0, 0),
      ('3', 'Customer 1', '1234567890', 'customer1@example.com', '123 Main St', 'Customer',  5000000, 0, 0, 0),
      ('4', 'Customer 2', '0987654321', 'customer2@example.com', '456 Elm St', 'Customer', 5000000, 0, 0, 0)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default contacts:", err);
        } else {
          console.log("Default contacts inserted.");
        }
      }
    );

    //accounts :: Bank table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO banks (bank_id, bank_name, branch_name, swift_code, current_balance)
      VALUES
      ('1', 'Cash', 'Cash', 'CASH', 0)
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default bank:", err);
        } else {
          console.log("Default bank inserted.");
        }
      }
    );

    
    //accounts :: Accounts table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO accounts (account_id, bank_id, account_name, account_no, account_note, opening_date, current_balance, is_default)
      VALUES
      ('1', '1', 'Cash', 'Cash', 'Cash', strftime('%Y-%m-%d', 'now'), 0, 1) 
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default accounts:", err);
        } else {
          console.log("Default accounts inserted.");
        }
      }
    );

    //setup :: Transaction Configuration table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO config_transaction (config_id, config_name, contact_id, is_posted, include_discount, include_vat)
      VALUES
      ('1', 'Purchase', 'both', 0, 0, 1),
      ('2', 'Sales', 'both', 1, 1, 1)
    `,
      (err) => {
        if (err) {
          console.error(
            "Error inserting default transaction configuration:",
            err
          );
        } else {
          console.log("Default transaction configuration inserted.");
        }
      }
    );

    //settings default insert
    db.run(
      `
      INSERT OR IGNORE INTO settings (setting_id, setting_page, setting_name, setting_key, setting_value)
      VALUES
      ('1', 'Purchase Booking', '1. Posted', 'is_posted', '1'),
      ('2', 'Purchase Booking', '2. VAT Payable', 'is_vat_payable', '1'),
      ('3', 'Purchase Booking', '3. Include Discount', 'include_discount', '1'),
      ('4', 'Purchase Booking', '4. Include VAT', 'include_vat', '1'),

      ('5', 'Purchase Invoice', '1. Posted', 'is_posted', '1'),
      ('6', 'Purchase Invoice', '2. VAT Payable', 'is_vat_payable', '1'),
      ('7', 'Purchase Invoice', '3. Include Discount', 'include_discount', '1'),
      ('8', 'Purchase Invoice', '4. Include VAT', 'include_vat', '1'),

      ('9', 'Purchase Order', '1. Posted', 'is_posted', '1'),
      ('10', 'Purchase Order', '2. VAT Payable', 'is_vat_payable', '1'),
      ('11', 'Purchase Order', '3. Include Discount', 'include_discount', '1'),
      ('12', 'Purchase Order', '4. Include VAT', 'include_vat', '1'),
      
      ('13', 'Products', '1. Cost %', 'cost_price_percent', '10')
    `,
      (err) => {
        if (err) {
          console.error(
            "Error inserting default settings:",
            err
          );
        } else {
          console.log("Default settings inserted.");
        }
      }
    );

    //vat :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO vat_master (master_id, shop_id, source_name)
      VALUES
      ('any', '1', 'any')
    `,
      (err) => {
        if (err) {
          console.error(
            "Error inserting default vat master:",
            err
          );
        } else {
          console.log("Default vat master inserted.");
        }
      }
    );

  });
};

module.exports = { db, initTables, initData };
