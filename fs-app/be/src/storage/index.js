import path from "node:path";
import { FileBase } from "./engine.js";

const dataPath = path.resolve("data");

const db = new FileBase(dataPath);

export const DEFAULT_COLLECTIONS = [
  "banks",
  "accounts",
  "dps",
  "fd",
  "transactions",
  "example_docs"
];

export async function initializeStorage() {
  await db.initialize();
  // Ensure default collections exist
  for (const coll of DEFAULT_COLLECTIONS) {
    await db.collection(coll).ensureDirectory();
  }
  return db;
}

export default db;