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
        sale_price REAL DEFAULT 0,
        discount_percent REAL DEFAULT 0,
        tax_percent REAL DEFAULT 0,
        margin_price REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
        FOREIGN KEY (small_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT,
        FOREIGN KEY (large_unit_id) REFERENCES units(unit_id) ON DELETE RESTRICT
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
      ('1', 'KG'),
      ('2', 'Bulk')
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
      INSERT OR IGNORE INTO products (product_id, product_code, product_name, product_desc, category_id, small_unit_id, unit_difference_qty, large_unit_id,
      stock_qty, purchase_price, sale_price, discount_percent, tax_percent, margin_price)
      VALUES
      ('1', 'P-01', 'Rice', 'Description 1', '1', '1', 1, '1', '0', '80', '85', '0', '0', '5'),
      ('2', 'P-02', 'Salt', 'Description 2', '1', '1', 1, '1', '0', '35', '42', '0', '0', '7'),
      ('3', 'P-03', 'Sugar', 'Description 3', '1', '1', 1, '1', '0', '50', '55', '0', '0', '5'),
      ('4', 'P-04', 'Oil', 'Description 4', '1', '1', 1, '1', '0', '100', '105', '0', '0', '5'),
      ('5', 'P-05', 'Tea', 'Description 5', '1', '1', 1, '1', '0', '70', '80', '0', '0', '10')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default products:", err);
        } else {
          console.log("Default products inserted.");
        }
      }
    );
  });
};

module.exports = { db, initTables, initData };
