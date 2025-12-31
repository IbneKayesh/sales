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
  return await db.getAllAsync("SELECT * FROM flat ORDER BY name ASC");
}

export async function getById(id) {
  const db = await getDb();
  return await db.getAllAsync("SELECT * FROM flat WHERE id = ?", [id]);
}

export async function getByHouseId(id) {
  const db = await getDb();
  const sql = `SELECT f.*, fr.name as feature_name, fr.feature_type, fr.quantity
  FROM flat f
  LEFT JOIN features fr on f.id = fr.flat_id
  WHERE f.house_id = ?
  ORDER BY f.name ASC`;
  return await db.getAllAsync(sql, [id]);
}


export async function getToLet() {
  const db = await getDb();
  const sql = `SELECT f.*
  FROM flat f
  ORDER BY f.name ASC`;
  return await db.getAllAsync(sql);
}


export async function add(item) {
  const db = await getDb();
  return await db.runAsync(
    "INSERT INTO flat (house_id, name, contact, image, price, general_rules) VALUES (?, ?, ?, ?, ?, ?)",
    item.house_id,
    item.name,
    item.contact,
    item.image,
    item.price,
    item.general_rules
  );
}

export async function update(item) {
  const db = await getDb();
  return await db.runAsync(
    "UPDATE flat SET house_id = ?, name = ?, contact = ?, image = ?, price = ?, general_rules = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    item.house_id,
    item.name,
    item.contact,
    item.image,
    item.price,
    item.general_rules,
    item.id
  );
}

export async function deleteById(id) {
  const db = await getDb();
  return await db.runAsync("DELETE FROM flat WHERE id = ?", [id]);
}

export async function updatePrice() {
  const db = await getDb();
  const sql = `with fr as (
select flat_id, sum (price) as price
from features
group by flat_id
)
update flat
set price = (
select price from fr
where fr.flat_id = flat.id
)
where id in (
select flat_id from fr
)`;
  return await db.runAsync(sql);
}
