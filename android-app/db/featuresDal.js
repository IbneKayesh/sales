//getAll
//getById
//add
//update
//delete

import * as SQLite from "expo-sqlite";
const db = await SQLite.openDatabaseAsync("myhouse.db");

export async function getAll() {
  return await db.getAllAsync("SELECT * FROM features ORDER BY priority DESC");
}

export async function getById(id) {
  return await db.getAllAsync("SELECT * FROM features WHERE id = ?", [id]);
}

export async function add(item) {
  return await db.runAsync(
    "INSERT INTO features (name, priority, address, contact, image, price, general_rules) VALUES (?, ?, ?, ?, ?, ?, ?)",
    item.name,
    item.priority,
    item.address,
    item.contact,
    item.image,
    item.price,
    item.general_rules
  );
}

export async function update(item) {
  return await db.runAsync(
    "UPDATE features SET name = ?, priority = ?, address = ?, contact = ?, image = ?, price = ?, general_rules = ? WHERE id = ?",
    item.name,
    item.priority,
    item.address,
    item.contact,
    item.image,
    item.price,
    item.general_rules,
    item.id
  );
}

export async function deleteItem(id) {
  return await db.runAsync("DELETE FROM features WHERE id = ?", [id]);
}
