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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  //getAll
  //getById
  //add
  //update
  //delete
  
  import * as SQLite from "expo-sqlite";
  const db = await SQLite.openDatabaseAsync("myhouse.db");
  
  export async function getAll() {
    return await db.getAllAsync("SELECT * FROM tenant ORDER BY priority DESC");
  }
  
  export async function getById(id) {
    return await db.getAllAsync("SELECT * FROM tenant WHERE id = ?", [id]);
  }
  
  export async function add(item) {
    return await db.runAsync(
      "INSERT INTO house (name, priority, address, contact, image, map_link, general_rules) VALUES (?, ?, ?, ?, ?, ?, ?)",
      item.name,
      item.priority,
      item.address,
      item.contact,
      item.image,
      item.map_link,
      item.general_rules
    );
  }
  
  export async function update(item) {
    return await db.runAsync(
      "UPDATE house SET name = ?, priority = ?, address = ?, contact = ?, image = ?, map_link = ?, general_rules = ? WHERE id = ?",
      item.name,
      item.priority,
      item.address,
      item.contact,
      item.image,
      item.map_link,
      item.general_rules,
      item.id
    );
  }
  
  export async function deleteItem(id) {
    return await db.runAsync("DELETE FROM house WHERE id = ?", [id]);
  }
  