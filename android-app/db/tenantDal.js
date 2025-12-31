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
  return await db.getAllAsync("SELECT * FROM tenant ORDER BY name ASC");
}

export async function getById(id) {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM tenant WHERE id = ?", [id]);
}

export async function getUnClosed() {
  const db = await getDb();
  const sql = `SELECT t.*, f.name || ' - ' || h.name as flat_name
  FROM tenant t
  JOIN flat f ON t.flat_id = f.id
  JOIN house h ON f.house_id = h.id
  WHERE t.contract_closed = 0`;
  return await db.getAllAsync(sql);
}


export async function getTenantByFlatId(id) {
  const db = await getDb();
  const sql = `SELECT *
  FROM tenant WHERE flat_id = ?
  ORDER BY contract_closed ASC`;
  return await db.getAllAsync(sql, [id]);
}

export async function add(item) {
  const db = await getDb();
  return await db.runAsync(
    "INSERT INTO tenant (flat_id, name, contact, image, contract_start_date, contract_end_date, rent, deposit, security, contract_closed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    item.flat_id,
    item.name,
    item.contact,
    item.image,
    item.contract_start_date,
    item.contract_end_date,
    item.rent,
    item.deposit,
    item.security,
    item.contract_closed
  );
}

export async function update(item) {
  const db = await getDb();
  return await db.runAsync(
    "UPDATE tenant SET flat_id = ?, name = ?, contact = ?, image = ?, contract_start_date = ?, contract_end_date = ?, rent = ?, deposit = ?, security = ?, contract_closed = ? WHERE id = ?",
    item.flat_id,
    item.name,
    item.contact,
    item.image,
    item.contract_start_date,
    item.contract_end_date,
    item.rent,
    item.deposit,
    item.security,
    item.contract_closed,
    item.id
  );
}

export async function deleteItem(id) {
  const db = await getDb();
  return await db.runAsync("DELETE FROM tenant WHERE id = ?", [id]);
}
