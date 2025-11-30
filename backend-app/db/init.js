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
      ('1', 'Pcs'),
      ('2', 'Box')
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
      ('1', 'Grocery'),
      ('2', 'Biscuits')
    `,
      (err) => {
        if (err) {
          console.error("Error inserting default categories:", err);
        } else {
          console.log("Default categories inserted.");
        }
      }
    );
  });
};

module.exports = { db, initTables, initData };
