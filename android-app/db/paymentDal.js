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
  return await db.getAllAsync("SELECT * FROM payment ORDER BY date DESC");
}

export async function getById(id) {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM payment WHERE id = ?", [id]);
}

export async function getByTenantId(id) {
  const db = await getDb();
  const sql = `SELECT p.*
  FROM payment p
  WHERE p.tenant_id = ?
  ORDER BY p.date DESC`;
  return await db.getAllAsync(sql, [id]);
}

export async function add(item) {
  const db = await getDb();
  return await db.runAsync(
    "INSERT INTO payment (tenant_id, flat_id, payment_type, amount, date, note) VALUES (?, ?, ?, ?, ?, ?)",
    item.tenant_id,
    item.flat_id,
    item.payment_type,
    item.amount,
    item.date,
    item.note
  );
}

export async function update(item) {
  const db = await getDb();
  return await db.runAsync(
    "UPDATE payment SET tenant_id = ?, flat_id = ?, payment_type = ?, amount = ?, date = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    item.tenant_id,
    item.flat_id,
    item.payment_type,
    item.amount,
    item.date,
    item.note,
    item.id
  );
}

export async function deleteById(id) {
  const db = await getDb();
  return await db.runAsync("DELETE FROM payment WHERE id = ?", [id]);
}