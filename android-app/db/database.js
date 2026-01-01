import * as SQLite from "expo-sqlite";

let db;

/**
 * Open database
 */
export async function openDatabase() {
  try {
    if (!db) {
      console.log("Opening database...");
      db = await SQLite.openDatabaseAsync("myhouse.db");
      console.log("Database opened successfully");
    }
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
}

/**
 * Create table
 */
export async function initDatabase() {
  const database = await openDatabase();

  // Drop the table if it exists
  // await database.execAsync(`
  //   DROP TABLE IF EXISTS items;
  // `);

  // Recreate the table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      priority INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //house table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS house (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      contact TEXT,
      image TEXT,
      map_link TEXT,
      general_rules TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //flat table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS flat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      house_id INTEGER,
      name TEXT NOT NULL,
      contact TEXT,
      image TEXT,
      price TEXT,
      general_rules TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //features table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flat_id INTEGER,
      name TEXT NOT NULL,
      feature_type TEXT NOT NULL,
      include_price INTEGER DEFAULT 1,
      price REAL DEFAULT 0,
      quantity INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //tenant table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS tenant (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flat_id INTEGER,
      name TEXT NOT NULL,
      contact TEXT,
      image TEXT,
      contract_start_date TEXT,
      contract_end_date TEXT,
      rent TEXT,
      deposit TEXT,
      security TEXT,
      contract_closed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //payment table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_id INTEGER,
      flat_id INTEGER,
      payment_type TEXT,
      amount TEXT,
      date TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //house notice board table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS house_notice_board (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      house_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  //flat notice board table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS flat_notice_board (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flat_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      date TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * CRUD helpers
 */
export async function getAllItems() {
  const database = await openDatabase();
  return await database.getAllAsync(
    "SELECT * FROM items ORDER BY priority DESC"
  );
}

export async function addItem(name, description, priority = 0) {
  try {
    const database = await openDatabase();
    const result = await database.runAsync(
      "INSERT INTO items (name, description, priority, completed, created_at, updated_at) VALUES (?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
      [name, description, priority]
    );
    console.log("Item added successfully, result:", result);
    return result;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
}

export async function updateItem(id, name, description, priority) {
  const database = await openDatabase();
  await database.runAsync(
    "UPDATE items SET name = ?, description = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [name, description, priority, id]
  );
}

export async function updateItemCompleted(id, completed) {
  const database = await openDatabase();
  await database.runAsync(
    "UPDATE items SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [completed ? 1 : 0, id]
  );
}

export async function deleteItem(id) {
  const database = await openDatabase();
  await database.runAsync("DELETE FROM items WHERE id = ?", [id]);
}
