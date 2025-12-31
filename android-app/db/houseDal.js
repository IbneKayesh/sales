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
  const sql = `SELECT h.*, COUNT(f.id) AS flat_count
  FROM house h
  LEFT JOIN flat f ON h.id = f.house_id
  GROUP BY h.id
  ORDER BY h.name ASC`;
  return db.getAllAsync(sql);
}

export async function getById(id) {
  const db = await getDb();
  return db.getAllAsync("SELECT * FROM house WHERE id = ?", [id]);
}

export async function add(item) {
  const db = await getDb();
  return db.runAsync(
    "INSERT INTO house (name, address, contact, image, map_link, general_rules) VALUES (?, ?, ?, ?, ?, ?)",
    item.name,
    item.address,
    item.contact,
    item.image,
    item.map_link,
    item.general_rules
  );
}

export async function update(item) {
  const db = await getDb();
  return db.runAsync(
    "UPDATE house SET name = ?, address = ?, contact = ?, image = ?, map_link = ?, general_rules = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    item.name,
    item.address,
    item.contact,
    item.image,
    item.map_link,
    item.general_rules,
    item.id
  );
}

export async function deleteById(id) {
  const db = await getDb();
  return db.runAsync("DELETE FROM house WHERE id = ?", [id]);
}