import path from "node:path";
import { FileBase } from "./engine.js";

const dataPath = path.resolve("data");

const db = new FileBase(dataPath);

export async function initializeStorage() {
  await db.initialize();
  // Ensure default collections exist
  for (const coll of ["customers", "items", "orders", "invoices"]) {
    await db.collection(coll).ensureDirectory();
  }
  return db;
}

export default db;