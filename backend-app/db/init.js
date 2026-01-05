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

const banks_tables = require("./banks_tables");
const banksTables = banks_tables();


const purchase_tables = require("./purchase_tables");
const purchaseTables = purchase_tables();


const vat_tables = require("./vat_tables");
const vatTables = vat_tables();

// Initialize tables
const initTables = () => {
  Object.values(banksTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Banks Table creation error:", err.message);
      }
    });
  });

  // Object.values(inventoryTables).forEach((sql) => {
  //   db.exec(sql, (err) => {
  //     if (err) {
  //       console.error("Inventory Table creation error:", err.message);
  //     }
  //   });
  // });

  Object.values(purchaseTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Purchase Table creation error:", err.message);
      }
    });
  });

  // Object.values(userTables).forEach((sql) => {
  //   db.exec(sql, (err) => {
  //     if (err) {
  //       console.error("User Table creation error:", err.message);
  //     }
  //   });
  // });

  Object.values(vatTables).forEach((sql) => {
    db.exec(sql, (err) => {
      if (err) {
        console.error("Vat Table creation error:", err.message);
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
    // shops :: Authentication table :: insert default data
    // db.run(
    //   `
    //   INSERT OR IGNORE INTO shops (shop_id, shop_name, shop_address) VALUES
    //   ('1', 'Sand Grain Digital', 'Badda, Dhaka, Bangladesh')
    // `,
    //   (err) => {
    //     if (err) {
    //       console.error("Error inserting default shops:", err);
    //     } else {
    //       console.log("Default shops inserted.");
    //     }
    //   }
    // );

    // users :: Authentication table :: insert default data
    // db.run(
    //   `
    //   INSERT OR IGNORE INTO users (user_id, user_email, user_password, user_mobile, user_name, recovery_code, user_role, shop_id) VALUES
    //   ('1', 'admin@sgd.com', 'password', '1234567890', 'admin', 'admin-rc', 'Admin', '1'),
    //   ('2', 'user@sgd.com', 'password', '1234567890', 'user', 'user-rc', 'User', '1')
    // `,
    //   (err) => {
    //     if (err) {
    //       console.error("Error inserting default users:", err);
    //     } else {
    //       console.log("Default users inserted.");
    //     }
    //   }
    // );

    // units :: Inventory table :: insert default data
    // db.run(
    //   `
    //   INSERT OR IGNORE INTO units (unit_id, unit_name) VALUES
    //   ('1', 'Kg'),
    //   ('2', 'Pkt')
    // `,
    //   (err) => {
    //     if (err) {
    //       console.error("Error inserting default units:", err);
    //     } else {
    //       console.log("Default units inserted.");
    //     }
    //   }
    // );

    // categories :: Inventory table :: insert default data
    // db.run(
    //   `
    //   INSERT OR IGNORE INTO categories (category_id, category_name) VALUES
    //   ('1', 'Grocery')
    // `,
    //   (err) => {
    //     if (err) {
    //       console.error("Error inserting default categories:", err);
    //     } else {
    //       console.log("Default categories inserted.");
    //     }
    //   }
    // );

    //products :: Inventory table :: insert default data
    // db.run(
    //   `
    //   INSERT OR IGNORE INTO products (product_id, product_code, product_name, product_desc,
    //   category_id, small_unit_id, unit_difference_qty, large_unit_id,
    //   stock_qty, purchase_price, sales_price, discount_percent, vat_percent, cost_price_percent, margin_price,
    //   purchase_booking_qty,sales_booking_qty)
    //   VALUES
    //   ('1', 'P01', 'Rice', 'Description Rice', '1', '1', 25, '2', '0', '80', '90', '2', '10', '5', '3.7', '0', '0'),
    //   ('2', 'P02', 'Salt', 'Description Salt', '1', '1', 15, '2', '0', '35', '42', '5', '15', '7', '1.54', '0', '0'),
    //   ('3', 'P03', 'Sugar', 'Description Sugar', '1', '1', 20, '2', '0', '50', '60', '10', '20', '5', '1', '0', '0'),
    //   ('4', 'P04', 'Oil', 'Description Oil', '1', '1', 5, '2', '0', '100', '115', '2', '5', '5', '6.95', '0', '0'),
    //   ('5', 'P05', 'Tea', 'Description Tea', '1', '1', 2, '2', '0', '70', '110', '15', '0', '10', '1.5', '0', '0')
    // `,
    //   (err) => {
    //     if (err) {
    //       console.error("Error inserting default products:", err);
    //     } else {
    //       console.log("Default products inserted.");
    //     }
    //   }
    // );

    //contacts :: Contacts table :: insert default data


    //accounts :: Bank table :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO banks (bank_id, bank_name, branch_name, routing_no, current_balance)
      VALUES
      ('1', 'Cash', 'Cash', 'R1234', 0)
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
          console.error("Error inserting default settings:", err);
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
          console.error("Error inserting default vat master:", err);
        } else {
          console.log("Default vat master inserted.");
        }
      }
    );

    //accounts :: insert default data
    db.run(
      `
      INSERT OR IGNORE INTO accounts_heads (head_id, head_name, group_name, group_type ,contact_type)
      VALUES
      ('Z101', 'Sales Booking (+)', 'Sales', 'In', 'Customer'),
      ('Z102', 'Sales Invoice (-)', 'Sales', 'Out', 'Customer'),
      ('Z103', 'Sales Order (+)', 'Sales', 'In', 'Customer'),
      ('Z104', 'Sales Return (-)', 'Sales', 'Out', 'Customer'),
      ('Z105', 'Sales Customer Expense (+)', 'Sales', 'In', 'Customer'),
      ('Z106', 'Sales Expense (-)', 'Sales', 'Out', 'Internal'),
      ('Z107', 'Sales Discount (-)', 'Sales', 'Out', 'Internal'),
      ('Z108', 'Sales VAT (+)', 'Sales', 'Out', 'Internal'),


      ('Z201', 'Purchase Booking (-)', 'Purchases', 'Out', 'Supplier'),
      ('Z202', 'Purchase Invoice (+)', 'Purchases', 'In', 'Supplier'),
      ('Z203', 'Purchase Order (-)', 'Purchases', 'Out', 'Supplier'),
      ('Z204', 'Purchase Return (+)', 'Purchases', 'In', 'Supplier'),
      ('Z205', 'Purchase Purchase Expense (-)', 'Purchases', 'Out', 'Supplier'),
      ('Z206', 'Purchase Expense (-)', 'Purchases', 'Out', 'Internal'),
      ('Z207', 'Purchase Discount (+)', 'Purchases', 'In', 'Internal'),
      ('Z208', 'Purchase VAT (+)', 'Purchases', 'Out', 'Internal'),


      ('Z301', 'Stock Out (-)', 'Inventory', 'Out', 'Internal'),
      ('Z302', 'Stock In (+)', 'Inventory', 'In', 'Internal'),


      ('Z401', 'Gain (+)', 'Income', 'In', 'Internal'),
      ('Z402', 'Salary Deduction (+)', 'Income', 'In', 'Internal'),
      ('Z403', 'Rent Advance Received (+)', 'Income', 'In', 'Internal'),
      ('Z404', 'Rent Adjustment (+)', 'Income', 'In', 'Internal'),
      ('Z405', 'Bank Profit (+)', 'Income', 'In', 'Internal'),
      ('Z406', 'Loan Taken (+)', 'Income', 'In', 'Internal'),
      ('Z407', 'Deposit (+)', 'Income', 'In', 'Internal'),
      ('Z408', 'Asset Sale (+)', 'Assets', 'In', 'Internal'),      
      ('Z409', 'Other Income (+)', 'Income', 'In', 'Internal'),


      ('Z501', 'Loss (-)', 'Expense', 'Out', 'Internal'),
      ('Z502', 'Salary Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z503', 'Rent Advance Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z504', 'Rent Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z505', 'Electricity Bill (-)', 'Expense', 'Out', 'Internal'),
      ('Z506', 'Internet Bill (-)', 'Expense', 'Out', 'Internal'),
      ('Z507', 'Transport Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z508', 'Bank Charges (-)', 'Expense', 'Out', 'Internal'),
      ('Z509', 'Tax Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z510', 'Maintenance Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z511', 'Loan Payment (-)', 'Expense', 'Out', 'Internal'),
      ('Z512', 'Asset Purchase (-)', 'Assets', 'Out', 'Internal'),
      ('Z513', 'Other Expense (-)', 'Expense', 'Out', 'Internal'),
      ('Z514', 'Withdraw (-)', 'Income', 'Out', 'Internal'),

      
      ('Z601', 'Transfer Out (-)', 'Transfer', 'Out', 'Internal'),
      ('Z602', 'Transfer In (+)', 'Transfer', 'In', 'Internal')
      
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default accounts heads:", err);
        } else {
          console.log("Default accounts heads inserted.");
        }
      }
    );
  });
};

module.exports = { db, initTables, initData };
