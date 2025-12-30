import * as SQLite from "expo-sqlite";

let db;

/**
 * Open database
 */
export async function openDatabase() {
  try {
    if (!db) {
      console.log("Opening database...");
      db = await SQLite.openDatabaseAsync("items.db");
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
