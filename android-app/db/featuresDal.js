import * as SQLite from "expo-sqlite";
let db;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("myhouse.db");
  }
  return db;
}

export async function getAll() {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM features ORDER BY name ASC");
}

export async function getById(id) {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM features WHERE id = ?", [id]);
}

export async function getByFlatId(id) {
  const db = await getDb();
  return await db.getAllAsync(
    "SELECT * FROM features WHERE flat_id = ? ORDER BY name ASC",
    [id]
  );
}

export async function add(item) {
  const db = await getDb();
  return await db.runAsync(
    "INSERT INTO features (flat_id, name, feature_type, include_price, price, quantity) VALUES (?, ?, ?, ?, ?, ?)",
    item.flat_id,
    item.name,
    item.feature_type,
    item.include_price,
    item.price,
    item.quantity
  );
}

export async function update(item) {
  const db = await getDb();
  return await db.runAsync(
    "UPDATE features SET flat_id = ?, name = ?, feature_type = ?, include_price = ?, price = ?, quantity = ? WHERE id = ?",
    item.flat_id,
    item.name,
    item.feature_type,
    item.include_price,
    item.price,
    item.quantity,
    item.id
  );
}

export async function deleteById(id) {
  const db = await getDb();
  return await db.runAsync("DELETE FROM features WHERE id = ?", [id]);
}
